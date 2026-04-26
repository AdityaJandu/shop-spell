import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCards() {
  const metrics = [
    {
      title: "Total Revenue",
      icon: "payments",
      value: "$24,590",
      change: "+12.5%",
      changeIcon: "trending_up",
      changeColor: "text-secondary",
    },
    {
      title: "Total Orders",
      icon: "shopping_bag",
      value: "342",
      change: "+5.2%",
      changeIcon: "trending_up",
      changeColor: "text-secondary",
    },
    {
      title: "Avg Order Value",
      icon: "receipt",
      value: "$71.90",
      change: "-2.1%",
      changeIcon: "trending_down",
      changeColor: "text-primary-container",
    },
    {
      title: "Conversion Rate",
      icon: "ads_click",
      value: "3.4%",
      change: "+0.8%",
      changeIcon: "trending_up",
      changeColor: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className="bg-surface-container-lowest rounded-[16px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <CardContent className="p-lg flex flex-col gap-sm">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
                {metric.title}
              </span>
              <span className="material-symbols-outlined text-secondary opacity-50">
                {metric.icon}
              </span>
            </div>
            <div className="font-h1 text-h1 text-on-surface mt-2">
              {metric.value}
            </div>
            <div className={`flex items-center gap-1 mt-1 ${metric.changeColor}`}>
              <span className="material-symbols-outlined text-[16px]">
                {metric.changeIcon}
              </span>
              <span className="font-body-md text-sm font-medium">
                {metric.change}
              </span>
              <span className="text-on-surface-variant text-sm ml-1">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
