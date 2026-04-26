// src/trpc/routers/order.router.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../init";
import { orders, stores } from "@/db/schema";
import type { Context } from "../init";

async function assertStoreOwner(db: Context["db"], userId: string, storeId: string) {
    const store = await db.query.stores.findFirst({
        where: and(eq(stores.id, storeId), eq(stores.ownerId, userId)),
        columns: { id: true },
    });
    if (!store) throw new TRPCError({ code: "FORBIDDEN", message: "Store not found or access denied." });
}

function parseDateRange(dateRange?: string): { from: Date; to: Date } | null {
    if (!dateRange) return null;
    const now = new Date();
    const map: Record<string, number> = { "7D": 7, "30D": 30, "90D": 90 };
    const days = map[dateRange];
    if (!days) return null;
    const from = new Date(now);
    from.setDate(from.getDate() - days);
    return { from, to: now };
}

export const orderRouter = createTRPCRouter({
    listStoreOrders: protectedProcedure
        .input(z.object({
            storeId: z.string().uuid(),
            status: z.enum(["New", "Processing", "Shipped", "Delivered", "Refunded"]).optional(),
            dateRange: z.string().optional(),
            cursor: z.number().int().min(0).optional().default(0),
            limit: z.number().int().min(1).max(100).optional().default(20),
        }))
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);
            const conditions = [eq(orders.storeId, input.storeId)];
            if (input.status) conditions.push(eq(orders.status, input.status as any));
            const range = parseDateRange(input.dateRange);
            if (range) {
                conditions.push(gte(orders.createdAt, range.from));
                conditions.push(lte(orders.createdAt, range.to));
            }
            const rows = await ctx.db.query.orders.findMany({
                where: and(...conditions),
                orderBy: [desc(orders.createdAt)],
                limit: input.limit + 1,
                offset: input.cursor,
                with: { items: true },
            });
            const hasNextPage = rows.length > input.limit;
            return {
                items: hasNextPage ? rows.slice(0, input.limit) : rows,
                nextCursor: hasNextPage ? input.cursor + input.limit : null,
            };
        }),

    getOrder: protectedProcedure
        .input(z.object({ orderId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const order = await ctx.db.query.orders.findFirst({
                where: eq(orders.id, input.orderId),
                with: { items: true },
            });
            if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
            await assertStoreOwner(ctx.db, ctx.user.id, order.storeId);
            return order;
        }),

    updateOrderStatus: protectedProcedure
        .input(z.object({
            orderId: z.string().uuid(),
            status: z.enum(["New", "Processing", "Shipped", "Delivered", "Refunded"]),
        }))
        .mutation(async ({ ctx, input }) => {
            const order = await ctx.db.query.orders.findFirst({
                where: eq(orders.id, input.orderId),
                columns: { id: true, storeId: true, status: true },
            });
            if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
            await assertStoreOwner(ctx.db, ctx.user.id, order.storeId);
            const allowed: Record<string, string[]> = {
                New: ["Processing", "Refunded"],
                Processing: ["Shipped", "Refunded"],
                Shipped: ["Delivered", "Refunded"],
                Delivered: ["Refunded"],
                Refunded: [],
            };
            if (!allowed[order.status]?.includes(input.status)) {
                throw new TRPCError({ code: "BAD_REQUEST", message: `Cannot transition from "${order.status}" to "${input.status}".` });
            }
            const [updated] = await ctx.db.update(orders).set({ status: input.status as any, updatedAt: new Date() }).where(eq(orders.id, input.orderId)).returning();
            return updated;
        }),

    getRecentOrders: protectedProcedure
        .input(z.object({
            storeId: z.string().uuid(),
            limit: z.number().int().min(1).max(20).optional().default(5),
        }))
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);
            return ctx.db.query.orders.findMany({
                where: eq(orders.storeId, input.storeId),
                orderBy: [desc(orders.createdAt)],
                limit: input.limit,
                columns: { id: true, customerName: true, customerEmail: true, totalAmount: true, status: true, createdAt: true },
            });
        }),
});
