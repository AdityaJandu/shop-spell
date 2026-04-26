"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";

import { cn } from "@/lib/utils";

type Props = { 
  storeId: string;
  search?: string;
};

export function CouponsTable({ storeId, search = "" }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<{ id: string, code: string, isInactive: boolean } | null>(null);

  const { data: coupons, isLoading } = useQuery(
    trpc.coupon.listCoupons.queryOptions({ storeId })
  );

  const deleteMutation = useMutation(
    trpc.coupon.deleteCoupon.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.coupon.listCoupons.queryKey() });
        toast.success(selectedCoupon?.isInactive ? "Coupon deleted" : "Coupon deactivated");
        setConfirmOpen(false);
        setSelectedCoupon(null);
      },
      onError: (err) => {
        toast.error(err.message);
        setConfirmOpen(false);
      },
    })
  );

  // Filter coupons based on search term
  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];
    if (!search.trim()) return coupons;
    
    const term = search.toLowerCase().trim();
    return coupons.filter((coupon) => 
      coupon.code.toLowerCase().includes(term)
    );
  }, [coupons, search]);

  if (isLoading) {
    return (
      <Card className="bg-surface-container-lowest rounded-2xl border border-surface-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-variant/30">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="px-6 py-4"><Skeleton className="h-4 w-20 rounded-md" /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-surface-variant/20 last:border-0">
                  <td className="px-6 py-5"><Skeleton className="h-8 w-28 rounded-md" /></td>
                  <td className="px-6 py-5"><Skeleton className="h-5 w-20 rounded-md" /></td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-1.5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-10 rounded-md" />
                    </div>
                  </td>
                  <td className="px-6 py-5"><Skeleton className="h-4 w-24 rounded-md" /></td>
                  <td className="px-6 py-5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="px-6 py-5"><Skeleton className="h-8 w-16 rounded-md ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  if (!coupons || coupons.length === 0) {
    return (
      <Card className="bg-surface-container-lowest rounded-2xl border border-dashed border-surface-variant/60 shadow-sm overflow-hidden">
        <div className="py-20 flex flex-col items-center justify-center w-full text-center px-4">
          <div className="w-16 h-16 rounded-full bg-surface-variant/20 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">local_offer</span>
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-1">No coupons yet</h3>
          <p className="text-sm font-medium text-on-surface-variant/70 max-w-2xl">
            Create your first coupon to start offering discounts to your customers.
          </p>
        </div>
      </Card>
    );
  }

  if (filteredCoupons.length === 0) {
    return (
      <Card className="bg-surface-container-lowest rounded-2xl border border-surface-variant/30 shadow-sm overflow-hidden">
        <div className="py-20 flex flex-col items-center justify-center w-full text-center px-4">
          <div className="w-16 h-16 rounded-full bg-surface-variant/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">search_off</span>
          </div>
          <h3 className="text-lg font-semibold text-on-surface mb-1">No matches found</h3>
          <p className="text-sm font-medium text-on-surface-variant/70 max-w-2xl">
            We couldn't find any coupons matching "{search}".
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-surface-container-lowest rounded-2xl border border-surface-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="border-b border-surface-variant/40 bg-surface-container-lowest/50">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCoupons.map((coupon) => {
                const isInactive = !coupon.isActive || coupon.isExpired || coupon.isExhausted;
                const discountLabel = coupon.discountType === "percentage"
                  ? `${Number(coupon.discountAmount)}% OFF`
                  : `$${Number(coupon.discountAmount)} OFF`;

                const expiryLabel = coupon.expiryDate
                  ? new Date(coupon.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Never expires";

                const statusLabel = !coupon.isActive ? "Inactive" : coupon.isExpired ? "Expired" : coupon.isExhausted ? "Exhausted" : "Active";

                const statusTheme = statusLabel === "Active"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  : statusLabel === "Inactive"
                    ? "bg-surface-variant/50 text-on-surface-variant border-outline-variant/30"
                    : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";

                return (
                  <tr
                    key={coupon.id}
                    className={cn(
                      "border-b border-surface-variant/20 hover:bg-surface-variant/10 transition-colors duration-200 group last:border-0",
                      isInactive && "opacity-60 hover:opacity-80 grayscale-20"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded border border-dashed font-mono text-[13px] font-bold tracking-widest uppercase shadow-sm transition-colors",
                        isInactive
                          ? "text-on-surface-variant/70 border-outline-variant/40 bg-surface-container-low line-through decoration-on-surface-variant/40"
                          : "text-[#0F6E56] border-[#0F6E56]/30 bg-[#0F6E56]/5"
                      )}>
                        {coupon.code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-on-surface tabular-nums">
                        {discountLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Progress
                          value={coupon.usagePercent}
                          className={cn("w-20 h-2 bg-surface-variant/50", isInactive && "opacity-50")}
                        />
                        <span className="text-[13px] font-medium text-on-surface-variant tabular-nums">
                          <span className={cn(coupon.currentUses >= coupon.maxUses ? "text-rose-600" : "text-on-surface font-semibold")}>
                            {coupon.currentUses}
                          </span>
                          <span className="mx-1 opacity-50">/</span>
                          {coupon.maxUses}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-on-surface-variant tabular-nums">
                      {expiryLabel}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border shadow-sm",
                        statusTheme
                      )}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-on-surface-variant/70">
                        {!isInactive && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              toast.success("Coupon code copied!");
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-variant/50 hover:text-on-surface transition-all"
                            title="Copy code"
                          >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCoupon({ id: coupon.id, code: coupon.code, isInactive });
                            setConfirmOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-600 transition-all"
                          title={isInactive ? "Delete" : "Deactivate"}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isInactive ? "delete" : "cancel"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmationDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={selectedCoupon?.isInactive ? "Delete Coupon" : "Deactivate Coupon"}
        description={
          selectedCoupon?.isInactive 
            ? `Are you sure you want to permanently delete coupon "${selectedCoupon?.code}"? This action cannot be undone.`
            : `Are you sure you want to deactivate coupon "${selectedCoupon?.code}"? It will no longer be usable by customers.`
        }
        confirmText={selectedCoupon?.isInactive ? "Delete" : "Deactivate"}
        onConfirm={() => {
          if (selectedCoupon) {
            deleteMutation.mutate({ couponId: selectedCoupon.id });
          }
        }}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}