import React from "react";
import { Button } from "@/components/ui/button";

export function CouponsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
      <div className="flex items-center gap-4">
        <h1 className="font-h1 text-h1 text-on-surface">Coupons</h1>
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps">
          4 Active
        </span>
      </div>
      <Button className="bg-primary-container text-white rounded-full px-6 py-3 font-body-md text-body-md font-semibold hover:bg-primary-container/90 transition-opacity shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center gap-2 self-start md:self-auto h-auto">
        <span className="material-symbols-outlined text-[20px]">add</span>
        Create Coupon
      </Button>
    </div>
  );
}
