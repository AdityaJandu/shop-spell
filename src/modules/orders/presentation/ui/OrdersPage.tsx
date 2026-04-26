"use client";

import React, { useState } from "react";
import { OrdersHeader } from "../components/OrdersHeader";
import { OrdersFilters } from "../components/OrdersFilters";
import { OrdersTable } from "../components/OrdersTable";
import { useStore } from "@/modules/dashboard/store-context";

export function OrdersPage() {
  const { storeId } = useStore();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<string | undefined>(undefined);

  return (
    <main className="max-w-container-max mx-auto w-full px-6 md:px-10 py-10 md:py-16 pb-32 md:pb-16 flex flex-col gap-8 md:gap-10">
      <OrdersHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
      <OrdersFilters active={statusFilter} onFilterChange={setStatusFilter} />
      <OrdersTable storeId={storeId} status={statusFilter} dateRange={dateRange} />
    </main>
  );
}
