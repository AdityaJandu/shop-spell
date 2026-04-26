import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RevenueChart() {
  return (
    <Card className="bg-surface-container-lowest rounded-[16px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] w-full">
      <CardHeader className="p-lg md:p-xl pb-0">
        <div className="flex justify-between items-center mb-lg">
          <CardTitle className="font-h3 text-h3 text-on-surface">
            Revenue Over Time
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="px-4 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-high transition-colors h-auto"
            >
              7D
            </Button>
            <Button
              variant="default"
              className="px-4 py-1.5 rounded-full bg-surface-variant text-on-surface font-label-caps text-label-caps h-auto hover:bg-surface-variant/90"
            >
              30D
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-high transition-colors h-auto"
            >
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-lg md:p-xl pt-0">
        {/* Chart Visual Placeholder */}
        <div className="relative w-full h-[300px] mt-8 border-l border-b border-surface-variant">
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="w-full h-px bg-surface-variant"></div>
            <div className="w-full h-px bg-surface-variant"></div>
            <div className="w-full h-px bg-surface-variant"></div>
            <div className="w-full h-px bg-surface-variant"></div>
            <div className="w-full h-px bg-transparent"></div>
          </div>
          {/* Y-Axis Labels */}
          <div className="absolute -left-12 inset-y-0 flex flex-col justify-between text-right text-xs text-on-surface-variant font-code py-1">
            <span>$1k</span>
            <span>$750</span>
            <span>$500</span>
            <span>$250</span>
            <span>$0</span>
          </div>
          {/* Chart Area and Line */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="w-full h-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 300 L0 150 C 100 120, 200 180, 300 100 C 400 20, 500 140, 600 80 C 700 20, 800 100, 900 40 L 1000 60 L 1000 300 Z"
                fill="url(#paint0_linear)"
              ></path>
              <path
                d="M0 150 C 100 120, 200 180, 300 100 C 400 20, 500 140, 600 80 C 700 20, 800 100, 900 40 L 1000 60"
                stroke="#F4614E"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              ></path>
              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="paint0_linear"
                  x1="500"
                  x2="500"
                  y1="0"
                  y2="300"
                >
                  <stop stopColor="#006A65" stopOpacity="0.1"></stop>
                  <stop offset="1" stopColor="#006A65" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Data Point Tooltip (Mock) */}
          <div className="absolute top-[80px] left-[60%] -translate-x-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-primary-container rounded-full border-2 border-surface-container-lowest shadow-sm z-10"></div>
            <div className="w-px h-[220px] bg-primary-container/30 border-dashed border-l border-primary-container/50"></div>
            <div className="absolute -top-12 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.08)] font-code text-xs whitespace-nowrap">
              $840.00 <span className="opacity-70 ml-1">Aug 14</span>
            </div>
          </div>
          {/* X-Axis Labels */}
          <div className="absolute -bottom-8 inset-x-0 flex justify-between text-xs text-on-surface-variant font-code px-2">
            <span>Aug 1</span>
            <span>Aug 8</span>
            <span>Aug 15</span>
            <span>Aug 22</span>
            <span>Aug 30</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
