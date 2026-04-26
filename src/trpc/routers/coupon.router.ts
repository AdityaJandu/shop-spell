// src/trpc/routers/coupon.router.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, protectedProcedure } from "../init";
import { coupons, stores } from "@/db/schema";
import type { Context } from "../init";

async function assertStoreOwner(db: Context["db"], userId: string, storeId: string) {
    const store = await db.query.stores.findFirst({
        where: and(eq(stores.id, storeId), eq(stores.ownerId, userId)),
        columns: { id: true },
    });
    if (!store) throw new TRPCError({ code: "FORBIDDEN", message: "Store not found or access denied." });
}

export const couponRouter = createTRPCRouter({
    createCoupon: protectedProcedure
        .input(z.object({
            storeId: z.string().uuid(),
            code: z.string().min(3).max(50).toUpperCase().regex(/^[A-Z0-9_-]+$/, "Code may only contain letters, numbers, underscores and dashes."),
            discountAmount: z.number().positive(),
            discountType: z.enum(["percentage", "fixed"]),
            maxUses: z.number().int().positive(),
            expiryDate: z.date().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);
            if (input.discountType === "percentage" && input.discountAmount > 100) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Percentage discount cannot exceed 100%." });
            }
            const existing = await ctx.db.query.coupons.findFirst({
                where: and(eq(coupons.storeId, input.storeId), eq(coupons.code, input.code), eq(coupons.isActive, true)),
            });
            if (existing) {
                throw new TRPCError({ code: "CONFLICT", message: `Coupon code "${input.code}" already exists in this store.` });
            }
            const [coupon] = await ctx.db.insert(coupons).values({
                id: uuidv4(),
                storeId: input.storeId,
                code: input.code,
                discountAmount: String(input.discountAmount),
                discountType: input.discountType,
                maxUses: input.maxUses,
                currentUses: 0,
                expiryDate: input.expiryDate ?? null,
                isActive: true,
            }).returning();
            return coupon;
        }),

    listCoupons: protectedProcedure
        .input(z.object({ storeId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);
            const rows = await ctx.db.query.coupons.findMany({
                where: eq(coupons.storeId, input.storeId),
                orderBy: [desc(coupons.createdAt)],
            });
            const now = new Date();
            return rows.map((c) => ({
                ...c,
                isExpired: c.expiryDate ? c.expiryDate < now : false,
                isExhausted: c.currentUses >= c.maxUses,
                usagePercent: Math.min(100, Math.round((c.currentUses / c.maxUses) * 100)),
            }));
        }),

    validateCoupon: protectedProcedure
        .input(z.object({
            storeId: z.string().uuid(),
            code: z.string().toUpperCase(),
            orderTotal: z.number().positive(),
        }))
        .query(async ({ ctx, input }) => {
            const coupon = await ctx.db.query.coupons.findFirst({
                where: and(eq(coupons.storeId, input.storeId), eq(coupons.code, input.code), eq(coupons.isActive, true)),
            });
            if (!coupon) return { valid: false as const, reason: "Coupon code not found." };
            const now = new Date();
            if (coupon.expiryDate && coupon.expiryDate < now) return { valid: false as const, reason: "This coupon has expired." };
            if (coupon.currentUses >= coupon.maxUses) return { valid: false as const, reason: "This coupon has reached its usage limit." };
            const discountAmt = coupon.discountType === "percentage"
                ? (input.orderTotal * Number(coupon.discountAmount)) / 100
                : Math.min(Number(coupon.discountAmount), input.orderTotal);
            return {
                valid: true as const,
                discountAmount: parseFloat(discountAmt.toFixed(2)),
                discountType: coupon.discountType,
                finalTotal: parseFloat((input.orderTotal - discountAmt).toFixed(2)),
                couponId: coupon.id,
            };
        }),

    deleteCoupon: protectedProcedure
        .input(z.object({ couponId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const coupon = await ctx.db.query.coupons.findFirst({
                where: eq(coupons.id, input.couponId),
                columns: { storeId: true },
            });
            if (!coupon) throw new TRPCError({ code: "NOT_FOUND", message: "Coupon not found." });
            await assertStoreOwner(ctx.db, ctx.user.id, coupon.storeId);
            const [updated] = await ctx.db.update(coupons).set({ isActive: false }).where(eq(coupons.id, input.couponId)).returning();
            return { success: true, coupon: updated };
        }),
});
