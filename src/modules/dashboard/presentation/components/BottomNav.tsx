"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { name: "Chat", href: "/dashboard/chat", icon: "chat" },
    { name: "Orders", href: "/dashboard/orders", icon: "receipt_long" },
    { name: "Products", href: "/dashboard/products", icon: "inventory_2" },
    { name: "Analytics", href: "/dashboard/analytics", icon: "query_stats" },
  ];

  return (
    <nav className="md:hidden bg-background/90 backdrop-blur-md font-h1 text-[10px] uppercase tracking-widest font-bold fixed bottom-0 w-full z-50 rounded-t-3xl border-none shadow-[0_-4px_16px_rgba(0,0,0,0.04)] flex justify-around items-center px-6 py-4 pb-safe">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center justify-center transition-all active:scale-90 ${
              isActive
                ? "text-primary-container scale-110"
                : "text-on-surface-variant hover:text-primary-container"
            }`}
          >
            <span
              className={`material-symbols-outlined mb-1 ${
                isActive ? "icon-fill" : ""
              }`}
            >
              {link.icon}
            </span>
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
