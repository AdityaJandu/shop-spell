"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/db/schema";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a positive number",
  }),
  stock: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, {
    message: "Stock must be a positive integer",
  }),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

type ProductValues = z.infer<typeof productSchema>;

type Props = {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
};

const CATEGORIES = [
  "Home Decor",
  "Apparel",
  "Accessories",
  "Electronics",
  "Lighting",
  "Food & Drink",
  "Art",
  "Other",
];

export function AddProductDrawer({ storeId, isOpen, onClose, product }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [aiPrompt, setAiPrompt] = useState("");
  const isEditing = !!product;

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    },
  });

  // Populate form with default values if a product is provided
  useEffect(() => {
    if (isOpen) {
      if (product) {
        form.reset({
          name: product.name || "",
          price: product.price?.toString() || "",
          stock: product.stock?.toString() || "",
          category: product.category || "",
          description: (product as any).description || "",
        });
      } else {
        resetAll();
      }
    }
  }, [isOpen, product, form]);

  // 1. Mutation for Manual Product Creation
  const createMutation = useMutation(
    trpc.product.createProduct.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.product.listStoreProducts.queryKey() });
        toast.success("Product created successfully!");
        resetAll();
        onClose();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  // 2. Mutation for Manual Product Updating
  const updateMutation = useMutation(
    trpc.product.updateProduct.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.product.listStoreProducts.queryKey() });
        toast.success("Product updated successfully!");
        resetAll();
        onClose();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  // 3. Mutation for AI Assistant Product Generation
  const aiMutation = useMutation(
    trpc.ai.sendMessage.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: trpc.product.listStoreProducts.queryKey() });

        // Check if the AI actually used the tool
        if (data.toolsUsed && data.toolsUsed.includes("create_product")) {
          toast.success("AI successfully generated the product!");
        } else {
          toast.success("AI responded, check your product list.");
        }

        resetAll();
        onClose();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to generate product via AI.");
      },
    })
  );

  function resetAll() {
    setAiPrompt("");
    form.reset({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    });
  }

  function handleAiSubmit() {
    if (!aiPrompt.trim()) return;

    // Send the natural language prompt directly to the AI router.
    // The AI will parse it and execute the `create_product` tool we built.
    aiMutation.mutate({
      storeId,
      message: `Please create a product based on this description: ${aiPrompt}`,
    });
  }

  function onSubmit(values: ProductValues) {
    if (isEditing && product) {
      updateMutation.mutate({
        productId: product.id,
        name: values.name,
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
        category: values.category,
        description: values.description || undefined,
      });
    } else {
      createMutation.mutate({
        storeId,
        name: values.name,
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
        category: values.category,
        description: values.description || undefined,
        imageUrls: [], // Added required array to satisfy the backend schema
      });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending || aiMutation.isPending;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-[520px] bg-card shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-in-out border-l border-border",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5 fill-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {isEditing ? "Edit Product" : "Add Product"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                {isEditing ? "Update inventory item" : "New inventory item"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">

          {/* AI Assistant Section - Only show when Creating a new product */}
          {!isEditing && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-primary/70 ml-1">
                    ShopSpell AI Assistant
                  </label>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Beta
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative bg-background border border-border/60 rounded-xl overflow-hidden shadow-sm flex flex-col">
                    <textarea
                      className="w-full bg-transparent border-none p-4 font-medium text-sm placeholder:text-muted-foreground/50 focus:ring-0 outline-none resize-none min-h-[100px]"
                      placeholder="Describe the product naturally... e.g. 'Add a hand-poured soy candle with cedarwood scent for $28 with 50 in stock'"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAiSubmit();
                        }
                      }}
                    />
                    <div className="flex justify-between items-center px-4 py-3 bg-muted/30 border-t border-border/40">
                      <span className="text-[10px] text-muted-foreground font-medium italic">
                        AI will auto-fill stock and details
                      </span>
                      <Button
                        onClick={handleAiSubmit}
                        disabled={aiMutation.isPending || !aiPrompt.trim()}
                        size="sm"
                        className="h-8 w-8 rounded-full bg-primary text-primary-foreground p-0 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      >
                        {aiMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">
                  <span className="bg-card px-4">Manual Entry</span>
                </div>
              </div>
            </>
          )}

          {/* Manual Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      Product Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Artisan Fluted Vase"
                        className="h-12 rounded-xl bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                        Price ($)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="h-12 pl-8 rounded-xl bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                        Stock Level
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="h-12 rounded-xl bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/60 focus:ring-1 focus:ring-primary/50 font-medium">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-border/60 shadow-xl">
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="rounded-lg font-medium">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell a story about this product..."
                        className="min-h-[120px] rounded-xl bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50 resize-none font-medium p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />

              {/* Hidden submit for form */}
              <button type="submit" className="hidden" />
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border/50 bg-muted/20 flex items-center justify-end gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              resetAll();
              onClose();
            }}
            className="px-6 h-12 rounded-xl font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
            className="px-8 h-12 rounded-xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Update Product" : "Save Product"
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}