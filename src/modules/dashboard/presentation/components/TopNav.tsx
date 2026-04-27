"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/modules/dashboard/store-context";
import { Sparkles } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const { storeId } = useStore();

  const links = [
    { name: "Chat", href: `/${storeId}/chat` },
    { name: "Orders", href: `/${storeId}/orders` },
    { name: "Products", href: `/${storeId}/products` },
    { name: "Coupons", href: `/${storeId}/coupons` },
    { name: "Analytics", href: `/${storeId}/analytics` },
  ];

  return (
    <header className="hidden md:flex justify-between items-center w-full px-10 h-20 bg-background font-h1 antialiased docked full-width top-0 border-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-40 sticky">
      <Link href="/" className="text-2xl font-extrabold tracking-tighter text-on-background flex items-center gap-3 group transition-all">
        <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 fill-on-primary" />
        </div>
        <span className="group-hover:opacity-80 transition-opacity">
          ShopSpell
        </span>
      </Link>
      <nav className="flex gap-8">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`font-medium transition-colors duration-200 active:opacity-80 ${isActive
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
