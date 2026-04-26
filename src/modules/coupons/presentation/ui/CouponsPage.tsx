"use client";

import React, { useState } from "react";
import { CouponsHeader } from "../components/CouponsHeader";
import { CouponsTable } from "../components/CouponsTable";
import { AddCouponDrawer } from "../components/AddCouponDrawer";
import { useStore } from "@/modules/dashboard/store-context";

export function CouponsPage() {
  const { storeId } = useStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <main className="max-w-container-max mx-auto w-full px-6 md:px-10 py-10 flex flex-col pb-32 md:pb-10">
      <CouponsHeader 
        storeId={storeId} 
        search={search}
        onSearchChange={setSearch}
        onCreateClick={() => setIsDrawerOpen(true)} 
      />
      <CouponsTable storeId={storeId} search={search} />
      <AddCouponDrawer storeId={storeId} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </main>
  );
}
