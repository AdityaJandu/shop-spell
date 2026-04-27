"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { type Order, type OrderItem } from "@/db/schema";

type OrderWithItems = Order & { items: OrderItem[] };

type Props = {
  storeId: string;
  status: string | undefined;
  dateRange: string | undefined;
};

const statusStyles: Record<string, string> = {
  New: "bg-red-50 text-red-600 border-red-200",
  Processing: "bg-blue-50 text-blue-600 border-blue-200",
  Shipped: "bg-purple-50 text-purple-600 border-purple-200",
  Delivered: "bg-green-50 text-green-600 border-green-200",
  Refunded: "bg-gray-100 text-gray-600 border-gray-200",
};

const nextStatusMap: Record<string, string[]> = {
  New: ["Processing", "Refunded"],
  Processing: ["Shipped", "Refunded"],
  Shipped: ["Delivered", "Refunded"],
  Delivered: ["Refunded"],
  Refunded: [],
};

export function OrdersTable({ storeId, status, dateRange }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [cursor, setCursor] = useState(0);
  const limit = 10;

  const { data, isLoading } = useQuery(
    trpc.order.listStoreOrders.queryOptions({
      storeId,
      status: status as Order["status"] | undefined,
      dateRange,
      cursor,
      limit,
    })
  );

  const updateStatusMutation = useMutation(
    trpc.order.updateOrderStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.order.listStoreOrders.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.order.getRecentOrders.queryKey() });
        toast.success("Order status updated");
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const orders = data?.items ?? [];

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-none shadow-sm">
        <div className="p-6 space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="rounded-2xl border-none shadow-sm">
        <div className="py-16 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[85px] text-primary mb-3">
            receipt_long
          </span>
          <h3 className="text-xl font-medium">No orders found</h3>
          <p className="text-md text-muted-foreground text-center">
            {status
              ? `No ${status.toLowerCase()} orders in this period.`
              : "Orders will appear here once customers place them."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground uppercase tracking-wide">
              <th className="px-6 py-4 text-left">Order</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const date = new Date(order.createdAt);
              const formattedDate = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const initials = (order.customerName || "?")
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              const possibleNext = nextStatusMap[order.status] ?? [];

              return (
                <tr
                  key={order.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {/* Order ID */}
                  <td className="px-6 py-4 font-mono text-primary">
                    #{order.id.slice(0, 6).toUpperCase()}
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {order.customerName || "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-6 py-4 text-muted-foreground">
                    {(order as OrderWithItems).items?.length ?? 0}
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 font-medium">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>

                   <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm",
                        statusStyles[order.status]
                      )}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {order.status === "New" ? (
                        <>
                          <button
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: "Processing" })}
                            className="h-8 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Accept
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: "Refunded" })}
                            className="h-8 px-3 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container-highest transition-colors flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                            Reject
                          </button>
                        </>
                      ) : possibleNext.length > 0 ? (
                        <div className="relative group">
                          <button className="h-8 px-3 rounded-lg bg-surface-container-low border border-border/50 text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">sync</span>
                            Update
                            <span className="material-symbols-outlined text-[14px]">expand_more</span>
                          </button>
                          
                          <div className="absolute top-full left-0 z-10 mt-1 w-32 bg-surface-container-lowest border border-border rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top scale-95 group-hover:scale-100">
                            {possibleNext.map((s) => (
                              <button
                                key={s}
                                onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: s as Order["status"] })}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-primary/5 hover:text-primary transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between group/item"
                              >
                                {s}
                                <span className="material-symbols-outlined text-[14px] opacity-0 group-hover/item:opacity-100 transition-opacity">arrow_forward</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No actions available</span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {formattedDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {orders.length} orders
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setCursor(Math.max(0, cursor - limit))}
            disabled={cursor === 0}
            className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-muted disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </button>

          <button
            onClick={() => data?.nextCursor != null && setCursor(data.nextCursor)}
            disabled={data?.nextCursor == null}
            className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-muted disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
}