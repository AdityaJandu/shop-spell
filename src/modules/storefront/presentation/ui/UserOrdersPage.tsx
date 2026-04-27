"use client";

import React from "react";
import { Package, Store, ExternalLink, ArrowLeft } from "lucide-react";
import { Header } from "@/modules/landing/presentation/components/Header";
import { Footer } from "@/modules/landing/presentation/components/Footer";
import { Card } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  New: "bg-red-50 text-red-600 border-red-200",
  Processing: "bg-blue-50 text-blue-600 border-blue-200",
  Shipped: "bg-purple-50 text-purple-600 border-purple-200",
  Delivered: "bg-green-50 text-green-600 border-green-200",
  Refunded: "bg-gray-100 text-gray-600 border-gray-200",
};

export function UserOrdersPage() {
  const trpc = useTRPC();
  const { data: orders, isLoading } = useQuery(
    trpc.order.getUserOrders.queryOptions()
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">My Purchases</h1>
            <p className="text-muted-foreground text-lg">Track and manage all your orders across the ShopSpell network.</p>
          </div>
          <Link href="/explore">
            <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-foreground/5 overflow-hidden">
            <div className="p-8 space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-40 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              ))}
            </div>
          </Card>
        ) : !orders || orders.length === 0 ? (
          <Card className="rounded-[3rem] border-2 border-dashed border-border/60 bg-transparent flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-black mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">When you buy products from any ShopSpell store, they&apos;ll appear here for you to track.</p>
            <Link href="/explore">
              <Button className="rounded-2xl h-14 px-8 bg-foreground text-background font-black text-lg shadow-xl shadow-foreground/10 hover:opacity-90">
                Explore Stores
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-foreground/5 overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="px-8 py-6 text-left">Order</th>
                    <th className="px-8 py-6 text-left">Store</th>
                    <th className="px-8 py-6 text-left">Items</th>
                    <th className="px-8 py-6 text-left">Total</th>
                    <th className="px-8 py-6 text-left">Status</th>
                    <th className="px-8 py-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-muted/30 transition-all duration-300">
                      <td className="px-8 py-6">
                        <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                            {order.store.logoUrl ? (
                              <Image src={order.store.logoUrl} alt="" width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm leading-none mb-1">{order.store.name}</span>
                            <Link 
                              href={`/storefront/${order.storeId}`}
                              className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
                            >
                              Visit Store <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div 
                              key={idx} 
                              className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold shadow-sm"
                              title={item.productName}
                            >
                              {item.productName[0]}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary border-2 border-card flex items-center justify-center text-[10px] font-bold shadow-sm">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-lg tabular-nums">
                          ${Number(order.totalAmount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <Badge 
                          className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border shadow-xs",
                            statusStyles[order.status]
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{format(new Date(order.createdAt), "h:mm a")}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
