"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Ticket, X } from "lucide-react";
import { cn } from "@/lib/utils";

const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").transform((val) => val.toUpperCase()),
  discountAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Discount must be a positive number",
  }),
  discountType: z.enum(["percentage", "fixed"]),
  maxUses: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "Max uses must be at least 1",
  }),
  expiryDate: z.string().optional(),
});

type CouponValues = z.infer<typeof couponSchema>;

type Props = {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
};

export function AddCouponDrawer({ storeId, isOpen, onClose }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<CouponValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discountAmount: "",
      discountType: "percentage",
      maxUses: "",
      expiryDate: "",
    },
  });
  
  const discountType = useWatch({
    control: form.control,
    name: "discountType",
  });

  const createMutation = useMutation(
    trpc.coupon.createCoupon.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.coupon.listCoupons.queryKey() });
        toast.success("Coupon created successfully!");
        form.reset();
        onClose();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  function onSubmit(values: CouponValues) {
    createMutation.mutate({
      storeId,
      code: values.code,
      discountAmount: parseFloat(values.discountAmount),
      discountType: values.discountType,
      maxUses: parseInt(values.maxUses, 10),
      expiryDate: values.expiryDate ? new Date(values.expiryDate) : undefined,
    });
  }

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
              <Ticket className="w-5 h-5 fill-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Create Coupon</h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                New discount offer
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      Coupon Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. SUMMER24"
                        className="h-12 rounded-xl bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50 font-mono uppercase tracking-wider"
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
                  name="discountAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                        Discount Value
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                            {discountType === "percentage" ? "%" : "$"}
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0"
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
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                        Type
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/60 focus:ring-1 focus:ring-primary/50 font-medium text-left">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/60 shadow-xl">
                          <SelectItem value="percentage" className="rounded-lg font-medium">Percentage</SelectItem>
                          <SelectItem value="fixed" className="rounded-lg font-medium">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                        Max Uses
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          className="h-12 rounded-xl bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                        Expiry Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-12 rounded-xl bg-muted/30 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

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
              form.reset();
              onClose();
            }}
            className="px-6 h-12 rounded-xl font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
            className="px-8 h-12 rounded-xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all flex items-center gap-2"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Coupon"
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}