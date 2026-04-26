import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestionChipsProps {
  onSelect: (value: string) => void;
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  const suggestions = [
    "I sell jewellery...",
    "I bake cakes...",
    "I offer consulting...",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-md pt-sm">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          className="rounded-full border-outline-variant font-body-md text-body-md text-on-surface hover:bg-surface-container transition-colors duration-200"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
