// src/trpc/routers/ai.router.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../init";
import { chatMessages, stores, products, orders } from "@/db/schema";
import type { Context } from "../init";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const ai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// ─── Tool definitions ─────────────────────────────────────────────────────────

const TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "get_store_analytics",
            description: "Retrieve revenue, orders, and AOV metrics for the store.",
            parameters: {
                type: "object",
                properties: { dateRange: { type: "string", enum: ["7D", "30D", "90D"], description: "Time window for the metrics." } },
                required: ["dateRange"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_products",
            description: "List products in the store, optionally filtered by category or search term.",
            parameters: {
                type: "object",
                properties: { search: { type: "string" }, category: { type: "string" } },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "create_product",
            description: "Create a new product in the store with AI-generated description.",
            parameters: {
                type: "object",
                properties: {
                    name: { type: "string" }, price: { type: "number" }, stock: { type: "number" },
                    category: { type: "string" }, description: { type: "string" },
                    imageUrls: { type: "array", items: { type: "string" } },
                },
                required: ["name", "price", "stock", "category"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_recent_orders",
            description: "Get the most recent orders for the store.",
            parameters: {
                type: "object",
                properties: {
                    limit: { type: "number", description: "Number of orders to return (default 5)." },
                    status: { type: "string", enum: ["New", "Processing", "Shipped", "Delivered", "Refunded"] },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_top_products",
            description: "Return the best-selling products in a date range.",
            parameters: {
                type: "object",
                properties: { dateRange: { type: "string", enum: ["7D", "30D", "90D"] } },
                required: ["dateRange"],
            },
        },
    },
];

// ─── Tool Executor ────────────────────────────────────────────────────────────

async function executeTool(toolName: string, toolInput: Record<string, any>, storeId: string, db: Context["db"]): Promise<string> {
    try {
        switch (toolName) {
            case "get_store_analytics": {
                const days = { "7D": 7, "30D": 30, "90D": 90 }[toolInput.dateRange as string] ?? 30;
                const from = new Date();
                from.setDate(from.getDate() - days);
                const result = await db.execute(
                    `SELECT COALESCE(SUM(CASE WHEN status != 'Refunded' THEN total_amount ELSE 0 END), 0) as revenue, COUNT(*)::int as order_count, COALESCE(AVG(CASE WHEN status != 'Refunded' THEN total_amount END), 0) as aov FROM orders WHERE store_id = '${storeId}' AND created_at >= '${from.toISOString()}'`
                );
                const row = (result as any)[0];
                return JSON.stringify({ dateRange: toolInput.dateRange, totalRevenue: parseFloat(row?.revenue ?? "0"), totalOrders: row?.order_count ?? 0, avgOrderValue: parseFloat(row?.aov ?? "0") });
            }
            case "list_products": {
                const rows = await db.query.products.findMany({
                    where: eq(products.storeId, storeId),
                    columns: { id: true, name: true, price: true, stock: true, category: true, isActive: true },
                    limit: 20,
                });
                return JSON.stringify(rows);
            }
            case "create_product": {
                const [product] = await db.insert(products).values({
                    id: uuidv4(), storeId, name: toolInput.name, price: String(toolInput.price),
                    stock: toolInput.stock ?? 0, category: toolInput.category,
                    description: toolInput.description ?? null, imageUrls: toolInput.imageUrls ?? [],
                    isActive: true, totalSold: 0,
                }).returning();
                return JSON.stringify({ success: true, product });
            }
            case "list_recent_orders": {
                const rows = await db.query.orders.findMany({
                    where: eq(orders.storeId, storeId),
                    orderBy: [desc(orders.createdAt)],
                    limit: toolInput.limit ?? 5,
                    columns: { id: true, customerName: true, totalAmount: true, status: true, createdAt: true },
                });
                return JSON.stringify(rows);
            }
            case "get_top_products": {
                const days = { "7D": 7, "30D": 30, "90D": 90 }[toolInput.dateRange as string] ?? 30;
                const from = new Date();
                from.setDate(from.getDate() - days);
                const rows = await db.execute(
                    `SELECT oi.product_name, SUM(oi.quantity)::int as total_sold, SUM(oi.quantity * oi.unit_price) as revenue FROM order_items oi INNER JOIN orders o ON oi.order_id = o.id WHERE o.store_id = '${storeId}' AND o.created_at >= '${from.toISOString()}' AND o.status != 'Refunded' GROUP BY oi.product_id, oi.product_name ORDER BY total_sold DESC LIMIT 5`
                );
                return JSON.stringify(rows);
            }
            default:
                return JSON.stringify({ error: `Unknown tool: ${toolName}` });
        }
    } catch (err: any) {
        return JSON.stringify({ error: err.message });
    }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const aiRouter = createTRPCRouter({
    sendMessage: protectedProcedure
        .input(z.object({ storeId: z.string().uuid(), message: z.string().min(1).max(4000) }))
        .mutation(async ({ ctx, input }) => {
            const store = await ctx.db.query.stores.findFirst({
                where: and(eq(stores.id, input.storeId), eq(stores.ownerId, ctx.user.id)),
            });
            if (!store) throw new TRPCError({ code: "FORBIDDEN", message: "Store not found." });

            const history = await ctx.db.query.chatMessages.findMany({
                where: eq(chatMessages.storeId, input.storeId),
                orderBy: [desc(chatMessages.createdAt)],
                limit: 20,
            });
            history.reverse();

            await ctx.db.insert(chatMessages).values({ storeId: input.storeId, role: "user", content: input.message });

            const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
                {
                    role: "system",
                    content: `You are a sharp, friendly AI assistant for the e-commerce store "${store.name}". You have access to tools that let you query analytics, manage products, and view orders. Always be concise and actionable. Today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`,
                },
                ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
                { role: "user", content: input.message },
            ];

            const toolResults: { toolName: string; result: string }[] = [];

            // Agentic loop — keep calling until no more tool_calls
            let response = await ai.chat.completions.create({ model: "gpt-4o", messages: apiMessages, tools: TOOLS, tool_choice: "auto" });

            while (response.choices[0].finish_reason === "tool_calls") {
                const assistantMessage = response.choices[0].message;
                const calls = assistantMessage.tool_calls ?? [];

                // Execute every tool call in parallel
                const toolResultMessages: OpenAI.Chat.ChatCompletionToolMessageParam[] = await Promise.all(
                    calls.map(async (call) => {
                        if (!("function" in call)) {
                            return { role: "tool" as const, tool_call_id: call.id, content: "Unsupported tool type" };
                        }
                        const parsedInput = JSON.parse(call.function.arguments) as Record<string, any>;
                        const result = await executeTool(call.function.name, parsedInput, input.storeId, ctx.db);
                        toolResults.push({ toolName: call.function.name, result });
                        return { role: "tool" as const, tool_call_id: call.id, content: result };
                    })
                );

                // Append assistant message + all tool results, then continue
                apiMessages.push(assistantMessage, ...toolResultMessages);
                response = await ai.chat.completions.create({ model: "gpt-4o", messages: apiMessages, tools: TOOLS, tool_choice: "auto" });
            }

            const assistantText = response.choices[0].message.content ?? "";
            await ctx.db.insert(chatMessages).values({
                storeId: input.storeId,
                role: "assistant",
                content: assistantText,
                toolCalls: toolResults.length > 0 ? toolResults : null,
            });

            return { message: assistantText, toolsUsed: toolResults.map((t) => t.toolName) };
        }),

    getChatHistory: protectedProcedure
        .input(z.object({ storeId: z.string().uuid(), limit: z.number().int().min(1).max(100).optional().default(50) }))
        .query(async ({ ctx, input }) => {
            const store = await ctx.db.query.stores.findFirst({
                where: and(eq(stores.id, input.storeId), eq(stores.ownerId, ctx.user.id)),
                columns: { id: true },
            });
            if (!store) throw new TRPCError({ code: "FORBIDDEN" });
            const messages = await ctx.db.query.chatMessages.findMany({
                where: eq(chatMessages.storeId, input.storeId),
                orderBy: [desc(chatMessages.createdAt)],
                limit: input.limit,
            });
            return messages.reverse();
        }),

    clearChatHistory: protectedProcedure
        .input(z.object({ storeId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const store = await ctx.db.query.stores.findFirst({
                where: and(eq(stores.id, input.storeId), eq(stores.ownerId, ctx.user.id)),
                columns: { id: true },
            });
            if (!store) throw new TRPCError({ code: "FORBIDDEN" });
            await ctx.db.delete(chatMessages).where(eq(chatMessages.storeId, input.storeId));
            return { success: true };
        }),
});