"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  Share2,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  storeId: string;
  productId: string;
};

export function ProductDetailPage({ storeId, productId }: Props) {
  const trpc = useTRPC();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { data: session } = authClient.useSession();

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct } = useQuery(
    trpc.product.getProduct.queryOptions({ productId })
  );

  // Fetch store details (for branding)
  const { data: store } = useQuery(
    trpc.store.getStore.queryOptions({ storeId })
  );

  // Buy Now Mutation
  const buyMutation = useMutation(
    trpc.order.createOrder.mutationOptions({
      onSuccess: (data) => {
        setOrderId(data.id);
        setIsSuccessOpen(true);
        toast.success("Order placed successfully!");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-background pt-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square w-full rounded-[3rem]" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link href={`/storefront/${storeId}`}>
          <Button variant="default" className="rounded-full px-8">Back to Store</Button>
        </Link>
      </div>
    );
  }

  const images = product.imageUrls?.length ? product.imageUrls : ["/placeholder-image.jpg"];

  function handleBuyNow() {
    buyMutation.mutate({
      storeId,
      productId,
      quantity,
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href={`/storefront/${storeId}`} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {store?.name || "Back to Store"}
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square relative rounded-[3rem] bg-muted overflow-hidden shadow-2xl">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0",
                      selectedImage === idx ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-none uppercase tracking-widest text-[10px] font-black px-3 py-1">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  4.8 (42 Reviews)
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">{product.name}</h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-black">${Number(product.price).toFixed(2)}</span>
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="outline" className="text-rose-500 border-rose-500/20 bg-rose-500/5 font-bold">
                    Only {product.stock} left in stock!
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="font-bold">Out of Stock</Badge>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/20 pl-6 py-2">
              {product.description || "No description provided for this product."}
            </p>

            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="flex items-center gap-6">
                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Quantity</span>
                <div className="flex items-center bg-muted rounded-2xl p-1 border border-border/40">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || buyMutation.isPending}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-bold text-lg tabular-nums">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || buyMutation.isPending}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-6">
                {!session ? (
                  <Link href="/sign-in" className="w-full">
                    <Button className="w-full h-16 rounded-[1.25rem] bg-primary text-white font-black text-lg">
                      Sign in to Buy
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border/40 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Details</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{session.user.name}</span>
                        <span className="text-xs text-muted-foreground">{session.user.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleBuyNow}
                        className="flex-1 h-16 rounded-[1.25rem] bg-foreground text-background hover:opacity-90 font-black text-lg shadow-xl shadow-foreground/10 flex items-center gap-3 transition-all active:scale-[0.98]"
                        disabled={product.stock === 0 || buyMutation.isPending}
                      >
                        {buyMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                        {buyMutation.isPending ? "Processing..." : "Confirm & Buy Now"}
                      </Button>
                      <Button variant="outline" size="icon" className="h-16 w-16 rounded-[1.25rem] border-border/60 hover:bg-muted group">
                        <Heart className="w-6 h-6 group-hover:fill-rose-500 group-hover:text-rose-500 transition-colors" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border/40">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-black">Order Placed!</DialogTitle>
              <DialogDescription className="text-lg">
                Your order <span className="font-mono font-bold text-foreground">#{orderId.toUpperCase()}</span> has been placed successfully.
                The seller will be notified immediately.
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => setIsSuccessOpen(false)}
              className="w-full h-14 rounded-xl bg-foreground text-background font-bold text-lg"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
