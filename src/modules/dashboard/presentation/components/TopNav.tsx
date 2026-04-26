"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();

  const links = [
    { name: "Chat", href: "/dashboard/chat" },
    { name: "Orders", href: "/dashboard/orders" },
    { name: "Products", href: "/dashboard/products" },
    { name: "Coupons", href: "/dashboard/coupons" },
    { name: "Analytics", href: "/dashboard/analytics" },
  ];

  return (
    <header className="hidden md:flex justify-between items-center w-full px-10 h-20 bg-background font-h1 antialiased docked full-width top-0 border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-40 sticky">
      <div className="text-2xl font-extrabold tracking-tighter text-on-background flex items-center gap-2">
        ShopSpell
      </div>
      <nav className="flex gap-8">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`font-medium transition-colors duration-200 active:opacity-80 ${
                isActive
                  ? "text-primary-container font-bold border-b-2 border-primary-container pb-1"
                  : "text-on-surface-variant hover:text-primary-container"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-on-surface-variant">
          Status: Live
        </span>
        <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">
            person
          </span>
        </button>
      </div>
    </header>
  );
}
