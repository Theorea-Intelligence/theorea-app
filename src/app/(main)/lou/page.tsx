"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

/* ══════════════════════════════════════════════════════════════════════════
   Tea photo mosaic — the visual hero of the empty state
   ══════════════════════════════════════════════════════════════════════════ */

const MOSAIC_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=85",
    alt: "Da Hong Pao oolong",
    height: 200,
  },
  {
    src: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=85",
    alt: "Jasmin Snow Buds",
    height: 140,
  },
  {
    src: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=85",
    alt: "Tea ceremony",
    height: 150,
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=85",
    alt: "Silver Needle white tea",
    height: 195,
  },
  {
    src: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=500&q=85",
    alt: "Gyokuro Japanese green tea",
    height: 155,
  },
  {
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=85",
    alt: "High mountain oolong",
    height: 130,
  },
];

function TeaMosaic() {
  const col1 = [MOSAIC_IMAGES[0], MOSAIC_IMAGES[2], MOSAIC_IMAGES[4]];
  const col2 = [MOSAIC_IMAGES[1], MOSAIC_IMAGES[3], MOSAIC_IMAGES[5]];

  return (
    <div
      className="w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 3,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* Column 1 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {col1.map((img) => (
          <div
            key={img.src}
            style={{ position: "relative", height: img.height, overflow: "hidden" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Column 2 — offset by 30px for stagger */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 30 }}>
        {col2.map((img) => (
          <div
            key={img.src}
            style={{ position: "relative", height: img.height, overflow: "hidden" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Gradient fade at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: "linear-gradient(to top, #c9d9c9 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Streaming dots
   ══════════════════════════════════════════════════════════════════════════ */
function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-[5px] ml-1">
      {[0, 180, 360].map((d) => (
        <span
          key={d}
          className="block rounded-full animate-gentle-pulse"
          style={{
            width: 5,
            height: 5,
            background: "#222f26",
            animationDelay: `${d}ms`,
            opacity: 0.55,
          }}
        />
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Main page
   ══════════════════════════════════════════════════════════════════════════ */

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isStreaming || louState.kind !== "idle") return;

    setInput("");
    setError("");

    const userMsg: Message = { id: `user-${Date.now()}`, role: "user", content };
    const asstMsg: Message = { id: `asst-${Date.now()}`, role: "assistant", content: "" };
    const thread = [...messages, userMsg];

    setMessages([...thread, asstMsg]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/lou/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: thread.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.status === 401) {
        setMessages((p) => p.filter((m) => m.id !== asstMsg.id));
        setLouState({ kind: "sign_in_required" });
        setIsStreaming(false);
        return;
      }
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setMessages((p) => p.filter((m) => m.id !== asstMsg.id));
        setLouState({
          kind: "limit_reached",
          count: d.usage?.count ?? 10,
          limit: d.usage?.limit ?? 10,
        });
        setIsStreaming(false);
        return;
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to reach Lou");
      }

      const ch = res.headers.get("X-Lou-Usage-Count");
      const lh = res.headers.get("X-Lou-Usage-Limit");
      if (ch) setUsageCount(parseInt(ch, 10));
      if (lh) setUsageLimit(parseInt(lh, 10));

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No stream");

      let full = "";
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.text) {
              full += parsed.text;
              setMessages((p) =>
                p.map((m) => (m.id === asstMsg.id ? { ...m, content: full } : m))
              );
            }
          } catch { /* skip */ }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.lou.errorFallback;
      setError(msg);
      setMessages((p) => p.filter((m) => m.id !== asstMsg.id));
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const hasMessages = messages.length > 0;
  const isBlocked = louState.kind !== "idle";
  const remaining = usageCount !== null ? Math.max(0, usageLimit - usageCount) : null;

  return (
    <div
      className="relative flex flex-col"
      style={{
        height: "calc(100dvh - 7.5rem)",
        background: "#c9d9c9",
        overflow: "hidden",
      }}
    >

      {/* ── Paywall overlay ───────────────────────────────────────────────── */}
      {isBlocked && (
        <div
          className="absolute inset-0 z-30 flex items-end justify-center pb-16 backdrop-blur-md"
          style={{ background: "rgba(34,47,38,0.82)" }}
        >
          {/* Photo peeks through above */}
          <div
            className="w-full mx-4 rounded-3xl px-7 py-8 flex flex-col items-center text-center"
            style={{
              background: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(83,112,98,0.1)",
              maxWidth: 360,
              margin: "0 auto",
            }}
          >
            {/* Small gold leaf mark */}
            <div
              className="flex items-center justify-center mb-5"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(83,112,98,0.14)",
                border: "1px solid rgba(83,112,98,0.24)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44" stroke="#222f26" strokeWidth="1.8" fill="#8a6a4a" fillOpacity="0.25" strokeLinecap="round" />
                <path d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44" stroke="rgba(83,112,98,0.52)" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="24" y1="10" x2="24" y2="44" stroke="#222f26" strokeWidth="0.9" strokeLinecap="round" />
              </svg>
            </div>

            {louState.kind === "sign_in_required" ? (
              <>
                <h2
                  className="font-serif font-light leading-snug mb-3"
                  style={{ fontSize: 26, color: "#222f26", letterSpacing: "-0.01em" }}
                >
                  {t.lou.signInRequired}
                </h2>
                <p className="text-[13px] leading-[1.65] mb-7" style={{ color: "rgba(83,112,98,0.68)" }}>
                  {t.lou.signInRequiredSub}
                </p>
                <button
                  onClick={() => router.push("/welcome")}
                  className="w-full py-4 rounded-2xl text-[13px] font-medium tracking-[0.05em] transition-all duration-200 active:scale-[0.98]"
                  style={{ background: "#222f26", color: "#c9d9c9" }}
                >
                  {t.lou.signInButton}
                </button>
              </>
            ) : (
              <>
                <h2
                  className="font-serif font-light leading-snug mb-3"
                  style={{ fontSize: 26, color: "#222f26", letterSpacing: "-0.01em" }}
                >
                  {t.lou.limitReached}
                </h2>
                <p className="text-[13px] leading-[1.65] mb-2" style={{ color: "rgba(83,112,98,0.68)" }}>
                  {t.lou.limitReachedSub}
                </p>
                <p className="text-[11px] tracking-[0.14em] uppercase mb-7" style={{ color: "#222f26" }}>
                  {t.lou.memberPitch}
                </p>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full py-4 rounded-2xl text-[13px] font-medium tracking-[0.05em] transition-all duration-200 active:scale-[0.98] mb-3"
                  style={{ background: "#222f26", color: "#c9d9c9" }}
                >
                  {t.lou.becomeMember}
                </button>
                <p className="text-[11px]" style={{ color: "rgba(136,160,134,0.70)" }}>
                  Renews on the 1st of each month.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EMPTY STATE — Cosmos-style photo-first layout
      ══════════════════════════════════════════════════════════════ */}
      {!hasMessages && (
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {/* Photo mosaic — fills most of the screen */}
          <div className="relative px-4 pt-4" style={{ marginBottom: -20 }}>
            <TeaMosaic />
          </div>

          {/* Text content below the mosaic */}
          <div
            className="relative px-5 pt-8 pb-2 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            {/* Eyebrow label */}
            <p
              className="text-[10px] tracking-[0.22em] uppercase font-medium mb-4"
              style={{ color: "rgba(83,112,98,0.62)" }}
            >
              Your Tea Sommelier
            </p>

            {/* Large editorial heading */}
            <h1
              className="font-serif font-light leading-[1.1] mb-5"
              style={{
                fontSize: "clamp(34px, 10vw, 48px)",
                color: "#222f26",
                letterSpacing: "-0.025em",
                maxWidth: 300,
              }}
            >
              {t.lou.whatExplore}
            </h1>

            {/* Hairline divider */}
            <div
              className="mb-5"
              style={{
                width: "100%",
                height: 1,
                background: "linear-gradient(90deg, rgba(83,112,98,0.24) 0%, transparent 60%)",
              }}
            />

            {/* Suggestion prompts — italic, text-first, like Cosmos labels */}
            <div className="flex flex-col gap-3">
              {t.lou.chips.map((chip, i) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="flex items-start gap-3 text-left w-full group transition-all duration-150 active:opacity-50"
                >
                  <span
                    className="shrink-0 mt-[3px]"
                    style={{
                      fontSize: 9,
                      color: "rgba(83,112,98,0.42)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    ↗
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontStyle: "italic",
                      lineHeight: 1.5,
                      color: i === 0
                        ? "#537062"
                        : "#92a38d",
                      letterSpacing: "0.01em",
                      transition: "color 150ms",
                    }}
                  >
                    {chip}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MESSAGES — editorial transcript
      ══════════════════════════════════════════════════════════════ */}
      {hasMessages && (
        <div
          className="flex-1 overflow-y-auto px-5 pt-6"
          style={{ scrollbarWidth: "none" }}
        >
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              const prevRole = idx > 0 ? messages[idx - 1].role : null;
              const isFirstInGroup = prevRole !== msg.role;

              return (
                <div key={msg.id} className={isFirstInGroup ? "mt-8" : "mt-2"}>

                  {/* Role label */}
                  {isFirstInGroup && (
                    <p
                      className="font-sans font-medium uppercase mb-2.5"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        color: isUser
                          ? "rgba(83,112,98,0.3)"
                          : "rgba(83,112,98,0.45)",
                        textAlign: isUser ? "right" : "left",
                      }}
                    >
                      {isUser ? "You" : "Lou"}
                    </p>
                  )}

                  {isUser ? (
                    /* User — right-aligned italic, dimmer */
                    <p
                      style={{
                        fontSize: 15,
                        lineHeight: 1.65,
                        color: "#537062",
                        fontStyle: "italic",
                        textAlign: "right",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {msg.content}
                    </p>
                  ) : (
                    /* Lou — full width, left border, bright */
                    <div
                      style={{
                        paddingLeft: 16,
                        borderLeft: "1.5px solid rgba(83,112,98,0.28)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: 1.8,
                          color: "#222f26",
                          letterSpacing: "0.012em",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.content}
                        {!msg.content && isStreaming && <StreamingDots />}
                      </p>
                      {msg.content && isStreaming && idx === messages.length - 1 && (
                        <span className="mt-1 block">
                          <StreamingDots />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-6" />
          </div>
        </div>
      )}

      {/* ── Error nudge ───────────────────────────────────────────────────── */}
      {error && (
        <p
          className="text-center px-5 py-1.5"
          style={{ fontSize: 12, color: "#222f26", fontStyle: "italic" }}
        >
          {error}
        </p>
      )}

      {/* ── Usage nudge ───────────────────────────────────────────────────── */}
      {remaining !== null && remaining <= 3 && remaining > 0 && !isBlocked && (
        <p
          className="text-center px-5 py-1 uppercase tracking-widest"
          style={{ fontSize: 9, color: "rgba(136,160,134,0.70)" }}
        >
          {t.lou.messagesRemaining(remaining)}
        </p>
      )}

      {/* ══════════════════════════════════════════════════════════════
          INPUT BAR — pinned at bottom, minimal glass
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="shrink-0 px-4 pb-3 pt-2"
        style={{
          background: "linear-gradient(to top, #c9d9c9 70%, transparent 100%)",
        }}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            /* High-contrast pill: deep forest background, parchment text */
            background: "#222f26",
            border: "none",
            borderRadius: 100,
            padding: "12px 10px 12px 18px",
            boxShadow: "0 2px 16px rgba(34,47,38,0.18)",
          }}
        >
          {/* Leaf icon */}
          <svg width="14" height="14" viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
            <path d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44" stroke="#f1e6c8" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44" stroke="rgba(201,217,201,0.6)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="10" x2="24" y2="44" stroke="#f1e6c8" strokeWidth="1" strokeLinecap="round" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.lou.askPlaceholder}
            disabled={isStreaming || isBlocked}
            className="flex-1 bg-transparent focus:outline-none"
            style={{
              fontSize: 14,
              color: "#f1e6c8",
              caretColor: "#c9d9c9",
              letterSpacing: "0.01em",
              lineHeight: 1.4,
            }}
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || isBlocked}
            className="shrink-0 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 disabled:opacity-20"
            style={{
              width: 36,
              height: 36,
              background: input.trim() && !isStreaming && !isBlocked
                ? "#537062"
                : "rgba(241,230,200,0.12)",
              border: "none",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={input.trim() && !isStreaming && !isBlocked ? "#f1e6c8" : "rgba(241,230,200,0.4)"}
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: "translateX(1px)" }}
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
