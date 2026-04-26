"use client";

import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToolCall {
  toolName: string;
  result?: string;
}

export interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date | string;
  storeId?: string;
  toolCalls?: ToolCall[] | null;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  onSuggestionClick: (suggestion: string) => void;
  onRegenerate?: () => void;
  suggestions: string[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOOL_ICONS: Record<string, string> = {
  search: "search",
  order: "package_2",
  product: "inventory_2",
  analytic: "bar_chart",
  report: "summarize",
  update: "edit",
  delete: "delete",
  create: "add_circle",
};

const SKELETON_ROWS: Array<{ align: "start" | "end"; w: string; h: string }> = [
  { align: "end", w: "w-[55%]", h: "h-14" },
  { align: "start", w: "w-[68%]", h: "h-20" },
  { align: "end", w: "w-[42%]", h: "h-12" },
  { align: "start", w: "w-[62%]", h: "h-16" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToolIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(TOOL_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "terminal";
}

function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}



// ─── Avatars ──────────────────────────────────────────────────────────────────

function AssistantAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-[10px] bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center shadow-md ring-1 ring-black/10">
      <span className="material-symbols-outlined text-white text-[15px] icon-fill">
        auto_awesome
      </span>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-[10px] bg-gradient-to-br from-surface-variant to-surface-container-high flex items-center justify-center shadow ring-1 ring-black/10">
      <span className="material-symbols-outlined text-on-surface-variant text-[15px] icon-fill">
        person
      </span>
    </div>
  );
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

function MarkdownContent({
  content,
  isUser = false,
}: {
  content: string;
  isUser?: boolean;
}) {
  const prose = isUser ? "text-white/95" : "text-on-surface";

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className={cn("text-sm leading-relaxed mb-2 last:mb-0", prose)}>{children}</p>
        ),
        strong: ({ children }) => (
          <strong className={cn("font-semibold", isUser ? "text-white" : "text-on-surface")}>
            {children}
          </strong>
        ),
        em: ({ children }) => <em className="italic opacity-90">{children}</em>,
        h1: ({ children }) => (
          <h1 className={cn("text-base font-bold mb-2 mt-1", prose)}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className={cn("text-sm font-bold mb-1.5 mt-1", prose)}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className={cn("text-sm font-semibold mb-1 mt-0.5 opacity-90", prose)}>
            {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul className="list-none space-y-1.5 mb-2 pl-0.5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1.5 mb-2 pl-0.5">{children}</ol>
        ),
        li: ({ children }) => (
          <li className={cn("flex items-start gap-2 text-sm leading-relaxed", prose)}>
            <span
              className={cn(
                "mt-[6px] w-1.5 h-1.5 rounded-full flex-shrink-0",
                isUser ? "bg-white/50" : "bg-primary-container/60"
              )}
            />
            <span>{children}</span>
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className={cn(
              "border-l-2 pl-3 my-2 italic opacity-80 text-sm",
              isUser ? "border-white/40" : "border-primary-container/40"
            )}
          >
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-2 rounded-xl border border-surface-variant/30">
            <table className="text-xs w-full border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className={cn(isUser ? "bg-black/20" : "bg-surface-container")}>{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border-t border-surface-variant/20">{children}</td>
        ),
        code: ({ className, children }) => {
          const isInline = !className;
          return isInline ? (
            <code
              className={cn(
                "px-1.5 py-0.5 rounded-md text-[12px] font-mono",
                isUser
                  ? "bg-black/25 text-white/90"
                  : "bg-surface-container text-primary-container"
              )}
            >
              {children}
            </code>
          ) : (
            <pre
              className={cn(
                "my-2 p-3.5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed",
                isUser
                  ? "bg-black/30 text-white/90"
                  : "bg-surface-container-high text-on-surface"
              )}
            >
              <code>{children}</code>
            </pre>
          );
        },
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "underline underline-offset-2 decoration-dotted hover:decoration-solid transition-all",
              isUser
                ? "text-white/90 hover:text-white"
                : "text-primary hover:text-primary/80"
            )}
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy message"}
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200",
        copied
          ? "bg-secondary/15 text-secondary"
          : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
      )}
    >
      <span className="material-symbols-outlined text-[13px]">
        {copied ? "check" : "content_copy"}
      </span>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── Tool call badges ─────────────────────────────────────────────────────────

