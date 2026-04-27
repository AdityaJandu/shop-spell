"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type Props = { storeId: string; dateRange: "7D" | "30D" | "90D" };

const W = 1000;
const H = 300;
const PAD = { top: 20, right: 20, bottom: 20, left: 10 };

function buildPath(points: { revenue: number }[], maxRevenue: number) {
  if (points.length === 0) return { line: "", area: "" };

  const xStep = (W - PAD.left - PAD.right) / Math.max(points.length - 1, 1);

  const coords = points.map((p, i) => ({
    x: PAD.left + i * xStep,
    y:
      PAD.top +
      (H - PAD.top - PAD.bottom) *
      (1 - (p.revenue / maxRevenue) * 0.85),
  }));

  let line = `M${coords[0].x},${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const cp1x = coords[i - 1].x + xStep * 0.4;
    const cp1y = coords[i - 1].y;
    const cp2x = coords[i].x - xStep * 0.4;
    const cp2y = coords[i].y;
    line += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${coords[i].x},${coords[i].y}`;
  }

  const bottom = H - PAD.bottom;
  const area = `${line} L${coords.at(-1)!.x},${bottom} L${coords[0].x},${bottom} Z`;

  return { line, area, coords };
}

function formatRevenue(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

export function RevenueChart({ storeId, dateRange }: Props) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.analytics.getRevenueChartData.queryOptions({ storeId, dateRange })
  );

  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    date: string;
    revenue: number;
    orders: number;
  } | null>(null);

  const chartData = data ?? [];
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  const { line, area, coords } = buildPath(chartData, maxRevenue) as ReturnType<
    typeof buildPath
  > & { coords?: { x: number; y: number }[] };

  const yLabels = [1, 0.75, 0.5, 0.25, 0].map((f) => ({
    value: formatRevenue(maxRevenue * f),
    y:
      PAD.top +
      (H - PAD.top - PAD.bottom) * (1 - f * 0.85),
  }));

  const xLabels: { label: string; x: number }[] = [];

  if (chartData.length > 0) {
    const indices = [
      0,
      Math.floor(chartData.length * 0.25),
      Math.floor(chartData.length * 0.5),
      Math.floor(chartData.length * 0.75),
      chartData.length - 1,
    ].filter((v, i, a) => a.indexOf(v) === i);

    const xStep = (W - PAD.left - PAD.right) / Math.max(chartData.length - 1, 1);

    for (const idx of indices) {
      xLabels.push({
        label: new Date(chartData[idx].date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        x: PAD.left + idx * xStep,
      });
    }
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg || !coords || chartData.length === 0) return;

    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * W;

    const xStep =
      (W - PAD.left - PAD.right) /
      Math.max(chartData.length - 1, 1);

    const idx = Math.min(
      Math.max(Math.round((mouseX - PAD.left) / xStep), 0),
      chartData.length - 1
    );

    const point = coords[idx];
    const d = chartData[idx];

    setTooltip({
      x: (point.x / W) * 100,
      y: (point.y / H) * 100,
      date: d.date,
      revenue: d.revenue,
      orders: d.orderCount,
    });
  }

  return (
    <Card className="w-full rounded-2xl border-none bg-surface-container-lowest shadow-sm">
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-lg font-semibold text-on-surface">
          Revenue Over Time
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="flex justify-between">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-12 rounded" />
              ))}
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-on-surface-variant">
              No revenue data for this period.
            </p>
          </div>
        ) : (
          <div className="mt-2 flex gap-4">
            {/* Y Axis */}
            <div className="relative w-12 text-right">
              {yLabels.map(({ value, y }, i) => (
                <span
                  key={i}
                  className="absolute right-0 text-xs text-muted-foreground"
                  style={{
                    top: `${(y / H) * 100}%`,
                    transform: "translateY(-50%)",
                  }}
                >
                  {value}
                </span>
              ))}
            </div>

            {/* Chart */}
            <div className="flex-1 flex flex-col gap-2">
              <div
                className="relative h-[300px] w-full overflow-hidden rounded-xl"
                onMouseLeave={() => setTooltip(null)}
              >
                <svg
                  ref={svgRef}
                  className="h-full w-full"
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="none"
                  onMouseMove={handleMouseMove}
                >
                  {/* Grid */}
                  {yLabels.map(({ y }, i) => (
                    <line
                      key={i}
                      x1={PAD.left}
                      x2={W - PAD.right}
                      y1={y}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity="0.06"
                    />
                  ))}

                  <defs>
                    <linearGradient
                      id="revenue_gradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#006A65"
                        stopOpacity="0.25"
                      />
                      <stop offset="100%" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path d={area} fill="url(#revenue_gradient)" />
                  <path
                    d={line}
                    fill="none"
                    stroke="#006A65"
                    strokeWidth="2.5"
                  />

                  {/* Hover */}
                  {tooltip && coords && (() => {
                    const idx = chartData.findIndex(
                      (d) => d.date === tooltip.date
                    );
                    const pt = coords[idx];

                    return pt ? (
                      <>
                        <line
                          x1={pt.x}
                          x2={pt.x}
                          y1={PAD.top}
                          y2={H - PAD.bottom}
                          stroke="#006A65"
                          strokeOpacity="0.2"
                          strokeDasharray="4 4"
                        />
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#006A65" />
                      </>
                    ) : null;
                  })()}
                </svg>

                {tooltip && (
                  <div
                    className={cn(
                      "pointer-events-none absolute z-10 rounded-xl border border-border/40 bg-background/95 backdrop-blur-md px-4 py-2.5 text-xs shadow-2xl transition-all duration-200",
                      // Smart Y positioning
                      tooltip.y < 25 ? "translate-y-4" : "-translate-y-full -mt-4",
                      // Smart X positioning
                      tooltip.x < 15 ? "translate-x-0" : tooltip.x > 85 ? "-translate-x-full" : "-translate-x-1/2"
                    )}
                    style={{
                      left: `${tooltip.x}%`,
                      top: `${tooltip.y}%`,
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <p className="font-bold text-sm">
                          {formatRevenue(tooltip.revenue)}
                        </p>
                      </div>
                      <p className="text-muted-foreground font-medium pl-4">
                        {new Date(tooltip.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-primary/70 font-bold pl-4 uppercase tracking-tighter text-[10px]">
                        {tooltip.orders} {tooltip.orders === 1 ? "order" : "orders"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* X Axis */}
              <div className="relative h-4">
                {xLabels.map(({ label, x }, i) => (
                  <span
                    key={i}
                    className="absolute text-xs text-muted-foreground"
                    style={{
                      left: `${(x / W) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}