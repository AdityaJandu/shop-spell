import React from "react";
import { MetricCards } from "../components/MetricCards";
import { RevenueChart } from "../components/RevenueChart";
import { TopPerformer } from "../components/TopPerformer";
import { RecentOrders } from "../components/RecentOrders";

export function AnalyticsPage() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-6 md:px-xl py-xl space-y-xl pb-32 md:pb-xl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-h2 text-h2 text-on-surface">Store Performance</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Reviewing data from the last 30 days.
        </p>
      </div>

      <MetricCards />
      <RevenueChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-xl">
        <TopPerformer />
        <RecentOrders />
      </div>
    </main>
  );
}
