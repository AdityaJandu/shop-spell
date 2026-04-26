import React from "react";
import { CouponsHeader } from "../components/CouponsHeader";
import { CouponsTable } from "../components/CouponsTable";

export function CouponsPage() {
  return (
    <main className="max-w-container-max mx-auto w-full px-6 md:px-10 py-10 flex flex-col">
      <CouponsHeader />
      <CouponsTable />
    </main>
  );
}
