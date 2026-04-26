import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TopPerformer() {
  return (
    <Card className="bg-surface-container-lowest rounded-[16px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:col-span-1 flex flex-col h-full">
      <CardContent className="p-lg flex flex-col flex-1">
        <div className="flex justify-between items-start mb-md">
          <h3 className="font-h3 text-body-lg font-bold text-on-surface">
            Top Performer
          </h3>
          <Badge
            variant="destructive"
            className="rounded-full text-xs font-label-caps tracking-widest bg-error-container text-on-error-container uppercase hover:bg-error-container/90"
          >
            Most Critical
          </Badge>
        </div>
        <div className="flex-grow flex flex-col justify-center items-center py-xl bg-surface-container-low rounded-xl mb-md overflow-hidden relative">
          <div className="w-32 h-32 rounded-full bg-surface-container-highest shadow-inner flex items-center justify-center relative z-10 overflow-hidden">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFf_uYo3BIXtz1SSKQ2zOoXNqjHEFK9zcywRzVcr0q2QuhaDcwx6vZP5pzcxfEMWm1wQMwV5vIAiDFZ2tVVISlQE79JD2KW85tWAYh6CzLaIlJpN0d__65qTBJH-LPJ0MmbJ7TjcaSJLHcBg6eb4vFRlorMZvH0XeqNNzbbxV4fWqcxF9Xyj1fZ9u2Z3xQtZrcJdIzKm6HiWGbiJq7b4TOCLJA5tlafDiJ8hru9Iww2Ko4adQ-yLqGYkYbs_Ta4Yrl9EN9gwVmszs"
              alt="Crimson Velocity Runner"
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          {/* Subtle AI magic glow */}
          <div className="absolute w-40 h-40 bg-secondary/10 rounded-full blur-2xl z-0 mix-blend-multiply"></div>
        </div>
        <div className="text-center">
          <h4 className="font-h3 text-lg text-on-surface">
            Crimson Velocity Runner
          </h4>
          <p className="font-body-md text-on-surface-variant text-sm mt-1">
            124 units sold this month
          </p>
          <p className="font-code text-primary-container text-sm font-semibold mt-2">
            $14,880 Revenue
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
