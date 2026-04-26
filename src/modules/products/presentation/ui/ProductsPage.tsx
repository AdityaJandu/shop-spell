"use client";

import React, { useState } from "react";
import { ProductsHeader } from "../components/ProductsHeader";
import { ProductGrid } from "../components/ProductGrid";
import { AddProductDrawer } from "../components/AddProductDrawer";
import { useStore } from "@/modules/dashboard/store-context";

export function ProductsPage() {
  const { storeId } = useStore();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <main className="w-full max-w-container-max mx-auto px-6 md:px-10 py-12 md:py-16 pb-32 md:pb-16">
      <ProductsHeader
        storeId={storeId}
        search={search}
        onSearchChange={setSearch}
        onAddClick={() => setDrawerOpen(true)}
      />
      <ProductGrid storeId={storeId} search={search} />
      <AddProductDrawer
        storeId={storeId}
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </main>
  );
}
