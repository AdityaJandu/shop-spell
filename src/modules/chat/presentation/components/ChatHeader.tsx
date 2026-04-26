import React from "react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  storeName: string;
  onClear: () => void;
  isClearDisabled: boolean;
  isClearing: boolean;
}

export function ChatHeader({
  storeName,
  onClear,
  isClearDisabled,
  isClearing,
}: ChatHeaderProps) {
  return (
    <div className="px-6 md:px-10 py-4 border-b border-surface-variant flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-container to-secondary flex items-center justify-center shadow-lg shadow-primary-container/20">
          <span className="material-symbols-outlined text-white text-xl icon-fill">
            auto_fix_high
          </span>
        </div>
        <div>
          <h1 className="font-h3 text-base text-on-surface font-bold tracking-tight">
            ShopSpell AI
          </h1>
          <p className="text-xs text-on-surface-variant/80">
            Managing <span className="text-primary-container font-medium">{storeName}</span>
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={onClear}
        disabled={isClearDisabled || isClearing}
        className="text-on-surface-variant hover:text-destructive rounded-full transition-all duration-300 hover:bg-destructive/5 active:scale-95"
        size="sm"
      >
        <span className="material-symbols-outlined text-[18px] mr-1">
          {isClearing ? "progress_activity" : "delete_sweep"}
        </span>
        {isClearing ? "Clearing..." : "Clear"}
      </Button>
    </div>
  );
}
