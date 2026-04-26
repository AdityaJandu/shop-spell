"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type Props = {
  dateRange: string | undefined;
  onDateRangeChange: (range: string | undefined) => void;
};

export function OrdersHeader({ dateRange, onDateRangeChange }: Props) {
  const ranges = [
    { label: "Last 7 Days", value: "7D" },
    { label: "Last 30 Days", value: "30D" },
    { label: "Last 90 Days", value: "90D" },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <h1 className="font-h1 text-h1 text-stone-900 dark:text-stone-50">Orders</h1>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        {ranges.map((r) => {
          const isActive = dateRange === r.value;
          return (
            <Button
              key={r.value}
              variant={isActive ? "default" : "outline"}
              onClick={() => onDateRangeChange(isActive ? undefined : r.value)}
              className={
                cn(
                  "px-4 py-5 rounded-full font-body-md text-sm font-medium whitespace-nowrap transition-colors border-none",
                  isActive
                    ? "bg-primary-container text-white hover:bg-primary-container/90"
                    : "bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                )
              }
            >
              <span className="material-symbols-outlined text-[18px] mr-1">calendar_today</span>
              {r.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
