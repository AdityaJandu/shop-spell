"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

type Props = {
  storeId: string;
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
};

export function ProductsHeader({
  storeId,
  search,
  onSearchChange,
  onAddClick,
}: Props) {
  const trpc = useTRPC();
  const { data: products } = useQuery(
    trpc.product.listStoreProducts.queryOptions({ storeId })
  );

  const totalCount = products?.length ?? 0;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">

      {/* Left: Title */}
      <div className="flex items-center justify-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-on-background">
          Products
        </h1>

        {/* Count badge */}
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30">
          {totalCount} {totalCount > 1 ? "items" : "item"}
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="h-11 w-full rounded-xl pl-10 pr-3 bg-surface-container-low border border-outline-variant/30 focus-visible:ring-1 focus-visible:ring-primary/40 transition"
          />
        </div>

        {/* Add Button */}
        <Button
          onClick={onAddClick}
          className="h-11 px-5 rounded-xl bg-primary text-white font-medium flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">
            add
          </span>
          Add Product
        </Button>
      </div>
    </div>
  );
}