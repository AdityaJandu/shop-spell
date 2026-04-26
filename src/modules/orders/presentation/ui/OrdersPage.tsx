import React from "react";
import { OrdersHeader } from "../components/OrdersHeader";
import { OrdersFilters } from "../components/OrdersFilters";
import { OrdersTable } from "../components/OrdersTable";

export function OrdersPage() {
  return (
    <main className="max-w-[1280px] mx-auto w-full px-6 md:px-10 py-10 md:py-16 pb-32 md:pb-16 flex flex-col gap-8 md:gap-10">
      <OrdersHeader />
      <OrdersFilters />
      <OrdersTable />
    </main>
  );
}
