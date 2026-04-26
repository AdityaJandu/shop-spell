"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

type Props = { storeId: string; dateRange: "7D" | "30D" | "90D" };

const METRIC_CONFIG = [
  {
    key: "totalRevenue",
    title: "Total Revenue",
    icon: "payments",
    color: "teal",
    iconBg: "bg-[#E1F5EE]",
    iconColor: "text-[#0F6E56]",
    rawColor: "#0F6E56",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    icon: "shopping_bag",
    color: "blue",
    iconBg: "bg-[#E6F1FB]",
    iconColor: "text-[#185FA5]",
    rawColor: "#185FA5",
  },
  {
    key: "avgOrderValue",
    title: "Avg Order Value",
    icon: "receipt_long",
    color: "purple",
    iconBg: "bg-[#EEEDFE]",
    iconColor: "text-[#534AB7]",
    rawColor: "#534AB7",
  },
  {
    key: "conversionRate",
    title: "Conversion Rate",
    icon: "ads_click",
    color: "amber",
    iconBg: "bg-[#FAEEDA]",
    iconColor: "text-[#854F0B]",
    rawColor: "#854F0B",
  },
] as const;

/** * Upgraded sparkline with gradient area fill and draw animation.
 * We use a <style> tag scoped to the SVG to handle the draw animation without needing tailwind.config changes.
 */
function MiniSparkline({ positive }: { positive: boolean }) {
  const color = positive ? "#0F6E56" : "#A32D2D";
  const id = `gradient-${positive ? 'pos' : 'neg'}`;

  const linePath = positive
    ? "M0,18 C10,16 15,8 25,12 C30,14 35,6 40,4"
    : "M0,4 C10,6 15,14 25,10 C30,8 35,16 40,18";

  const areaPath = positive
    ? "M0,18 C10,16 15,8 25,12 C30,14 35,6 40,4 L40,24 L0,24 Z"
    : "M0,4 C10,6 15,14 25,10 C30,8 35,16 40,18 L40,24 L0,24 Z";

  return (
    <div className="relative shrink-0 w-xl h-[22px]">
      <style>{`
        @keyframes drawSparkline {
          to { stroke-dashoffset: 0; }
        }
        .animate-sparkline {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawSparkline 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.1s;
        }
        @keyframes fadeArea {
          to { opacity: 1; }
        }
        .animate-area {
          opacity: 0;
          animation: fadeArea 1s ease-in forwards;
          animation-delay: 0.5s;
        }
      `}</style>
      <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="absolute bottom-0 right-0 overflow-visible">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <path d={areaPath} fill={`url(#${id})`} className="animate-area" />

        {/* Line */}
        <path
          d={linePath}
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="100"
          className="animate-sparkline drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
        />

        {/* Endpoint Dot */}
        <circle
          cx="40"
          cy={positive ? "4" : "18"}
          r="2"
          fill="#fff"
          stroke={color}
          strokeWidth="1.5"
          className="animate-area shadow-sm"
        />
      </svg>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-[20px] p-5 flex flex-col gap-4 border border-outline-variant/30">
      <div className="flex items-center justify-between">
        <Skeleton className="h-11 w-11 rounded-[14px]" />
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>
      <div className="flex flex-col gap-3 mt-1">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <div className="flex justify-between items-end">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-4 w-10 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function MetricCards({ storeId, dateRange }: Props) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.analytics.getStoreMetrics.queryOptions({ storeId, dateRange })
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    { ...METRIC_CONFIG[0], value: data.totalRevenue.formatted, change: data.totalRevenue.change },
    { ...METRIC_CONFIG[1], value: String(data.totalOrders.value), change: data.totalOrders.change },
    { ...METRIC_CONFIG[2], value: data.avgOrderValue.formatted, change: data.avgOrderValue.change },
    { ...METRIC_CONFIG[3], value: `${data.conversionRate.value}%`, change: data.conversionRate.change },
  ];

  const periodLabel = { "7D": "7 days", "30D": "30 days", "90D": "90 days" }[dateRange];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const isPositive = metric.change >= 0;
        const isNeutral = metric.change === 0;

        return (
          <div
            key={metric.key}
            className="group relative bg-linear-to-b from-surface-container-lowest to-surface-container-lowest/80 rounded-[20px] border border-outline-variant/40 p-5 flex flex-col gap-4 hover:-translate-y-1 hover:border-outline-variant/60 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
          >
            {/* Subtle background accent that expands on hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 opacity-[0.06] group-hover:scale-150 group-hover:opacity-[0.08] transition-all duration-500 ease-out ${metric.iconBg}`} />

            {/* Top row: icon + label */}
            <div className="flex items-start justify-between relative z-10">
              <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 shadow-sm border border-white/20 ${metric.iconBg}`}>
                <span className={`material-symbols-outlined text-[20px] ${metric.iconColor}`} style={{ fontVariationSettings: "'wght' 400, 'FILL' 1" }}>
                  {metric.icon}
                </span>
              </div>
              <span className="text-[11px] mt-1 font-semibold tracking-[0.06em] uppercase text-on-surface-variant/70">
                {metric.title}
              </span>
            </div>

            {/* Value */}
            <div className="flex flex-col gap-2 relative z-10 mt-1">
              <span className="text-[30px] font-bold text-on-surface leading-none tracking-tight tabular-nums">
                {metric.value}
              </span>

              {/* Change row */}
              <div className="flex items-end justify-between mt-1">
                <div className={`flex items-center gap-1.5 ${isNeutral
                  ? "text-on-surface-variant"
                  : isPositive
                    ? "text-[#0F6E56]"
                    : "text-[#A32D2D]"
                  }`}>
                  {/* Badge */}
                  <span className={`inline-flex items-center gap-0.5 text-[12px] font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-black/5 ${isNeutral
                    ? "bg-on-surface-variant/10 text-on-surface-variant"
                    : isPositive
                      ? "bg-[#E1F5EE] text-[#0F6E56]"
                      : "bg-[#FCEBEB] text-[#A32D2D]"
                    }`}>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'wght' 600" }}>
                      {isNeutral ? "remove" : isPositive ? "arrow_upward" : "arrow_downward"}
                    </span>
                    {isPositive && !isNeutral ? "+" : ""}{metric.change}%
                  </span>
                  <span className="text-[11px] font-medium text-on-surface-variant/50">
                    vs prev {periodLabel}
                  </span>
                </div>

                {/* Sparkline */}
                {!isNeutral && <MiniSparkline positive={isPositive} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}