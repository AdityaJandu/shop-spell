import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const orders = [
  {
    id: "#ORD-092",
    customer: "Eleanor Shellstrop",
    date: "Today, 10:42 AM",
    amount: "$120.00",
    status: "Processing",
    statusClass: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  {
    id: "#ORD-091",
    customer: "Chidi Anagonye",
    date: "Yesterday, 4:15 PM",
    amount: "$45.50",
    status: "Shipped",
    statusClass: "bg-secondary-container text-on-secondary-container",
  },
  {
    id: "#ORD-090",
    customer: "Tahani Al-Jamil",
    date: "Aug 28, 9:00 AM",
    amount: "$450.00",
    status: "Shipped",
    statusClass: "bg-secondary-container text-on-secondary-container",
  },
  {
    id: "#ORD-089",
    customer: "Jason Mendoza",
    date: "Aug 27, 2:30 PM",
    amount: "$12.99",
    status: "Refunded",
    statusClass: "bg-error-container text-on-error-container",
  },
  {
    id: "#ORD-088",
    customer: "Michael",
    date: "Aug 26, 11:11 AM",
    amount: "$99.00",
    status: "Shipped",
    statusClass: "bg-secondary-container text-on-secondary-container",
  },
];

export function RecentOrders() {
  return (
    <Card className="bg-surface-container-lowest rounded-[16px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:col-span-2">
      <CardHeader className="p-lg md:p-xl pb-0">
        <div className="flex justify-between items-center mb-md">
          <CardTitle className="font-h3 text-body-lg font-bold text-on-surface">
            Recent Transactions
          </CardTitle>
          <Button
            variant="ghost"
            className="text-secondary hover:text-on-secondary-container font-label-caps text-label-caps uppercase tracking-widest transition-colors p-0 h-auto"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-lg md:p-xl pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-surface-variant">
                <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest w-24">
                  Order ID
                </th>
                <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                  Customer
                </th>
                <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                  Date
                </th>
                <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-right">
                  Amount
                </th>
                <th className="py-3 px-2 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="font-body-md text-sm">
              {orders.map((order, idx) => (
                <tr
                  key={idx}
                  className="border-b border-surface-container hover:bg-surface-container-low transition-colors group last:border-0"
                >
                  <td className="py-4 px-2 font-code text-on-surface-variant">
                    {order.id}
                  </td>
                  <td className="py-4 px-2 text-on-surface font-medium">
                    {order.customer}
                  </td>
                  <td className="py-4 px-2 text-on-surface-variant">
                    {order.date}
                  </td>
                  <td className="py-4 px-2 text-on-surface font-code text-right">
                    {order.amount}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <Badge
                      variant="secondary"
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium hover:opacity-90 ${order.statusClass}`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
