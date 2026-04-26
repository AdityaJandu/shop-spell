import React from "react";
import { Button } from "@/components/ui/button";

export function OrdersFilters() {
  const filters = ["All Orders", "New", "Dispatched", "Delivered"];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
      {filters.map((filter, index) => (
        <Button
          key={filter}
          variant={index === 0 ? "default" : "outline"}
          className={`rounded-full px-5 py-5 font-body-md text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
            index === 0
              ? "bg-primary-container text-white"
              : "bg-surface-container-lowest border-surface-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container"
          }`}
        >
          {filter}
        </Button>
      ))}
      <Button
        variant="outline"
        className="bg-surface-container-lowest border-surface-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container px-5 py-5 rounded-full font-body-md text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">tune</span>
        Filters
      </Button>
    </div>
  );
}
