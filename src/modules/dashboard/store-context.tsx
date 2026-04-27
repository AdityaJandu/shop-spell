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

export function StoreProvider({ 
  children,
  storeId 
}: { 
  children: React.ReactNode;
  storeId: string;
}) {
  const trpc = useTRPC();
  const { data: store, isLoading, error } = useQuery(
    trpc.store.getStore.queryOptions({ storeId })
  );

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

  if (error || !store) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-5xl text-destructive">error</span>
          <h2 className="font-h3 text-lg text-on-surface">Store not found</h2>
          <p className="text-sm text-on-surface-variant max-w-sm">
            {error?.message || "The store you are looking for does not exist or you do not have access."}
          </p>
          <a
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-high text-on-surface rounded-full font-medium hover:bg-surface-container-highest transition-colors"
          >
            Go Back to Explore
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
