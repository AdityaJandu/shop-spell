"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
};

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "danger",
}: Props) {
  const variantStyles = {
    danger: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white",
    info: "bg-primary hover:bg-primary/90 shadow-primary/20 text-white",
  };

  const iconStyles = {
    danger: "bg-rose-500/10 text-rose-500",
    warning: "bg-amber-500/10 text-amber-500",
    info: "bg-primary/10 text-primary",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", iconStyles[variant])}>
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-xl font-bold tracking-tight text-on-background">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-on-surface-variant/70 leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:justify-center pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-12 rounded-xl font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "h-12 rounded-xl font-black shadow-lg hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-2",
                variantStyles[variant]
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
