"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Share2 } from "lucide-react";

type Props = {
  storeId: string;
};

export function StorefrontPage({ storeId }: Props) {
  const trpc = useTRPC();

  // Fetch store details
  const { data: store, isLoading: isLoadingStore } = useQuery(
    trpc.store.getStore.queryOptions({ storeId })
  );

  // Fetch store products
  const { data: products, isLoading: isLoadingProducts } = useQuery(
    trpc.product.listStoreProductsPublic.queryOptions({ storeId })
  );

  if (isLoadingStore) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-[40vh] w-full" />
        <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
          <Skeleton className="w-40 h-40 rounded-3xl border-8 border-background" />
          <div className="mt-6 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Store Not Found</h1>
        <p className="text-muted-foreground mb-8">The store you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/explore">
          <Button variant="default" className="rounded-full px-8">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Header / Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/explore" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero / Banner */}
      <section className="relative h-[45vh] w-full overflow-hidden pt-16">
        {store.bannerUrl ? (
          <Image 
            src={store.bannerUrl} 
            alt={store.name} 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary-container/20 via-background to-secondary/10" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
      </section>

      {/* Store Header */}
      <section className="max-w-7xl mx-auto px-6 relative z-10 -mt-24 md:-mt-32">
        <div className="flex flex-col md:flex-row items-end gap-6 md:gap-10">
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] bg-card border-[10px] border-background shadow-2xl overflow-hidden shrink-0">
            {store.logoUrl ? (
              <Image src={store.logoUrl} alt={store.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/20">
                <span className="material-symbols-outlined text-6xl">store</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 pb-4 md:pb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">{store.name}</h1>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-none py-1 px-3 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-primary" />
                4.9 (128 reviews)
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {store.description || "Welcome to our store. We're dedicated to providing high-quality products and an exceptional shopping experience."}
            </p>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Products
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
              {products?.length || 0}
            </span>
          </h2>
          
          <div className="flex items-center gap-2">
             <Button variant="outline" className="rounded-full text-xs font-bold uppercase tracking-widest">Filter</Button>
             <Button variant="outline" className="rounded-full text-xs font-bold uppercase tracking-widest">Sort</Button>
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-3xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-[3rem]">
            <span className="material-symbols-outlined text-6xl text-muted-foreground/20 mb-4">inventory_2</span>
            <h3 className="text-xl font-bold">No products yet</h3>
            <p className="text-muted-foreground">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products?.map((product) => (
              <Link key={product.id} href={`/storefront/${storeId}/product/${product.id}`} className="group">
                <article className="flex flex-col gap-5">
                  <div className="aspect-square relative rounded-[2rem] bg-muted overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                    {product.imageUrls?.[0] ? (
                      <Image 
                        src={product.imageUrls[0]} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                        <span className="material-symbols-outlined text-5xl">image</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <Button size="icon" className="rounded-2xl bg-white/90 backdrop-blur shadow-lg hover:bg-white text-foreground">
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                      <span className="text-lg font-black tabular-nums">${Number(product.price).toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.category}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-20 bg-muted/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary mx-auto mb-6 shadow-lg shadow-primary-container/20">
            <span className="material-symbols-outlined">auto_fix_high</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Powered by ShopSpell</p>
          <p className="text-xs text-muted-foreground/60">Create your own AI-powered store in seconds.</p>
        </div>
      </footer>
    </div>
  );
}
