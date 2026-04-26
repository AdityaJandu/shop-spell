import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProductsHeader({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div className="flex items-center gap-4">
        <h1 className="font-h1 text-h1 text-on-background">Products</h1>
        <span className="bg-surface-container text-on-surface font-label-caps text-label-caps px-3 py-1 rounded-full uppercase tracking-widest mt-2">
          124 Total
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <Input
            className="w-full h-12 bg-surface-container-low rounded-full pl-12 pr-4 font-body-md text-body-md text-on-background focus-visible:ring-1 focus-visible:ring-primary-container border-none shadow-inner"
            placeholder="Search inventory..."
            type="text"
          />
        </div>
        <Button
          onClick={onAddClick}
          className="h-12 px-6 rounded-full bg-primary-container text-white font-body-md text-body-md font-semibold flex items-center gap-2 hover:bg-primary-container/90 transition-opacity whitespace-nowrap shadow-[0_2px_12px_rgba(244,97,78,0.2)]"
        >
          <span className="material-symbols-outlined">add</span>
          Add Product
        </Button>
      </div>
    </div>
  );
}
