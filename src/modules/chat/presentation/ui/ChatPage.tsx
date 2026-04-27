"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/modules/dashboard/store-context";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatHeader } from "../components/ChatHeader";
import { MessageList } from "../components/MessageList";
import { ChatInput } from "../components/ChatInput";

const SUGGESTIONS = [
  "How are my sales doing this week?",
  "What's my best selling product?",
  "Show me recent orders",
  "Add a new product: Handmade candle for $24",
];

export function ChatPage() {
  const { storeId, storeName } = useStore();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const historyQueryKey = trpc.ai.getChatHistory.queryKey();

  const { data: history, isLoading } = useQuery(
    trpc.ai.getChatHistory.queryOptions({ storeId, limit: 50 })
  );

  const sendMutation = useMutation(
    trpc.ai.sendMessage.mutationOptions({
      onMutate: async () => {
        // Cancel in-flight refetches so they don't overwrite our optimistic update
        await queryClient.cancelQueries({ queryKey: historyQueryKey });

        // Snapshot the previous value for rollback
        const previous = queryClient.getQueryData(historyQueryKey);

        return { previous };
      },
      onError: (err, _vars, context) => {
        // Roll back to the previous state on error
        if (context?.previous) {
          queryClient.setQueryData(historyQueryKey, context.previous);
        }
        toast.error(err.message);
      },
      onSettled: () => {
        // Always refetch after mutation to get the real server data
        queryClient.invalidateQueries({ queryKey: historyQueryKey });
      },
    })
  );

  const clearMutation = useMutation(
    trpc.ai.clearChatHistory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: historyQueryKey });
        toast.success("Chat history cleared");
      },
    })
  );

  const messages = history ?? [];

  useEffect(() => {
    if (messages.length > 0 || sendMutation.isPending) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, sendMutation.isPending]);

  function handleSend() {
    const msg = input.trim();
    if (!msg || sendMutation.isPending) return;
    setInput("");
    sendMutation.mutate({ storeId, message: msg });
  }

  function handleSuggestionClick(suggestion: string) {
    setInput(suggestion);
    // Optionally auto-send, but the original code just set input. 
    // Let's make it auto-send for a better UX.
    sendMutation.mutate({ storeId, message: suggestion });
  }

  return (
    <main className="flex-1 flex flex-col max-w-container-max mx-auto w-full pb-32 md:pb-0 relative h-full max-h-screen">
      <ChatHeader
        storeName={storeName}
        onClear={() => clearMutation.mutate({ storeId })}
        isClearDisabled={messages.length === 0}
        isClearing={clearMutation.isPending}
      />

      <MessageList
        messages={messages}
        isLoading={isLoading}
        isSending={sendMutation.isPending}
        onSuggestionClick={handleSuggestionClick}
        suggestions={SUGGESTIONS}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        isSending={sendMutation.isPending}
      />
    </main>
  );
}
