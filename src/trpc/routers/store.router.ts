// src/trpc/routers/store.router.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";
import { stores } from "@/db/schema";
import OpenAI from "openai";

const ai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// ─── AI: Generate store foundation from a prompt ──────────────────────────────

async function generateStoreFoundation(prompt: string) {
    const response = await ai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 1024,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content: `You are a creative e-commerce store designer.
Given a store concept, return a JSON object with:
- name: string (store name, 2-5 words)
- description: string (tagline / short description, max 120 chars)
- primaryColor: string (a hex color e.g. "#6366f1")
- designTokens: object with keys: fontFamily, borderRadius, accentColor, backgroundColor, textColor`,
            },
            {
                role: "user",
                content: `Create a store for: "${prompt}".`,
            },
        ],
    });

    const raw = response.choices[0].message.content ?? "{}";
    try {
        return JSON.parse(raw.replace(/```json|```/g, "").trim()) as {
            name: string;
            description: string;
            primaryColor: string;
            designTokens: Record<string, string>;
        };
    } catch {
        return {
            name: "My Store",
            description: prompt.slice(0, 120),
            primaryColor: "#6366f1",
            designTokens: {
                fontFamily: "Inter, sans-serif",
                borderRadius: "8px",
                accentColor: "#6366f1",
                backgroundColor: "#ffffff",
                textColor: "#111827",
            },
        };
    }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const storeRouter = createTRPCRouter({
    /**
     * POST /trpc/store.createStore
     * Onboarding flow — uses AI to generate design tokens from a natural-language prompt.
     */
    createStore: protectedProcedure
        .input(z.object({ prompt: z.string().min(5, "Please describe your store in at least 5 characters.") }))
        .mutation(async ({ ctx, input }) => {
            const generated = await generateStoreFoundation(input.prompt);
            const storeId = uuidv4();

            const [store] = await ctx.db
                .insert(stores)
                .values({
                    id: storeId,
                    ownerId: ctx.user.id,
                    name: generated.name,
                    description: generated.description,
                    primaryColor: generated.primaryColor,
                    designTokens: generated.designTokens,
                    isPublic: true,
                })
                .returning();

            return store;
        }),

    /**
     * GET /trpc/store.getStore
     * Fetch a single store — verifies ownership for dashboard access.
     */
    getStore: protectedProcedure
        .input(z.object({ storeId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const store = await ctx.db.query.stores.findFirst({
                where: eq(stores.id, input.storeId),
            });

            if (!store) throw new TRPCError({ code: "NOT_FOUND", message: "Store not found." });

            // Only the owner can view private settings
            const isOwner = store.ownerId === ctx.user.id;
            if (!isOwner && !store.isPublic) {
                throw new TRPCError({ code: "FORBIDDEN", message: "This store is private." });
            }

            return { ...store, isOwner };
        }),

    /**
     * GET /trpc/store.getMyStore
     * Dashboard — fetch the current user's store (first one found).
     */
    getMyStore: protectedProcedure
        .query(async ({ ctx }) => {
            const store = await ctx.db.query.stores.findFirst({
                where: eq(stores.ownerId, ctx.user.id),
            });

            return store ?? null;
        }),

    /**
     * GET /trpc/store.listAllStores
     * Public Explore page — cursor-based pagination.
     */
    listAllStores: publicProcedure
        .input(
            z.object({
                cursor: z.number().int().min(0).optional().default(0),
                limit: z.number().int().min(1).max(50).optional().default(12),
            })
        )
        .query(async ({ ctx, input }) => {
            const { cursor, limit } = input;

            const rows = await ctx.db.query.stores.findMany({
                where: eq(stores.isPublic, true),
                orderBy: [desc(stores.createdAt)],
                limit: limit + 1, // fetch one extra to determine if there's a next page
                offset: cursor,
                columns: {
                    id: true,
                    name: true,
                    description: true,
                    logoUrl: true,
                    bannerUrl: true,
                    primaryColor: true,
                    createdAt: true,
                },
            });

            const hasNextPage = rows.length > limit;
            const items = hasNextPage ? rows.slice(0, limit) : rows;

            return {
                items,
                nextCursor: hasNextPage ? cursor + limit : null,
                total: items.length,
            };
        }),

    /**
     * PATCH /trpc/store.updateStore
     * Update store branding / settings.
     */
    updateStore: protectedProcedure
        .input(
            z.object({
                storeId: z.string().uuid(),
                name: z.string().min(2).max(255).optional(),
                description: z.string().max(500).optional(),
                logoUrl: z.string().url().optional(),
                bannerUrl: z.string().url().optional(),
                isPublic: z.boolean().optional(),
                primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
                stitchProjectId: z.string().optional(),
                designTokens: z.record(z.string(), z.string()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { storeId, ...updates } = input;

            const store = await ctx.db.query.stores.findFirst({
                where: and(eq(stores.id, storeId), eq(stores.ownerId, ctx.user.id)),
            });

            if (!store) throw new TRPCError({ code: "NOT_FOUND", message: "Store not found or access denied." });

            const [updated] = await ctx.db
                .update(stores)
                .set({ ...updates, updatedAt: new Date() })
                .where(eq(stores.id, storeId))
                .returning();

            return updated;
        }),

    /**
     * DELETE /trpc/store.deleteStore
     */
    deleteStore: protectedProcedure
        .input(z.object({ storeId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const store = await ctx.db.query.stores.findFirst({
                where: and(eq(stores.id, input.storeId), eq(stores.ownerId, ctx.user.id)),
            });

            if (!store) throw new TRPCError({ code: "NOT_FOUND", message: "Store not found or access denied." });

            await ctx.db.delete(stores).where(eq(stores.id, input.storeId));
            return { success: true };
        }),
});
