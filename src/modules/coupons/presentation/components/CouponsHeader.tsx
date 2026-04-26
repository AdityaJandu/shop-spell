"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

type Props = {
  storeId: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  onCreateClick: () => void;
};

export function CouponsHeader({ storeId, search, onSearchChange, onCreateClick }: Props) {
  const trpc = useTRPC();
  const { data: coupons } = useQuery(
    trpc.coupon.listCoupons.queryOptions({ storeId })
  );

  const activeCount = coupons?.filter((c) => !c.isExpired && !c.isExhausted).length ?? 0;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">

      {/* Left: Title & Badge */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-on-background">
          Coupons
        </h1>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30">
          {activeCount} active
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">

        {/* Search - Optional if search props are provided */}
        {onSearchChange !== undefined && (
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search coupons..."
              className="h-11 w-full rounded-xl pl-10 pr-3 bg-surface-container-low border border-outline-variant/30 focus-visible:ring-1 focus-visible:ring-primary/40 transition"
            />
          </div>
        )}

        <Button
          onClick={onCreateClick}
          className="h-11 px-5 rounded-xl bg-primary text-white font-medium flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">
            add
          </span>
          Add Coupon
        </Button>
      </div>
    </div>
  );
}
