"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export function PromptInput({ value, onChange, onSubmit }: PromptInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="w-full max-w-2xl relative shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-full bg-surface-container-lowest flex items-center p-sm focus-within:ring-2 focus-within:ring-primary-container/50 transition-shadow duration-300"
    >
      <Input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-none focus-visible:ring-0 shadow-none font-body-lg text-body-lg text-on-surface px-lg py-md placeholder:text-on-surface-variant/40"
        placeholder="I sell..."
        type="text"
      />
      <Button
        type="submit"
        className="bg-primary-container text-on-primary-container rounded-full h-14 w-14 flex-shrink-0 flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 ml-xs shadow-sm"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'wght' 600" }}
        >
          arrow_upward
        </span>
      </Button>
    </form>
  );
}
