"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/modules/landing/presentation/components/Header";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export function ExplorePage() {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  // Fetch trending products
  const { data: marketplaceData, isLoading: isLoadingProducts } = useQuery(
    trpc.product.listMarketplaceProducts.queryOptions({ limit: 6 })
  );

  // Fetch current user's store
  const { data: myStore } = useQuery(
    trpc.store.getMyStore.queryOptions(undefined, { enabled: isLoggedIn })
  );

  const hasStore = !!myStore;

  // Fetch stores: others if logged in, all if not
  const { data: otherStoresData, isLoading: isLoadingOther } = useQuery(
    trpc.store.listOtherStores.queryOptions({ limit: 6 }, { enabled: isLoggedIn })
  );
  const { data: allStoresData, isLoading: isLoadingAll } = useQuery(
    trpc.store.listAllStores.queryOptions({ limit: 6 }, { enabled: !isLoggedIn })
  );

  const products = marketplaceData?.items ?? [];
  const stores = (isLoggedIn ? otherStoresData?.items : allStoresData?.items) ?? [];
  const isLoadingStores = isLoggedIn ? isLoadingOther : isLoadingAll;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="grow w-full max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 flex flex-col gap-16">
        {/* Explore Hero Header */}
        <section className="bg-surface-container-low rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

          <div className="flex flex-col gap-6 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-label-caps tracking-widest text-xs w-fit">
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>ShopSpell Marketplace</span>
            </div>
            <h1 className="font-h1 text-3xl md:text-4xl lg:text-5xl text-on-surface leading-tight">
              {hasStore ? "Welcome back! Discover what's trending." : "Discover amazing products from independent stores."}
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
              {hasStore
                ? "See what other sellers are creating and find inspiration for your own store."
                : "Browse through a curated collection of products created by sellers worldwide. Inspired? Start your own journey today."}
            </p>
          </div>

          {!hasStore && (
            <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-3xl shadow-xl shadow-black/5 border border-border relative z-10 min-w-[300px]">
              <span className="material-symbols-outlined text-5xl text-primary-container mb-4">storefront</span>
              <h3 className="font-h3 text-xl font-bold mb-2">Want to sell?</h3>
              <p className="text-center text-sm text-on-surface-variant mb-6">
                Create your own AI-powered storefront in minutes.
              </p>
              <Link href="/onboarding" className="w-full">
                <Button className="w-full rounded-full bg-primary-container hover:bg-primary-container/90 text-white font-bold py-6 text-md shadow-lg shadow-primary-container/20 transition-transform active:scale-95">
                  Create Your Store
                </Button>
              </Link>
            </div>
          )}

          {hasStore && (
            <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-3xl shadow-xl shadow-black/5 border border-border relative z-10 min-w-[300px]">
              <span className="material-symbols-outlined text-5xl text-primary-container mb-4">dashboard</span>
              <h3 className="font-h3 text-xl font-bold mb-2">Manage Store</h3>
              <p className="text-center text-sm text-on-surface-variant mb-6">
                You&apos;re already a seller! Check your latest sales and products.
              </p>
              <Link href={`/${myStore.id}/analytics`} className="w-full">
                <Button className="w-full rounded-full bg-primary-container hover:bg-primary-container/90 text-white font-bold py-6 text-md shadow-lg shadow-primary-container/20 transition-transform active:scale-95">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Featured Stores Section */}
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="font-h2 text-3xl text-on-surface">Featured Stores</h2>
            <Link href="/explore/stores" className="text-primary-container font-semibold hover:underline">View all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingStores
              ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-3xl" />
              ))
              : stores.map((store) => (
                <Link key={store.id} href={`/storefront/${store.id}`}>
                  <article className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-black/5 border border-border/50 flex flex-col gap-4 group transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary-container">
                        {store.logoUrl ? (
                          <Image src={store.logoUrl} alt={store.name} width={48} height={48} className="rounded-2xl" />
                        ) : (
                          <span className="material-symbols-outlined">store</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-h3 text-lg font-bold group-hover:text-primary-container transition-colors">{store.name}</h3>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{store.description}</p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs font-semibold text-on-surface-variant">
                      <span>Founded {new Date(store.createdAt).getFullYear()}</span>
                      <span className="px-2 py-1 rounded-md bg-surface-container-high">Visit Store</span>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </section>

        {/* Trending Products Section */}
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="font-h2 text-3xl text-on-surface">Trending Products</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingProducts
              ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-3xl" />
              ))
              : products.map((product) => (
                <article
                  key={product.id}
                  className="bg-surface-container-lowest rounded-3xl shadow-sm hover:shadow-xl hover:shadow-black/5 border border-border/50 overflow-hidden flex flex-col group cursor-pointer transition-all duration-300"
                >
                  <div className="h-64 bg-surface-container-low relative p-4 flex items-center justify-center overflow-hidden">
                    {product.imageUrls?.[0] ? (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">image</span>
                    )}
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-border/50 z-10">
                      <span className="material-symbols-outlined text-[14px] text-primary-container">store</span>
                      <span className="text-xs font-semibold">{product.storeName}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <span className="font-label-caps text-[10px] text-primary-container uppercase tracking-widest">
                      {product.category}
                    </span>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-h3 text-xl font-bold text-on-background leading-tight group-hover:text-primary-container transition-colors">
                        {product.name}
                      </h3>
                      <span className="font-body-lg font-bold text-on-surface">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                    </div>
                    <Link href={`/storefront/${product.storeId}/product/${product.id}`} className="mt-4">
                      <Button variant="outline" className="w-full rounded-full border-border/50 hover:border-primary-container hover:text-primary-container transition-colors">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
