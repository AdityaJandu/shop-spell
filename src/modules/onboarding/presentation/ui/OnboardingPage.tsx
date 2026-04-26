"use client";

import React, { useState } from "react";
import { PromptInput } from "../components/PromptInput";
import { SuggestionChips } from "../components/SuggestionChips";

export function OnboardingPage() {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (value: string) => {
    console.log("Submit prompt:", value);
    // Proceed to generation or next step
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center font-body-md text-on-surface antialiased p-lg">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-xl">
        {/* Header Section */}
        <div className="space-y-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-md text-primary-container shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_fix_high
            </span>
          </div>
          <h1 className="font-h1 text-h1 text-on-surface">What do you sell?</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
            Describe your business, products, or services. Our AI architect will
            use this to build the foundation of your store.
          </p>
        </div>

        {/* Input Area */}
        <PromptInput value={prompt} onChange={setPrompt} onSubmit={handleSubmit} />

        {/* Suggestion Chips */}
        <SuggestionChips
          onSelect={(suggestion) => {
            setPrompt(suggestion);
            // Optionally auto-submit: handleSubmit(suggestion);
          }}
        />
      </main>
    </div>
  );
}
