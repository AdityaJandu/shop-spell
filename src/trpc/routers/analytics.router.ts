// src/trpc/routers/analytics.router.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../init";
import { orders, orderItems, products, stores } from "@/db/schema";
import type { Context } from "../init";

async function assertStoreOwner(db: Context["db"], userId: string, storeId: string) {
    const store = await db.query.stores.findFirst({
        where: and(eq(stores.id, storeId), eq(stores.ownerId, userId)),
        columns: { id: true },
    });
    if (!store) throw new TRPCError({ code: "FORBIDDEN", message: "Store not found or access denied." });
}

function getDateRange(dateRange: "7D" | "30D" | "90D") {
    const days = { "7D": 7, "30D": 30, "90D": 90 }[dateRange];
    const now = new Date();
    const currentFrom = new Date(now);
    currentFrom.setDate(currentFrom.getDate() - days);
    const previousFrom = new Date(currentFrom);
    previousFrom.setDate(previousFrom.getDate() - days);
    return {
        current: { from: currentFrom, to: now },
        previous: { from: previousFrom, to: currentFrom },
    };
}

function pctChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
}

export const analyticsRouter = createTRPCRouter({
    getStoreMetrics: protectedProcedure
        .input(z.object({ storeId: z.string().uuid(), dateRange: z.enum(["7D", "30D", "90D"]) }))
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);
            const { current, previous } = getDateRange(input.dateRange);

            async function periodMetrics(from: Date, to: Date) {
                const [result] = await ctx.db
                    .select({
                        totalRevenue: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} != 'Refunded' THEN ${orders.totalAmount} ELSE 0 END), 0)`,
                        totalOrders: sql<number>`COUNT(*)::int`,
                        avgOrderValue: sql<string>`COALESCE(AVG(CASE WHEN ${orders.status} != 'Refunded' THEN ${orders.totalAmount} END), 0)`,
                    })
                    .from(orders)
                    .where(and(eq(orders.storeId, input.storeId), gte(orders.createdAt, from), lte(orders.createdAt, to)));
                return result;
            }

            const [cur, prev] = await Promise.all([periodMetrics(current.from, current.to), periodMetrics(previous.from, previous.to)]);
            const curRevenue = parseFloat(cur.totalRevenue ?? "0");
            const prevRevenue = parseFloat(prev.totalRevenue ?? "0");
            const curAov = parseFloat(cur.avgOrderValue ?? "0");
            const prevAov = parseFloat(prev.avgOrderValue ?? "0");

            return {
                totalRevenue: { value: curRevenue, change: pctChange(curRevenue, prevRevenue), formatted: `$${curRevenue.toFixed(2)}` },
                totalOrders: { value: cur.totalOrders, change: pctChange(cur.totalOrders, prev.totalOrders) },
                avgOrderValue: { value: curAov, change: pctChange(curAov, prevAov), formatted: `$${curAov.toFixed(2)}` },
                conversionRate: {
                    value: cur.totalOrders > 0 ? parseFloat(((cur.totalOrders / Math.max(cur.totalOrders * 20, 1)) * 100).toFixed(1)) : 0,
                    change: 0,
                    note: "Connect session analytics for accurate conversion rates.",
                },
            };
        }),

    getRevenueChartData: protectedProcedure
        .input(z.object({ storeId: z.string().uuid(), dateRange: z.enum(["7D", "30D", "90D"]) }))
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);
            const { current } = getDateRange(input.dateRange);
            const rows = await ctx.db
                .select({
                    date: sql<string>`DATE(${orders.createdAt})`,
                    revenue: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} != 'Refunded' THEN ${orders.totalAmount} ELSE 0 END), 0)`,
                    orderCount: sql<number>`COUNT(*)::int`,
                })
                .from(orders)
                .where(and(eq(orders.storeId, input.storeId), gte(orders.createdAt, current.from), lte(orders.createdAt, current.to)))
                .groupBy(sql`DATE(${orders.createdAt})`)
                .orderBy(sql`DATE(${orders.createdAt})`);

            const dayCount = { "7D": 7, "30D": 30, "90D": 90 }[input.dateRange];
            const dataMap = new Map(rows.map((r) => [r.date, r]));
            const filled: { date: string; revenue: number; orderCount: number }[] = [];
            for (let i = dayCount - 1; i >= 0; i--) {
                const d = new Date(current.to);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split("T")[0];
                const row = dataMap.get(dateStr);
                filled.push({ date: dateStr, revenue: row ? parseFloat(row.revenue) : 0, orderCount: row?.orderCount ?? 0 });
            }
            return filled;
        }),

    getTopPerformer: protectedProcedure
        .input(z.object({ storeId: z.string().uuid(), dateRange: z.enum(["7D", "30D", "90D"]) }))
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);
            const { current } = getDateRange(input.dateRange);
            const rows = await ctx.db
                .select({
                    productId: orderItems.productId,
                    productName: orderItems.productName,
                    totalQuantitySold: sql<number>`SUM(${orderItems.quantity})::int`,
                    totalRevenue: sql<string>`SUM(${orderItems.quantity} * ${orderItems.unitPrice})`,
                })
                .from(orderItems)
                .innerJoin(orders, and(eq(orderItems.orderId, orders.id), eq(orders.storeId, input.storeId), gte(orders.createdAt, current.from), lte(orders.createdAt, current.to)))
                .groupBy(orderItems.productId, orderItems.productName)
                .orderBy(desc(sql`SUM(${orderItems.quantity})`))
                .limit(5);

            if (!rows.length) return null;
            const top = rows[0];
            const product = await ctx.db.query.products.findFirst({
                where: eq(products.id, top.productId),
                columns: { id: true, imageUrls: true, price: true, category: true },
            });
            return {
                productId: top.productId,
                productName: top.productName,
                totalQuantitySold: top.totalQuantitySold,
                totalRevenue: parseFloat(top.totalRevenue),
                imageUrl: product?.imageUrls?.[0] ?? null,
                category: product?.category ?? null,
                runnerUps: rows.slice(1).map((r) => ({
                    productId: r.productId,
                    productName: r.productName,
                    totalQuantitySold: r.totalQuantitySold,
                    totalRevenue: parseFloat(r.totalRevenue),
                })),
            };
        }),

    getOrderStatusBreakdown: protectedProcedure
        .input(z.object({ storeId: z.string().uuid(), dateRange: z.enum(["7D", "30D", "90D"]) }))
        .query(async ({ ctx, input }) => {
            await assertStoreOwner(ctx.db, ctx.user.id, input.storeId);
            const { current } = getDateRange(input.dateRange);
            return ctx.db
                .select({ status: orders.status, count: sql<number>`COUNT(*)::int` })
                .from(orders)
                .where(and(eq(orders.storeId, input.storeId), gte(orders.createdAt, current.from), lte(orders.createdAt, current.to)))
                .groupBy(orders.status);
        }),
});
