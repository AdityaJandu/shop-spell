import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isSending,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-6 md:px-10 py-6 border-t border-surface-variant bg-background/95 backdrop-blur-sm sticky bottom-0">
      <div className="max-w-3xl mx-auto relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-primary-container/20 to-secondary/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-end bg-surface-container-low rounded-2xl p-2.5 border border-surface-variant/50 shadow-sm focus-within:border-primary-container/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your store..."
              rows={1}
              className="flex-1 bg-transparent border-none resize-none px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none max-h-40 min-h-[44px]"
            />
            <Button
              onClick={onSend}
              disabled={!value.trim() || isSending}
              className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center hover:bg-primary-container/90 disabled:opacity-30 transition-all shrink-0 shadow-lg shadow-primary-container/20 active:scale-90"
              size="icon"
            >
              {isSending ? (
                <span className="material-symbols-outlined text-lg animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-lg font-bold">
                  arrow_upward
                </span>
              )}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center px-2 mt-3">
          <p className="text-[10px] text-on-surface-variant/40">
            AI can make mistakes. Verify important information.
          </p>
          <p className="text-[10px] text-on-surface-variant/40 hidden sm:block">
            Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
