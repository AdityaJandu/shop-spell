import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OrdersHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <h1 className="font-h1 text-h1 text-stone-900 dark:text-stone-50">Orders</h1>
        <span className="bg-[#e8f7f6] text-secondary font-label-caps text-label-caps px-3 py-1.5 rounded-full border border-[#b2e5e1]">
          14 NEW
        </span>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-grow md:flex-grow-0">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
            search
          </span>
          <Input
            className="w-full md:w-64 bg-surface-container-lowest border-none rounded-full py-5 pl-10 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-primary-container shadow-[0_2px_12px_rgba(0,0,0,0.06)] font-body-md placeholder:text-stone-400 transition-shadow"
            placeholder="Search orders..."
            type="text"
          />
        </div>
        <Button
          variant="outline"
          className="bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-4 py-5 rounded-full flex items-center gap-2 transition-colors border-none"
        >
          <span className="material-symbols-outlined text-[18px]">
            calendar_today
          </span>
          <span className="font-body-md text-body-md font-medium text-sm">
            Last 7 Days
          </span>
        </Button>
      </div>
    </div>
  );
}
