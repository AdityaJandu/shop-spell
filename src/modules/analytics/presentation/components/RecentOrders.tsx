"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Props = { storeId: string };

const statusStyles: Record<string, string> = {
  New: "bg-error-container text-on-error-container",
  Processing: "bg-tertiary-fixed text-on-tertiary-fixed",
  Shipped: "bg-secondary-container text-on-secondary-container",
  Delivered: "bg-secondary-container text-on-secondary-container",
  Refunded: "bg-surface-variant text-on-surface-variant",
};

export function RecentOrders({ storeId }: Props) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.order.getRecentOrders.queryOptions({ storeId, limit: 5 })
  );

  const orders = data ?? [];

  return (
    <Card className="bg-surface-container-lowest rounded-[16px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:col-span-2">
      <CardHeader className="p-lg md:p-xl pb-0">
        <div className="flex justify-between items-center mb-md">
          <CardTitle className="font-h3 text-body-lg font-bold text-on-surface">
            Recent Transactions
          </CardTitle>
          <Link href="/orders">
            <Button
              variant="ghost"
              className="text-secondary hover:text-on-secondary-container font-label-caps text-label-caps uppercase tracking-widest transition-colors p-0 h-auto"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-lg md:p-xl pt-0">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">receipt_long</span>
            <p className="text-sm text-on-surface-variant">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-surface-variant">
                  <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest w-24">
                    Order ID
                  </th>
                  <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                    Date
                  </th>
                  <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-right">
                    Amount
                  </th>
                  <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm">
                {orders.map((order) => {
                  const date = new Date(order.createdAt);
                  const isToday = new Date().toDateString() === date.toDateString();
                  const formattedDate = isToday
                    ? `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
                    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-surface-container hover:bg-surface-container-low transition-colors group last:border-0"
                    >
                      <td className="py-4 px-2 font-code text-on-surface-variant">
                        #{order.id.slice(0, 6).toUpperCase()}
                      </td>
                      <td className="py-4 px-2 text-on-surface font-medium">
                        {order.customerName || "—"}
                      </td>
                      <td className="py-4 px-2 text-on-surface-variant">
                        {formattedDate}
                      </td>
                      <td className="py-4 px-2 text-on-surface font-code text-right">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="py-4 px-2 text-center">
                        <Badge
                          variant="secondary"
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium hover:opacity-90 ${statusStyles[order.status] ?? ""}`}
                        >
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