function ToolBadges({ toolCalls }: { toolCalls: ToolCall[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-surface-variant/20">
      {toolCalls.map((t, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-secondary/10 text-primary border border-secondary/20 px-2.5 py-1 rounded-full"
        >
          <span className="material-symbols-outlined text-[12px]">
            {getToolIcon(t.toolName)}
          </span>
          {t.toolName.replace(/_/g, " ")}
        </span>
      ))}
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <AssistantAvatar />
      <div className="flex items-center gap-3 px-5 py-3.5 bg-surface-container-low border border-surface-variant/30 rounded-2xl rounded-bl-sm shadow-sm">
        <div className="flex gap-[5px] items-center">
          {[0, 160, 320].map((delay) => (
            <span
              key={delay}
              className="w-[7px] h-[7px] rounded-full bg-primary-container/50 animate-bounce"
              style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
            />
          ))}
        </div>
        <span className="text-[11px] tracking-wide font-medium text-on-surface-variant/70">
          Thinking…
        </span>
      </div>
    </div>
  );
}

// ─── Loading skeletons ────────────────────────────────────────────────────────

function LoadingSkeletons() {
  return (
    <div className="space-y-6 py-10">
      {SKELETON_ROWS.map(({ align, w, h }, i) => (
        <div
          key={i}
          className={cn(
            "flex items-end gap-3",
            align === "end" ? "justify-end" : "justify-start"
          )}
        >
          {align === "start" && (
            <Skeleton className="w-8 h-8 rounded-[10px] flex-shrink-0 bg-surface-variant/20" />
          )}
          <Skeleton
            className={cn(
              w,
              h,
              "rounded-2xl",
              align === "end"
                ? "rounded-br-sm bg-primary-container/10"
                : "rounded-bl-sm bg-surface-variant/15"
            )}
          />
          {align === "end" && (
            <Skeleton className="w-8 h-8 rounded-[10px] flex-shrink-0 bg-surface-variant/20" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Empty / welcome state ────────────────────────────────────────────────────

function EmptyState({
  suggestions,
  onSuggestionClick,
}: {
  suggestions: string[];
  onSuggestionClick: (s: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center w-full">
      {/* Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-2xl opacity-25 bg-gradient-to-br from-primary-container via-secondary to-primary rounded-full scale-[1.8]" />
        <div className="relative w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-primary-container/20 via-secondary/10 to-transparent flex items-center justify-center shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
          <span className="material-symbols-outlined text-[38px] text-primary-container icon-fill">
            auto_awesome
          </span>
        </div>
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-secondary/70 ring-2 ring-surface animate-pulse shadow" />
        <span
          className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-primary-container/60 ring-2 ring-surface animate-pulse shadow"
          style={{ animationDelay: "700ms" }}
        />
      </div>

      <h2 className="text-[22px] font-bold text-on-surface tracking-tight mb-2">
        How can I help today?
      </h2>
      <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed mb-9">
        Ask about analytics, manage products, or look up orders.
      </p>

      {/* Suggestion grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestionClick(s)}
            className="group relative text-left px-5 py-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-variant/40 hover:border-primary-container/30 text-sm text-on-surface transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary-container/5 to-transparent rounded-2xl transition-opacity duration-300" />
            <div className="relative flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-primary-container/10 group-hover:bg-primary-container/20 flex items-center justify-center transition-colors duration-200">
                <span className="material-symbols-outlined text-primary-container text-[14px] transition-transform duration-200 group-hover:translate-x-0.5">
                  arrow_forward
                </span>
              </span>
              <span className="leading-snug">{s}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isLastAssistant,
  showAvatar,
  isSending,
  onRegenerate,
}: {
  msg: Message;
  isLastAssistant: boolean;
  showAvatar: boolean;
  isSending: boolean;
  onRegenerate?: () => void;
}) {
  const isUser = msg.role === "user";

  return (
    <div
      className={cn(
        "flex items-end gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant avatar (left) */}
      {!isUser && (
        <div
          className={cn(
            "transition-opacity duration-200",
            showAvatar ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <AssistantAvatar />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "group relative max-w-[76%] rounded-2xl px-5 py-4 shadow-sm transition-shadow duration-200 hover:shadow-md",
          isUser
            ? "bg-primary-container text-white rounded-br-sm"
            : "bg-surface-container-low/80 backdrop-blur-sm border border-surface-variant/30 rounded-bl-sm"
        )}
      >
        {/* Tool badges */}
        {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
          <ToolBadges toolCalls={msg.toolCalls} />
        )}

        {/* Content */}
        <MarkdownContent content={msg.content} isUser={isUser} />

        {/* Footer: actions + timestamp */}
        <div
          className={cn(
            "flex items-center mt-2.5 gap-2",
            isUser ? "justify-end" : "justify-between"
          )}
        >
          {!isUser && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CopyButton text={msg.content} />
              {isLastAssistant && onRegenerate && !isSending && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-[13px]">refresh</span>
                  Retry
                </button>
              )}
            </div>
          )}

          <time
            className={cn(
              "text-[10px] font-medium select-none tabular-nums",
              isUser ? "text-white/50" : "text-on-surface-variant/50"
            )}
          >
            {formatTime(msg.createdAt)}
          </time>
        </div>
      </div>

      {/* User avatar (right) */}
      {isUser && (
        <div
          className={cn(
            "transition-opacity duration-200",
            showAvatar ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <UserAvatar />
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MessageList({
  messages,
  isLoading,
  isSending,
  onSuggestionClick,
  onRegenerate,
  suggestions,
  messagesEndRef,
}: MessageListProps) {
  if (isLoading) {
    return (
      <ScrollArea className="flex-1 px-6 md:px-10">
        <div className="w-full max-w-3xl mx-auto">
          <LoadingSkeletons />
        </div>
      </ScrollArea>
    );
  }

  if (messages.length === 0 && !isSending) {
    return (
      <ScrollArea className="flex-1 px-6 md:px-10">
        <div className="w-full max-w-3xl mx-auto py-10">
          <EmptyState
            suggestions={suggestions}
            onSuggestionClick={onSuggestionClick}
          />
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 px-6 md:px-10">
      <div className="w-full max-w-3xl mx-auto py-10 space-y-4">
        {messages.map((msg, i) => {
          const isLastAssistant =
            msg.role === "assistant" && i === messages.length - 1;
          const isNextSame =
            i < messages.length - 1 && messages[i + 1].role === msg.role;

          return (
            <MessageBubble
              key={msg.id ?? i}
              msg={msg}
              isLastAssistant={isLastAssistant}
              showAvatar={!isNextSame}
              isSending={isSending}
              onRegenerate={onRegenerate}
            />
          );
        })}

        {isSending && <TypingIndicator />}
        <div ref={messagesEndRef} className="h-2" />
      </div>
    </ScrollArea>
  );
}