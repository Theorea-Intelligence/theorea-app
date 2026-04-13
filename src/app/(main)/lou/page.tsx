"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import LouOrb from "@/components/ui/LouOrb";
import { useLocale } from "@/i18n/LocaleContext";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type LouState =
  | { kind: "idle" }
  | { kind: "sign_in_required" }
  | { kind: "limit_reached"; count: number; limit: number };

/* ── Lou leaf avatar ─────────────────────────────────────────────────────── */
function LouAvatar() {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
      style={{
        background: "rgba(196,164,106,0.12)",
        border: "1px solid rgba(196,164,106,0.2)",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44" stroke="#c4a46a" strokeWidth="2" fill="#8a6a4a" fillOpacity="0.25" strokeLinecap="round" />
        <path d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44" stroke="rgba(196,164,106,0.35)" strokeWidth="2" fill="rgba(196,164,106,0.08)" strokeLinecap="round" />
        <line x1="24" y1="10" x2="24" y2="44" stroke="#c4a46a" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function LouPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [louState, setLouState] = useState<LouState>({ kind: "idle" });
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [usageLimit, setUsageLimit] = useState<number>(10);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocale();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isStreaming) return;
    if (louState.kind !== "idle") return;

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

      if (response.status === 401) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
        setLouState({ kind: "sign_in_required" });
        setIsStreaming(false);
        return;
      }

      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
        setLouState({
          kind: "limit_reached",
          count: errorData.usage?.count ?? 10,
          limit: errorData.usage?.limit ?? 10,
        });
        setIsStreaming(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to reach Lou");
      }

      const usageCountHeader = response.headers.get("X-Lou-Usage-Count");
      const usageLimitHeader = response.headers.get("X-Lou-Usage-Limit");
      if (usageCountHeader) setUsageCount(parseInt(usageCountHeader, 10));
      if (usageLimitHeader) setUsageLimit(parseInt(usageLimitHeader, 10));

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
                    m.id === assistantMessage.id ? { ...m, content: fullText } : m
                  )
                );
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.lou.errorFallback;
      setError(msg);
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
  const isBlocked = louState.kind !== "idle";
  const remaining =
    usageCount !== null ? Math.max(0, usageLimit - usageCount) : null;

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-4rem)]">

      {/* ── Paywall / Sign-in overlay ─────────────────────────────────── */}
      {isBlocked && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center px-8 backdrop-blur-sm"
          style={{ background: "rgba(13,11,8,0.92)" }}
        >
          <div className="flex flex-col items-center text-center max-w-[300px] animate-fade-in-up">
            <div className="mb-6">
              <LouOrb variant="hero" />
            </div>

            {louState.kind === "sign_in_required" && (
              <>
                <h2 className="font-serif text-[22px] font-light mb-2" style={{ color: "#f0ebe3" }}>
                  {t.lou.signInRequired}
                </h2>
                <p className="text-[13px] leading-relaxed mb-7" style={{ color: "rgba(176,162,146,0.6)" }}>
                  {t.lou.signInRequiredSub}
                </p>
                <button
                  onClick={() => router.push("/welcome")}
                  className="w-full px-6 py-3.5 text-[14px] font-medium rounded-2xl active:scale-[0.98] transition-all duration-200"
                  style={{
                    background: "#c4a46a",
                    color: "#0d0b08",
                  }}
                >
                  {t.lou.signInButton}
                </button>
              </>
            )}

            {louState.kind === "limit_reached" && (
              <>
                <h2 className="font-serif text-[22px] font-light mb-2" style={{ color: "#f0ebe3" }}>
                  {t.lou.limitReached}
                </h2>
                <p className="text-[13px] leading-relaxed mb-2" style={{ color: "rgba(176,162,146,0.6)" }}>
                  {t.lou.limitReachedSub}
                </p>
                <p className="text-[12px] mb-7 font-medium tracking-wide" style={{ color: "#c4a46a" }}>
                  {t.lou.memberPitch}
                </p>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full px-6 py-3.5 text-[14px] font-medium rounded-2xl active:scale-[0.98] transition-all duration-200 mb-3"
                  style={{ background: "#c4a46a", color: "#0d0b08" }}
                >
                  {t.lou.becomeMember}
                </button>
                <p className="text-[11px]" style={{ color: "rgba(110,99,88,0.8)" }}>
                  Renews on the 1st of each month.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Chat area ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
            <div className="mb-5">
              <LouOrb variant="chat" />
            </div>

            <h2
              className="font-serif text-[20px] font-light mb-1.5"
              style={{ color: "#f0ebe3" }}
            >
              {t.lou.whatExplore}
            </h2>
            <p
              className="text-[13px] text-center max-w-[260px] leading-relaxed mb-6"
              style={{ color: "rgba(176,162,146,0.55)" }}
            >
              {t.lou.subtitle}
            </p>

            {/* Quick suggestion chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[320px]">
              {t.lou.chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3.5 py-2 rounded-2xl text-[12px] active:scale-[0.97] transition-all duration-200"
                  style={{
                    background: "rgba(255,247,235,0.04)",
                    border: "1px solid rgba(196,164,106,0.12)",
                    color: "rgba(176,162,146,0.7)",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Messages ── */
          <div className="px-1 py-3 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Lou avatar */}
                {msg.role === "assistant" && (
                  <div className="shrink-0 mr-2.5 mt-1">
                    <LouAvatar />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3"
                  style={
                    msg.role === "user"
                      ? {
                          background: "#f0ebe3",
                          color: "#1e1a14",
                          borderBottomRightRadius: "6px",
                        }
                      : {
                          background: "rgba(255,247,235,0.04)",
                          border: "1px solid rgba(255,247,235,0.06)",
                          color: "#f0ebe3",
                          borderBottomLeftRadius: "6px",
                        }
                  }
                >
                  <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                    {msg.role === "assistant" && !msg.content && isStreaming && (
                      <span className="inline-flex gap-1 ml-1">
                        <span
                          className="h-1.5 w-1.5 rounded-full animate-gentle-pulse"
                          style={{ background: "rgba(196,164,106,0.5)" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full animate-gentle-pulse animation-delay-200"
                          style={{ background: "rgba(196,164,106,0.5)" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full animate-gentle-pulse animation-delay-400"
                          style={{ background: "rgba(196,164,106,0.5)" }}
                        />
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

      {/* ── Error message ─────────────────────────────────────────────────── */}
      {error && (
        <div className="px-4 py-2">
          <p className="text-[12px] text-center" style={{ color: "#a8885a" }}>{error}</p>
        </div>
      )}

      {/* ── Remaining messages nudge ──────────────────────────────────────── */}
      {remaining !== null && remaining <= 3 && remaining > 0 && !isBlocked && (
        <div className="px-4 py-1.5 text-center">
          <p className="text-[11px] tracking-wide" style={{ color: "rgba(110,99,88,0.7)" }}>
            {t.lou.messagesRemaining(remaining)}
          </p>
        </div>
      )}

      {/* ── Input area ────────────────────────────────────────────────────── */}
      <div className="pt-2 pb-1 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div
            className="flex-1 flex items-center rounded-2xl px-4 py-3"
            style={{
              background: "rgba(255,247,235,0.04)",
              border: "1px solid rgba(255,247,235,0.07)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.lou.askPlaceholder}
              className="flex-1 bg-transparent text-[14px] focus:outline-none"
              style={{
                color: "#f0ebe3",
              }}
              disabled={isStreaming || isBlocked}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || isBlocked}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full active:scale-[0.93] transition-all duration-200 disabled:opacity-25"
            style={{
              background: "linear-gradient(135deg, #d4b88a 0%, #c4a46a 50%, #a8885a 100%)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0d0b08"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="translate-x-[1px]"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
