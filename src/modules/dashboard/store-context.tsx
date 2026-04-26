"use client";

import React, { createContext, useContext } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type StoreContextType = {
  storeId: string;
  storeName: string;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const trpc = useTRPC();
  const { data: store, isLoading, error } = useQuery(trpc.store.getMyStore.queryOptions());

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-primary-container text-2xl">auto_fix_high</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-3 w-48 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-5xl text-destructive">error</span>
          <h2 className="font-h3 text-lg text-on-surface">Something went wrong</h2>
          <p className="text-sm text-on-surface-variant max-w-sm">
            {error.message || "Unable to load your store. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (!store) {
    // Redirect to onboarding would happen here in a real app,
    // but for now we show a fallback with empty storeId
    // The dashboard layout can handle this
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-primary-container">storefront</span>
          <h2 className="font-h2 text-xl text-on-surface">No Store Found</h2>
          <p className="text-sm text-on-surface-variant max-w-sm">
            You haven&apos;t created a store yet. Head to onboarding to get started.
          </p>
          <a
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-full font-medium hover:bg-primary-container/90 transition-colors shadow-[0_2px_12px_rgba(244,97,78,0.2)]"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create Your Store
          </a>
        </div>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={{ storeId: store.id, storeName: store.name }}>
      {children}
    </StoreContext.Provider>
  );
}
