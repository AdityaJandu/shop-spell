"use client";

import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Package, Clock, Store, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function UserOrdersDrawer() {
  const trpc = useTRPC();
  const [isOpen, setIsOpen] = useState(false);

  const { data: orders, isLoading } = useQuery(
    trpc.order.getUserOrders.queryOptions()
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative group">
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {orders && orders.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {orders.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col rounded-l-[2rem]">
        <SheetHeader className="p-8 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-2xl font-black">My Orders</SheetTitle>
              <SheetDescription>Track your purchases across all ShopSpell stores.</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-3xl border border-border/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
              ))
            ) : !orders || orders.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Package className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">No orders yet</h3>
                  <p className="text-sm text-muted-foreground">Your purchases will appear here.</p>
                </div>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className="group relative p-5 rounded-[2rem] bg-muted/30 border border-border/40 hover:border-primary/20 hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </div>
                    <Badge className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border/40 flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Store</p>
                        <h4 className="font-bold text-sm truncate">{order.store.name}</h4>
                      </div>
                      <Link 
                        href={`/storefront/${order.storeId}`}
                        className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="p-3 bg-background/50 rounded-2xl border border-border/40">
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                              {item.productName[0]}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <p className="font-black text-sm">${Number(order.totalAmount).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-8 bg-muted/30 border-t border-border/40 flex flex-col gap-3">
          <Link href="/my-orders" className="w-full">
            <Button className="w-full h-14 rounded-2xl font-black bg-foreground text-background" onClick={() => setIsOpen(false)}>
              View All Orders
            </Button>
          </Link>
          <Link href="/explore" className="w-full">
            <Button className="w-full h-14 rounded-2xl font-bold" variant="outline" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
