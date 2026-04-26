"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/modules/dashboard/store-context";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ChatPage() {
  const { storeId, storeName } = useStore();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: history, isLoading } = useQuery(
    trpc.ai.getChatHistory.queryOptions({ storeId, limit: 50 })
  );

  const sendMutation = useMutation(
    trpc.ai.sendMessage.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.ai.getChatHistory.queryKey() });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  const clearMutation = useMutation(
    trpc.ai.clearChatHistory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.ai.getChatHistory.queryKey() });
        toast.success("Chat history cleared");
      },
    })
  );

  const messages = history ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sendMutation.isPending]);

  function handleSend() {
    const msg = input.trim();
    if (!msg || sendMutation.isPending) return;
    setInput("");
    sendMutation.mutate({ storeId, message: msg });
  }

  const suggestions = [
    "How are my sales doing this week?",
    "What's my best selling product?",
    "Show me recent orders",
    "Add a new product: Handmade candle for $24",
  ];

  return (
    <main className="flex-1 flex flex-col max-w-container-max mx-auto w-full pb-32 md:pb-0">
      {/* Chat Header */}
      <div className="px-6 md:px-10 py-4 border-b border-surface-variant flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl icon-fill">auto_fix_high</span>
          </div>
          <div>
            <h1 className="font-h3 text-base text-on-surface font-bold">ShopSpell AI</h1>
            <p className="text-xs text-on-surface-variant">Managing {storeName}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => clearMutation.mutate({ storeId })}
          disabled={clearMutation.isPending || messages.length === 0}
          className="text-on-surface-variant hover:text-destructive rounded-full"
          size="sm"
        >
          <span className="material-symbols-outlined text-[18px] mr-1">delete_sweep</span>
          Clear
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 md:px-10">
        <div className="w-full max-w-3xl mx-auto py-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <Skeleton className={`h-16 rounded-2xl ${i % 2 === 0 ? "w-2/3" : "w-3/4"}`} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 && !sendMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-16 text-center w-full">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-container/20 to-secondary/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-primary-container icon-fill">
                  auto_fix_high
                </span>
              </div>
              <h2 className="font-h2 text-xl text-on-surface mb-2">Hey there! 👋</h2>
              <p className="text-sm text-on-surface-variant max-w-md mb-8 w-full">
                I&apos;m your AI store assistant. Ask me about your analytics, manage products, or check on orders.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="text-left px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-variant/50 text-sm text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary-container text-[16px] mr-2 align-middle">
                      arrow_forward
                    </span>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                      msg.role === "user"
                        ? "bg-primary-container text-white rounded-br-md"
                        : "bg-surface-container-low text-on-surface rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" && (msg as any).toolCalls && (msg as any).toolCalls.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {((msg as any).toolCalls as { toolName: string }[]).map((t, j) => (
                          <span key={j} className="inline-flex items-center gap-1 text-[10px] font-label-caps uppercase tracking-widest bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]">build</span>
                            {t.toolName.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-[10px] opacity-50 mt-1 block">
                      {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              {sendMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-low rounded-2xl rounded-bl-md px-5 py-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-on-surface-variant ml-2">Thinking...</span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="px-6 md:px-10 py-4 border-t border-surface-variant bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/5 to-secondary/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-end bg-surface-container-low rounded-2xl p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about your store..."
                rows={1}
                className="flex-1 bg-transparent border-none resize-none px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none max-h-32 min-h-[40px]"
                style={{ height: "auto" }}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || sendMutation.isPending}
                className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center hover:bg-primary-container/90 disabled:opacity-40 transition-all shrink-0"
                size="icon"
              >
                {sendMutation.isPending ? (
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-lg">arrow_upward</span>
                )}
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-on-surface-variant/50 text-center mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </main>
  );
}
