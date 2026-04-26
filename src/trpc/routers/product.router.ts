// src/trpc/routers/product.router.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, ilike, or, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";
import { products, stores } from "@/db/schema";
import type { Context } from "../init";
import OpenAI from "openai";
const ai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// ─── Helper: verify store ownership ──────────────────────────────────────────

async function assertStoreOwner(db: Context["db"], userId: string, storeId: string) {
    const store = await db.query.stores.findFirst({
        where: and(eq(stores.id, storeId), eq(stores.ownerId, userId)),
        columns: { id: true },
    });
    if (!store) throw new TRPCError({ code: "FORBIDDEN", message: "Store not found or access denied." });
    return store;
}

// ─── AI: Generate product description ────────────────────────────────────────

async function generateProductDescription(name: string, prompt: string, category: string): Promise<string> {
    const res = await ai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 300,
        messages: [
            {
                role: "system",
                content: "You are a sharp e-commerce copywriter. Write compelling, concise product descriptions (2–3 sentences max). No fluff, no emojis.",
            },
            {
                role: "user",
                content: `Product: "${name}"\nCategory: ${category}\nContext: ${prompt}\n\nWrite the description.`,
            },
        ],
    });
    return res.choices[0].message.content?.trim() ?? "";
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const productRouter = createTRPCRouter({
    /**
     * POST /trpc/product.createProduct
     * Add a product; optionally auto-generate description via AI.
     */
    createProduct: protectedProcedure
        .input(
            z.object({
                storeId: z.string(),
                name: z.string().min(2).max(255),
                price: z.number().positive(),
                stock: z.number().int().min(0),
                category: z.string().min(1).max(100),
                imageUrls: z.array(z.string().url()).default([]),
                prompt: z.string().optional(), // AI description prompt
                description: z.string().optional(), // manual description (takes precedence if provided)
            })
        )
        .mutation(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);

            let description = input.description ?? null;

            // If no manual description but an AI prompt was given, generate one
            if (!description && input.prompt) {
                description = await generateProductDescription(input.name, input.prompt, input.category);
            }

            const [product] = await ctx.db
                .insert(products)
                .values({
                    id: uuidv4(),
                    storeId: input.storeId,
                    name: input.name,
                    price: String(input.price),
                    stock: input.stock,
                    category: input.category,
                    imageUrls: input.imageUrls,
                    description,
                    isActive: true,
                    totalSold: 0,
                })
                .returning();

            return product;
        }),

    /**
     * GET /trpc/product.listStoreProducts
     * Products page — full store inventory with search/filter.
     */
    listStoreProducts: protectedProcedure
        .input(
            z.object({
                storeId: z.string(),
                search: z.string().optional(),
                category: z.string().optional(),
                onlyActive: z.boolean().optional().default(true),
            })
        )
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);

            const conditions = [eq(products.storeId, input.storeId)];

            if (input.onlyActive) conditions.push(eq(products.isActive, true));

            if (input.search) {
                const term = `%${input.search}%`;
                conditions.push(
                    or(ilike(products.name, term), ilike(products.description, term))!
                );
            }

            if (input.category) conditions.push(eq(products.category, input.category));

            const rows = await ctx.db.query.products.findMany({
                where: and(...conditions),
                orderBy: [desc(products.createdAt)],
            });

            return rows;
        }),

    /**
     * GET /trpc/product.listMarketplaceProducts
     * Explore page — featured / trending products across all public stores.
     */
    listMarketplaceProducts: publicProcedure
        .input(
            z.object({
                category: z.string().optional(),
                limit: z.number().int().min(1).max(100).optional().default(24),
                cursor: z.number().int().min(0).optional().default(0),
            })
        )
        .query(async ({ ctx, input }) => {
            const conditions = [eq(products.isActive, true)];

            if (input.category) conditions.push(eq(products.category, input.category));

            // Only show products from public stores
            const rows = await ctx.db
                .select({
                    id: products.id,
                    storeId: products.storeId,
                    name: products.name,
                    description: products.description,
                    price: products.price,
                    imageUrls: products.imageUrls,
                    category: products.category,
                    totalSold: products.totalSold,
                    storeName: stores.name,
                    storeLogoUrl: stores.logoUrl,
                })
                .from(products)
                .innerJoin(stores, and(eq(products.storeId, stores.id), eq(stores.isPublic, true)))
                .where(and(...conditions))
                .orderBy(desc(products.totalSold)) // trending = most sold
                .limit(input.limit + 1)
                .offset(input.cursor);

            const hasNextPage = rows.length > input.limit;
            return {
                items: hasNextPage ? rows.slice(0, input.limit) : rows,
                nextCursor: hasNextPage ? input.cursor + input.limit : null,
            };
        }),

    /**
     * GET /trpc/product.getProduct
     */
    getProduct: protectedProcedure
        .input(z.object({ productId: z.string() }))
        .query(async ({ ctx, input }) => {
            const product = await ctx.db.query.products.findFirst({
                where: eq(products.id, input.productId),
            });

            if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });

            // verify ownership
            await assertStoreOwner(ctx.db, ctx.user.id, product.storeId);

            return product;
        }),

    /**
     * PATCH /trpc/product.updateProduct
     */
    updateProduct: protectedProcedure
        .input(
            z.object({
                productId: z.string(),
                name: z.string().min(2).max(255).optional(),
                description: z.string().optional(),
                price: z.number().positive().optional(),
                stock: z.number().int().min(0).optional(),
                category: z.string().max(100).optional(),
                imageUrls: z.array(z.string().url()).optional(),
                isActive: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { productId, price, ...rest } = input;

            const existing = await ctx.db.query.products.findFirst({
                where: eq(products.id, productId),
                columns: { storeId: true },
            });
            if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
            await assertStoreOwner(ctx.db, ctx.user.id, existing.storeId);

            const [updated] = await ctx.db
                .update(products)
                .set({ ...rest, ...(price !== undefined ? { price: String(price) } : {}), updatedAt: new Date() })
                .where(eq(products.id, productId))
                .returning();

            return updated;
        }),

    /**
     * DELETE /trpc/product.deleteProduct
     */
    deleteProduct: protectedProcedure
        .input(z.object({ productId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.db.query.products.findFirst({
                where: eq(products.id, input.productId),
                columns: { storeId: true },
            });
            if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
            await assertStoreOwner(ctx.db, ctx.user.id, existing.storeId);

            await ctx.db.delete(products).where(eq(products.id, input.productId));
            return { success: true };
        }),

    /**
     * GET /trpc/product.listCategories
     * Returns distinct categories for the store (for filter UI).
     */
    listCategories: protectedProcedure
        .input(z.object({ storeId: z.string() }))
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);

            const rows = await ctx.db
                .selectDistinct({ category: products.category })
                .from(products)
                .where(and(eq(products.storeId, input.storeId), eq(products.isActive, true)));

            return rows.map((r) => r.category).filter(Boolean) as string[];
        }),
});
