import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const couponsData = [
  {
    code: "SUMMER24",
    discount: "20% OFF",
    usage: "42 / 100",
    expires: "Aug 31, 2024",
    status: "Active",
    statusClass: "bg-secondary-container text-on-secondary-container",
    isExpired: false,
  },
  {
    code: "WELCOME10",
    discount: "$10 OFF",
    usage: "891 / ∞",
    expires: "Never",
    status: "Active",
    statusClass: "bg-secondary-container text-on-secondary-container",
    isExpired: false,
  },
  {
    code: "VIPFLASH",
    discount: "40% OFF",
    usage: "5 / 50",
    expires: "In 2 days",
    status: "Active",
    statusClass: "bg-secondary-container text-on-secondary-container",
    isExpired: false,
  },
  {
    code: "SPRING24",
    discount: "15% OFF",
    usage: "250 / 250",
    expires: "May 1, 2024",
    status: "Expired",
    statusClass: "bg-surface-variant text-on-surface-variant border-outline-variant/30",
    isExpired: true,
  },
];

export function CouponsTable() {
  return (
    <Card className="bg-surface-container-lowest rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden border-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-surface-variant bg-surface-container-lowest">
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">
                Code
              </th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">
                Discount
              </th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">
                Usage
              </th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">
                Expires
              </th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">
                Status
              </th>
              <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {couponsData.map((coupon, idx) => (
              <tr
                key={idx}
                className={`border-b border-surface-variant hover:bg-surface-container-low transition-colors duration-150 ${
                  coupon.isExpired ? "opacity-60" : ""
                }`}
              >
                <td className="py-5 px-6">
                  <span
                    className={`font-code text-code px-2 py-1 rounded-md ${
                      coupon.isExpired
                        ? "text-on-surface-variant bg-surface-variant line-through"
                        : "text-primary-container bg-surface-container"
                    }`}
                  >
                    {coupon.code}
                  </span>
                </td>
                <td className="py-5 px-6 font-body-md text-body-md text-on-surface font-medium">
                  {coupon.discount}
                </td>
                <td className="py-5 px-6 text-on-surface-variant">
                  {coupon.usage}
                </td>
                <td className="py-5 px-6 text-on-surface-variant">
                  {coupon.expires}
                </td>
                <td className="py-5 px-6">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full font-label-caps text-label-caps border ${
                      coupon.isExpired ? "border-outline-variant/30" : "border-transparent"
                    } ${coupon.statusClass}`}
                  >
                    {coupon.status}
                  </span>
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-2 text-on-surface-variant">
                    {coupon.isExpired ? (
                      <button className="p-2 rounded-full hover:bg-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    ) : (
                      <>
                        <button className="p-2 rounded-full hover:bg-surface-variant transition-colors">
                          <span className="material-symbols-outlined text-[20px]">
                            content_copy
                          </span>
                        </button>
                        <button className="p-2 rounded-full hover:bg-surface-variant transition-colors">
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-surface-variant bg-surface-container-lowest flex items-center justify-between">
        <span className="text-sm text-on-surface-variant">
          Showing 1-4 of 12
        </span>
        <div className="flex gap-2">
          <button
            className="w-8 h-8 rounded-full border border-surface-variant flex items-center justify-center text-outline cursor-not-allowed"
            disabled
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
          </button>
          <button className="w-8 h-8 rounded-full border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
}
