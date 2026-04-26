"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type Props = {
  active: string | undefined;
  onFilterChange: (status: string | undefined) => void;
};

export function OrdersFilters({ active, onFilterChange }: Props) {
  const filters = [
    { label: "All Orders", value: undefined },
    { label: "New", value: "New" },
    { label: "Processing", value: "Processing" },
    { label: "Shipped", value: "Shipped" },
    { label: "Delivered", value: "Delivered" },
    { label: "Refunded", value: "Refunded" },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
      {filters.map((filter) => {
        const isActive = active === filter.value;
        return (
          <Button
            key={filter.label}
            variant={isActive ? "default" : "outline"}
            onClick={() => onFilterChange(filter.value)}
            className={
              cn(
                "rounded-full px-5 py-5 font-body-md text-sm font-medium whitespace-nowrap shadow-sm transition-colors",
                isActive
                  ? "bg-primary-container text-white"
                  : "bg-surface-container-lowest border-surface-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container"
              )
            }
          >
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
