import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/40 py-12 px-6 md:px-10">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-muted-foreground fill-muted-foreground/20" />
          <span className="text-lg tracking-tight font-bold text-muted-foreground">
            ShopSpell
          </span>
        </div>
        <div className="flex gap-8">
          <Link
            className="text-sm text-muted-foreground hover:text-primary-container transition-colors"
            href="#"
          >
            Terms
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-primary-container transition-colors"
            href="#"
          >
            Privacy
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-primary-container transition-colors"
            href="#"
          >
            Contact
          </Link>
        </div>
        <p className="text-xs text-muted-foreground/60 font-mono">
          © 2024 ShopSpell. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
