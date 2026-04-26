"use client";

import React, { useState } from "react";
import { ProductsHeader } from "../components/ProductsHeader";
import { ProductGrid } from "../components/ProductGrid";
import { AddProductDrawer } from "../components/AddProductDrawer";

export function ProductsPage() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="w-full max-w-container-max mx-auto px-6 md:px-10 py-12 md:py-16">
      <ProductsHeader onAddClick={() => setDrawerOpen(true)} />
      <ProductGrid />
      <AddProductDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </main>
  );
}
