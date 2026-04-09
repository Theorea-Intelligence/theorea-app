"use client";

import { useState, useRef, useEffect } from "react";
import LouOrb from "@/components/ui/LouOrb";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function LouPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isStreaming) return;

    setInput("");
    setError("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
    };

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, assistantMessage]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/lou/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to reach Lou");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: fullText }
                      : m
                  )
                );
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-4rem)]">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
            <div className="mb-6">
              <LouOrb variant="chat" />
            </div>

            <h2 className="font-serif text-[18px] font-light text-ink mb-1.5">
              What shall we explore?
            </h2>
            <p className="text-[13px] text-ink-muted text-center max-w-[260px] leading-relaxed mb-5">
              Tea varieties, brewing techniques, flavour profiles, or a mindful ritual.
            </p>

            {/* Quick suggestion chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[320px]">
              {[
                "How do I brew Da Hong Pao?",
                "What tea suits this evening?",
                "Compare your two teas",
                "Guide me through a ritual",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3.5 py-2 rounded-2xl bg-porcelain text-[12px] text-ink-muted shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-transform duration-200"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="px-1 py-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="shrink-0 mr-2 mt-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-ink/80 to-ink">
                      <svg width="12" height="12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44" stroke="#c4a46a" strokeWidth="1.5" fill="#8a6a4a" fillOpacity="0.3" strokeLinecap="round" />
                        <path d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="rgba(255,255,255,0.1)" strokeLinecap="round" />
                        <line x1="24" y1="10" x2="24" y2="44" stroke="#c4a46a" strokeWidth="0.8" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-ink text-porcelain rounded-br-md"
                      : "bg-porcelain text-ink shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-bl-md"
                  }`}
                >
                  <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                    {msg.role === "assistant" && !msg.content && isStreaming && (
                      <span className="inline-flex gap-1 ml-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-oolong/40 animate-gentle-pulse" />
                        <span className="h-1.5 w-1.5 rounded-full bg-oolong/40 animate-gentle-pulse animation-delay-200" />
                        <span className="h-1.5 w-1.5 rounded-full bg-oolong/40 animate-gentle-pulse animation-delay-400" />
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2">
          <p className="text-[12px] text-oolong-dark text-center">{error}</p>
        </div>
      )}

      {/* Input area */}
      <div className="pt-2 pb-1 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 flex items-center rounded-2xl bg-porcelain px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Lou anything..."
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted/50 focus:outline-none"
              disabled={isStreaming}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-oolong to-oolong-dark active:scale-[0.93] transition-all duration-200 disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-porcelain translate-x-[1px]">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
