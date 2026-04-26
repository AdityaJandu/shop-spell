"use client";

import React, { useState } from "react";
import { MetricCards } from "../components/MetricCards";
import { RevenueChart } from "../components/RevenueChart";
import { TopPerformer } from "../components/TopPerformer";
import { RecentOrders } from "../components/RecentOrders";
import { useStore } from "@/modules/dashboard/store-context";

type DateRange = "7D" | "30D" | "90D";

export function AnalyticsPage() {
  const { storeId } = useStore();
  const [dateRange, setDateRange] = useState<DateRange>("30D");

  const rangeLabel =
    { "7D": "7 days", "30D": "30 days", "90D": "90 days" }[dateRange];

  const ranges: DateRange[] = ["7D", "30D", "90D"];
  const activeIndex = ranges.indexOf(dateRange);

  return (
    <main className="grow w-full mx-auto max-w-[1400px] px-6 md:px-10 py-8 md:py-10 space-y-10 pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-on-surface flex items-center gap-2">
            Store Performance
            <span className="material-symbols-outlined text-[#0F6E56]/70 text-[26px]">
              monitoring
            </span>
          </h1>

          <p className="text-sm md:text-base text-on-surface-variant">
            Showing analytics for the last{" "}
            <span className="font-medium text-on-surface">
              {rangeLabel}
            </span>
          </p>
        </div>

        {/* Segmented Control */}
        <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-1 shadow-sm">
          {/* Sliding Indicator */}
          <div
            className="absolute top-1 bottom-1 transition-all duration-300 ease-out rounded-lg bg-white shadow-sm"
            style={{
              width: "33.33%",
              left: `${activeIndex * 33.33}%`,
            }}
          />

          {ranges.map((r) => {
            const isActive = dateRange === r;

            return (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`relative z-10 px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                  ? "text-[#0F6E56]"
                  : "text-on-surface-variant hover:text-on-surface"
                  }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics */}
      <MetricCards storeId={storeId} dateRange={dateRange} />

      {/* Chart */}
      <RevenueChart storeId={storeId} dateRange={dateRange} />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopPerformer storeId={storeId} dateRange={dateRange} />
        <RecentOrders storeId={storeId} />
      </div>
    </main>
  );
}