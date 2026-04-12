"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LouOrb from "@/components/ui/LouOrb";
import { useLocale } from "@/i18n/LocaleContext";
import {
  type TeaProduct,
  ALL_PRODUCTS,
  getSuggestionsForResponse,
} from "@/lib/data/products";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type LouState =
  | { kind: "idle" }
  | { kind: "sign_in_required" }
  | { kind: "limit_reached"; count: number; limit: number };

// ── Product suggestion card (3 per Lou response) ─────────────────────────────

function ProductCard({ product }: { product: TeaProduct }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/marketplace")}
      className="shrink-0 w-[148px] rounded-[18px] overflow-hidden bg-ink shadow-[0_4px_20px_rgba(0,0,0,0.18)] active:scale-[0.96] transition-all duration-200 text-left"
    >
      {/* Photo */}
      <div className="relative w-full h-[100px] bg-ink-light overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover opacity-90"
          unoptimized
          onError={(e) => {
            // Graceful fallback — show a warm gradient
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        {/* Théorea badge */}
        {product.brandTag === "theorea" && (
          <span className="absolute top-2 left-2 text-[9px] tracking-[0.08em] uppercase font-medium text-oolong-light bg-ink/60 backdrop-blur-sm px-1.5 py-[2px] rounded-full">
            Théorea
          </span>
        )}

        {/* Coming soon badge */}
        {!product.available && (
          <span className="absolute top-2 right-2 text-[8px] tracking-[0.06em] uppercase text-ink-muted bg-ink/70 backdrop-blur-sm px-1.5 py-[2px] rounded-full">
            Soon
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-3">
        <p className="font-serif text-[13px] font-light text-porcelain leading-tight line-clamp-1">
          {product.name}
        </p>
        <p className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">
          {product.flavourNote}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[12px] font-medium text-oolong-light">
            {product.price}
          </span>
          <span className="text-[10px] text-oolong tracking-wide font-medium">
            Shop →
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Product suggestion row ────────────────────────────────────────────────────

function ProductSuggestions({
  responseText,
}: {
  responseText: string;
}) {
  const suggestions = getSuggestionsForResponse(responseText);

  return (
    <div className="mt-2 -mx-1">
      <p className="text-[10px] text-ink-muted uppercase tracking-[0.08em] px-1 mb-2">
        You may enjoy
      </p>
      <div className="flex gap-2.5 overflow-x-auto pb-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {suggestions.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

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

      // ── Handle access errors ──────────────────────────────────────────────
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

      // ── Update usage counter from response headers ────────────────────────
      const usageCountHeader = response.headers.get("X-Lou-Usage-Count");
      const usageLimitHeader = response.headers.get("X-Lou-Usage-Limit");
      if (usageCountHeader) setUsageCount(parseInt(usageCountHeader, 10));
      if (usageLimitHeader) setUsageLimit(parseInt(usageLimitHeader, 10));

      // ── Stream the response ───────────────────────────────────────────────
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
              // skip malformed chunks
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

  // Last assistant message ID — used to suppress product cards while streaming
  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-4rem)]">

      {/* ── Paywall / Sign-in overlay ──────────────────────────────────────── */}
      {isBlocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-8 bg-parchment/95 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center max-w-[300px] animate-fade-in-up">
            <div className="mb-6">
              <LouOrb variant="hero" />
            </div>

            {louState.kind === "sign_in_required" && (
              <>
                <h2 className="font-serif text-[22px] font-light text-ink mb-2">
                  {t.lou.signInRequired}
                </h2>
                <p className="text-[13px] text-ink-muted leading-relaxed mb-7">
                  {t.lou.signInRequiredSub}
                </p>
                <button
                  onClick={() => router.push("/welcome")}
                  className="w-full px-6 py-3.5 bg-ink text-porcelain text-[14px] font-medium rounded-2xl active:scale-[0.98] transition-all duration-200"
                >
                  {t.lou.signInButton}
                </button>
              </>
            )}

            {louState.kind === "limit_reached" && (
              <>
                <h2 className="font-serif text-[22px] font-light text-ink mb-2">
                  {t.lou.limitReached}
                </h2>
                <p className="text-[13px] text-ink-muted leading-relaxed mb-2">
                  {t.lou.limitReachedSub}
                </p>
                <p className="text-[12px] text-oolong/80 mb-7 font-medium tracking-wide">
                  {t.lou.memberPitch}
                </p>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full px-6 py-3.5 bg-ink text-porcelain text-[14px] font-medium rounded-2xl active:scale-[0.98] transition-all duration-200 mb-3"
                >
                  {t.lou.becomeMember}
                </button>
                <p className="text-[11px] text-ink-muted/60">
                  Renews on the 1st of each month.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Chat area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* Empty / welcome state */
          <div className="flex flex-col py-6 animate-fade-in-up h-full overflow-y-auto">
            {/* Orb + heading */}
            <div className="flex flex-col items-center pt-4">
              <div className="mb-5">
                <LouOrb variant="chat" />
              </div>

              <h2 className="font-serif text-[18px] font-light text-ink mb-1.5">
                {t.lou.whatExplore}
              </h2>
              <p className="text-[13px] text-ink-muted text-center max-w-[260px] leading-relaxed mb-5">
                {t.lou.subtitle}
              </p>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-[320px] mb-6">
                {t.lou.chips.map((chip) => (
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

            {/* ── Featured teas ──────────────────────────────────────────────── */}
            <div className="px-1">
              <p className="text-[10px] text-ink-muted uppercase tracking-[0.08em] mb-2.5 px-0.5">
                From the collection
              </p>
              <div className="flex gap-2.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ALL_PRODUCTS.slice(0, 3).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="px-1 py-3 space-y-4">
            {messages.map((msg) => {
              // Show product cards for completed assistant messages only
              const isLastAndStreaming =
                isStreaming && msg.id === lastAssistantId;
              const showCards =
                msg.role === "assistant" &&
                msg.content.length > 40 &&
                !isLastAndStreaming;

              return (
                <div key={msg.id}>
                  <div
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {/* Lou avatar */}
                    {msg.role === "assistant" && (
                      <div className="shrink-0 mr-2 mt-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-ink/80 to-ink">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44"
                              stroke="#c4a46a"
                              strokeWidth="1.5"
                              fill="#8a6a4a"
                              fillOpacity="0.3"
                              strokeLinecap="round"
                            />
                            <path
                              d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44"
                              stroke="rgba(255,255,255,0.4)"
                              strokeWidth="1.5"
                              fill="rgba(255,255,255,0.1)"
                              strokeLinecap="round"
                            />
                            <line
                              x1="24"
                              y1="10"
                              x2="24"
                              y2="44"
                              stroke="#c4a46a"
                              strokeWidth="0.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-ink text-porcelain rounded-br-md"
                          : "bg-porcelain text-ink shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-bl-md"
                      }`}
                    >
                      <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                        {msg.role === "assistant" &&
                          !msg.content &&
                          isStreaming && (
                            <span className="inline-flex gap-1 ml-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-oolong/40 animate-gentle-pulse" />
                              <span className="h-1.5 w-1.5 rounded-full bg-oolong/40 animate-gentle-pulse animation-delay-200" />
                              <span className="h-1.5 w-1.5 rounded-full bg-oolong/40 animate-gentle-pulse animation-delay-400" />
                            </span>
                          )}
                      </p>
                    </div>
                  </div>

                  {/* ── Product suggestion cards (3 per Lou response) ──────── */}
                  {showCards && (
                    <div className="ml-9 mt-1">
                      <ProductSuggestions responseText={msg.content} />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Error message ──────────────────────────────────────────────────── */}
      {error && (
        <div className="px-4 py-2">
          <p className="text-[12px] text-oolong-dark text-center">{error}</p>
        </div>
      )}

      {/* ── Remaining messages nudge ───────────────────────────────────────── */}
      {remaining !== null && remaining <= 3 && remaining > 0 && !isBlocked && (
        <div className="px-4 py-1.5 text-center">
          <p className="text-[11px] text-ink-muted/60 tracking-wide">
            {t.lou.messagesRemaining(remaining)}
          </p>
        </div>
      )}

      {/* ── Input area ─────────────────────────────────────────────────────── */}
      <div className="pt-2 pb-1 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 flex items-center rounded-2xl bg-porcelain px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.lou.askPlaceholder}
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted/50 focus:outline-none"
              disabled={isStreaming || isBlocked}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || isBlocked}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-oolong to-oolong-dark active:scale-[0.93] transition-all duration-200 disabled:opacity-30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-porcelain translate-x-[1px]"
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
