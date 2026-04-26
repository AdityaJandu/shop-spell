"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

type Props = { storeId: string; dateRange: "7D" | "30D" | "90D" };

export function TopPerformer({ storeId, dateRange }: Props) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.analytics.getTopPerformer.queryOptions({ storeId, dateRange })
  );

  if (isLoading) {
    return (
      <Card className="bg-surface-container-lowest rounded-[16px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:col-span-1 flex flex-col h-full">
        <CardContent className="p-lg flex flex-col flex-1">
          <div className="flex justify-between items-start mb-md">
            <Skeleton className="h-5 w-28 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="flex-grow flex items-center justify-center py-xl">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-5 w-40 mx-auto rounded" />
            <Skeleton className="h-3 w-32 mx-auto rounded" />
            <Skeleton className="h-4 w-24 mx-auto rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="bg-surface-container-lowest rounded-[16px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:col-span-1 flex flex-col h-full">
        <CardContent className="p-lg flex flex-col flex-1 items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">emoji_events</span>
          <p className="text-sm text-on-surface-variant">No sales data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface-container-lowest rounded-[16px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:col-span-1 flex flex-col h-full">
      <CardContent className="p-lg flex flex-col flex-1">
        <div className="flex justify-between items-start mb-md">
          <h3 className="font-h3 text-body-lg font-bold text-on-surface">
            Top Performer
          </h3>
          <Badge
            variant="destructive"
            className="rounded-full text-xs font-label-caps tracking-widest bg-error-container text-on-error-container uppercase hover:bg-error-container/90"
          >
            #{data.totalQuantitySold} Sold
          </Badge>
        </div>
        <div className="flex-grow flex flex-col justify-center items-center py-xl bg-surface-container-low rounded-xl mb-md overflow-hidden relative">
          <div className="w-32 h-32 rounded-full bg-surface-container-highest shadow-inner flex items-center justify-center relative z-10 overflow-hidden">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt={data.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
                inventory_2
              </span>
            )}
          </div>
          <div className="absolute w-40 h-40 bg-secondary/10 rounded-full blur-2xl z-0 mix-blend-multiply" />
        </div>
        <div className="text-center">
          <h4 className="font-h3 text-lg text-on-surface">
            {data.productName}
          </h4>
          {data.category && (
            <span className="inline-block mt-1 text-xs font-label-caps text-primary-container bg-surface-container px-2 py-0.5 rounded-full uppercase tracking-widest">
              {data.category}
            </span>
          )}
          <p className="font-code text-primary-container text-sm font-semibold mt-2">
            ${data.totalRevenue.toFixed(2)} Revenue
          </p>
        </div>
        {/* Runner-ups */}
        {data.runnerUps && data.runnerUps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-variant space-y-2">
            {data.runnerUps.map((r, i) => (
              <div key={r.productId} className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">
                  <span className="text-xs text-on-surface-variant/60 mr-1">#{i + 2}</span>
                  {r.productName}
                </span>
                <span className="font-code text-on-surface text-xs">{r.totalQuantitySold} sold</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
