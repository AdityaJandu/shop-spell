"use client";

import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddProductDrawer } from "../components/AddProductDrawer";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";

type Props = { storeId: string; search: string };

export function ProductGrid({ storeId, search }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const { data: products, isLoading } = useQuery(
    trpc.product.listStoreProducts.queryOptions({
      storeId,
      search: search || undefined,
    })
  );

  const deleteMutation = useMutation(
    trpc.product.deleteProduct.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.product.listStoreProducts.queryKey(),
        });
        toast.success("Product deleted");
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
      },
      onError: (err) => {
        toast.error(err.message);
        setDeleteConfirmOpen(false);
      },
    })
  );

  function openEdit(product: any) {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border shadow-sm overflow-hidden">
            <Skeleton className="h-56 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-muted-foreground/30 mb-4">
          inventory_2
        </span>
        <h3 className="text-lg font-semibold">
          {search ? "No products found" : "No products yet"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {search
            ? `No products match "${search}".`
            : "Add your first product to start selling."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const price = Number(product.price);

          const stock = product.stock;
          const isOut = stock === 0;
          const isLow = stock > 0 && stock < 5;

          return (
            <article
              key={product.id}
              onClick={() => openEdit(product)}
              className="group relative rounded-2xl border bg-background overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-56 bg-muted overflow-hidden">
                {product.imageUrls?.length ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/30">
                    <span className="material-symbols-outlined text-5xl">
                      image
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

                {/* Edit button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(product);
                  }}
                  className="absolute top-3 right-12 h-9 w-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-blue-50"
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-500">
                    edit
                  </span>
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductToDelete(product);
                    setDeleteConfirmOpen(true);
                  }}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
                >
                  <span className="material-symbols-outlined text-[18px] text-red-500">
                    delete
                  </span>
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-primary">
                  {product.category}
                </span>

                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-semibold text-base leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <span className="font-semibold text-sm whitespace-nowrap">
                    ${price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span
                    className={`w-2 h-2 rounded-full ${isOut
                      ? "bg-red-500"
                      : isLow
                        ? "bg-orange-500"
                        : "bg-green-500"
                      }`}
                  />
                  <span className="text-muted-foreground">
                    {isOut
                      ? "Out of stock"
                      : isLow
                        ? `Low stock (${stock})`
                        : `In stock (${stock})`}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action will permanently remove the product from your store.`}
        confirmText="Delete"
        onConfirm={() => {
          if (productToDelete) {
            deleteMutation.mutate({ productId: productToDelete.id });
          }
        }}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />

      {/* Drawer (Create + Edit) */}
      <AddProductDrawer
        storeId={storeId}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        product={selectedProduct}
      />
    </>
  );
}