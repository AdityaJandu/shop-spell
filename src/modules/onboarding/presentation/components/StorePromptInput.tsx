import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export function StorePromptInput() {
  return (
    <div className="w-full max-w-2xl relative group">
      <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary-container blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200 rounded-full"></div>
      <div className="relative flex items-center bg-background rounded-full border border-input p-1.5 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20">
        <Input
          autoFocus
          className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg px-6 h-12 placeholder:text-muted-foreground/50"
          placeholder="I sell hand-crafted jewellery..."
          type="text"
        />
        <Button 
          size="icon" 
          className="rounded-full h-12 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all active:scale-95"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
