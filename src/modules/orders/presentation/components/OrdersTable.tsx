import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const orderData = [
  {
    id: "#ORD-9082",
    initials: "EJ",
    customer: "Eleanor James",
    items: "3 items",
    total: "$245.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "New",
    time: "10 mins ago",
    fulfillmentClass:
      "bg-error-container text-on-primary-container border-[#ffb4a8]",
  },
  {
    id: "#ORD-9081",
    initials: "MC",
    customer: "Marcus Chen",
    items: "1 item",
    total: "$89.50",
    paymentStatus: "Paid",
    fulfillmentStatus: "Dispatched",
    time: "2 hrs ago",
    fulfillmentClass:
      "bg-surface-container text-on-surface-variant border-outline-variant/30",
  },
  {
    id: "#ORD-9080",
    initials: "SO",
    customer: "Sarah O'Connor",
    items: "5 items",
    total: "$412.00",
    paymentStatus: "Pending",
    fulfillmentStatus: "New",
    time: "5 hrs ago",
    fulfillmentClass:
      "bg-error-container text-on-primary-container border-[#ffb4a8]",
  },
  {
    id: "#ORD-9079",
    initials: "DP",
    customer: "David Palmer",
    items: "2 items",
    total: "$156.00",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    time: "Yesterday",
    fulfillmentClass:
      "bg-surface-container text-on-surface-variant border-outline-variant/30",
  },
];

export function OrdersTable() {
  return (
    <Card className="bg-surface-container-lowest rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden border-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-variant">
              <th className="px-6 py-5 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold">
                Order ID
              </th>
              <th className="px-6 py-5 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold">
                Customer
              </th>
              <th className="px-6 py-5 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold">
                Items
              </th>
              <th className="px-6 py-5 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold">
                Total
              </th>
              <th className="px-6 py-5 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold">
                Payment
              </th>
              <th className="px-6 py-5 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold">
                Fulfillment
              </th>
              <th className="px-6 py-5 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold text-right">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md">
            {orderData.map((order, i) => (
              <tr
                key={i}
                className="border-b border-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer group last:border-0"
              >
                <td className="px-6 py-5">
                  <span className="font-code text-code text-primary-container font-medium">
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-bold text-xs">
                      {order.initials}
                    </div>
                    <span className="font-medium text-on-surface">
                      {order.customer}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-on-surface-variant">
                  {order.items}
                </td>
                <td className="px-6 py-5 font-medium text-on-surface">
                  {order.total}
                </td>
                <td className="px-6 py-5">
                  {order.paymentStatus === "Paid" ? (
                    <span className="inline-flex items-center gap-1.5 bg-[#e8f7f6] text-secondary font-label-caps text-[10px] px-2.5 py-1 rounded-full border border-[#b2e5e1]">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{" "}
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface-variant font-label-caps text-[10px] px-2.5 py-1 rounded-full border border-outline-variant/30">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 font-label-caps text-[10px] px-2.5 py-1 rounded-full border ${order.fulfillmentClass}`}
                  >
                    {order.fulfillmentStatus}
                  </span>
                </td>
                <td className="px-6 py-5 text-on-surface-variant text-sm text-right">
                  {order.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-surface-variant flex items-center justify-between">
        <span className="text-sm text-on-surface-variant">
          Showing 1 to 4 of 48 orders
        </span>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-surface-variant text-outline cursor-not-allowed">
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-container text-white font-medium text-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-surface-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-colors text-sm">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-surface-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-colors text-sm">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-surface-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
}
