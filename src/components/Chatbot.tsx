"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageSquare, X } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage, type MessageRole } from "@/components/ChatMessage";

interface Message {
  role: MessageRole;
  content: string;
}

interface ChatApiResponse {
  reply?: unknown;
  error?: unknown;
}

const MAX_STORED_MESSAGES = 15;
const MAX_CONTEXT_MESSAGES = 12;
const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

function trimMessages(messages: Message[], max: number) {
  return messages.slice(-max);
}

export function ZehnX() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I’m ZehnX. Ask me anything.",
    },
  ]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const canSend = useMemo(
    () => !loading && input.trim().length > 0,
    [loading, input]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !open) {
      return;
    }

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  const sendMessage = async () => {
    if (!canSend) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    const nextMessages = trimMessages([...messages, userMessage], MAX_STORED_MESSAGES);

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: trimMessages(nextMessages, MAX_CONTEXT_MESSAGES),
        }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok) {
        const errorMessage =
          typeof data.error === "string" && data.error.trim().length > 0
            ? data.error
            : FALLBACK_MESSAGE;
        throw new Error(errorMessage);
      }

      if (typeof data.reply !== "string" || data.reply.trim().length === 0) {
        throw new Error("Invalid reply payload");
      }

      const replyText: string = data.reply;

      setMessages((previous) =>
        trimMessages(
          [
            ...previous,
            {
              role: "assistant",
              content: replyText,
            },
          ],
          MAX_STORED_MESSAGES
        )
      );
    } catch (error) {
      const fallbackText =
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : FALLBACK_MESSAGE;

      setMessages((previous) =>
        trimMessages(
          [
            ...previous,
            {
              role: "assistant",
              content: fallbackText,
            },
          ],
          MAX_STORED_MESSAGES
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] md:bottom-8 md:right-8">
      {open ? (
        <div className="mb-3 flex h-[70vh] w-[calc(100vw-2.5rem)] max-h-[620px] max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]/95 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-[var(--background-secondary)]/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="text-[var(--accent-neon)]" size={18} />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">ZehnX</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollContainerRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <ChatMessage
                key={`${message.role}-${index}-${message.content.slice(0, 16)}`}
                role={message.role}
                content={message.content}
              />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-[var(--background-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            disabled={loading}
            inputRef={inputRef}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold text-[#0B0B0B] shadow-[0_0_30px_rgba(182,255,59,0.35)] transition hover:scale-105"
        aria-label={open ? "Close ZehnX" : "Open ZehnX"}
      >
        <MessageSquare size={18} />
        {open ? "Close" : "ZehnX"}
      </button>
    </div>
  );
}
