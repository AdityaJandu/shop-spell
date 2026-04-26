"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  session?: {
    user?: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string | null;
    };
  } | null;
}

export function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoggedIn = !!session?.user;
  const user = session?.user;

  const navItems = [
    { name: "Features", href: "/features", requireAuth: false },
    { name: "Pricing", href: "/pricing", requireAuth: false },
    { name: "Showcase", href: "/showcase", requireAuth: false },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="flex items-center justify-between px-6 py-4 md:px-10 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-foreground group transition-all">
          <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-on-primary" />
          </div>
          <span className="text-xl tracking-tight font-extrabold group-hover:opacity-80 transition-opacity">
            ShopSpell
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const targetHref =
              item.requireAuth && !isLoggedIn
                ? `/sign-in?redirect=${item.href}`
                : item.href;

            return (
              <Link
                key={item.name}
                href={targetHref}
                prefetch
                onMouseEnter={() => router.prefetch(targetHref)}
                className={cn(
                  "transition-all duration-200 relative py-1",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary opacity-60">
                  {user?.role || "Member"}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {user?.name || "User"}
                </span>
              </div>

              {/* Avatar */}
              <Link href="/profile" prefetch className="hover:scale-105 transition-transform active:scale-95">
                {user?.image ? (
                  <Avatar className="size-10 border-2 border-border shadow-sm">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="bg-primary-container text-on-primary font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold border-2 border-border shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || "S"}
                  </div>
                )}
              </Link>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className="active:scale-95 transition-all font-semibold hidden sm:inline-flex"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
              <Button
                className="active:scale-95 transition-all bg-primary-container text-on-primary hover:bg-primary-container/90 rounded-full px-7 font-bold shadow-lg shadow-primary-container/20"
                onClick={() => router.push("/sign-up")}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
