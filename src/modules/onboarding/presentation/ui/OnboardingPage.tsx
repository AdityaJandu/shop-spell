"use client";

import React, { useState } from "react";
import { PromptInput } from "../components/PromptInput";
import { SuggestionChips } from "../components/SuggestionChips";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function OnboardingPage() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const trpc = useTRPC();

  const createStoreMutation = useMutation(
    trpc.store.createStore.mutationOptions({
      onSuccess: (store) => {
        toast.success(`"${store.name}" created! Redirecting to dashboard...`);
        setTimeout(() => {
          router.push("/analytics");
        }, 1000);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create store. Please try again.");
      },
    })
  );

  const handleSubmit = (value: string) => {
    if (!value.trim() || createStoreMutation.isPending) return;
    createStoreMutation.mutate({ prompt: value });
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
          <h1 className="font-h1 text-3xl text-on-surface">What do you sell?</h1>
          <p className="font-body-lg text-md text-on-surface-variant max-w-2xl mx-auto">
            Describe your business, products, or services. Our AI architect will
            use this to build the foundation of your store.
          </p>
        </div>

        {/* Loading State */}
        {createStoreMutation.isPending && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-3xl text-primary-container animate-spin">
                  progress_activity
                </span>
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-primary-container/30 to-secondary/30 blur-xl animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-on-surface">Building your store...</p>
              <p className="text-sm text-on-surface-variant">Our AI is crafting the perfect foundation</p>
            </div>
          </div>
        )}

        {/* Input Area */}
        {!createStoreMutation.isPending && (
          <>
            <PromptInput value={prompt} onChange={setPrompt} onSubmit={handleSubmit} />
            <SuggestionChips
              onSelect={(suggestion) => {
                setPrompt(suggestion);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
