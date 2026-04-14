"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTeaContext } from "@/lib/context/useTeaContext";
import { useLocale } from "@/i18n/LocaleContext";
import { ALL_PRODUCTS, type TeaProduct } from "@/lib/data/products";

const SERIF = '"Playfair Display Variable", "Georgia", serif';
const SANS  = '"Nunito Sans Variable", "Helvetica Neue", system-ui, sans-serif';

/* ── Tea recommendation carousel — same 3 teas as homepage ──────────────── */
function TeaCarousel() {
  const { recommendation, time, isLoading } = useTeaContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const primaryProduct =
    ALL_PRODUCTS.find((p) => p.name.toLowerCase() === recommendation.tea.toLowerCase()) ??
    ALL_PRODUCTS[0];
  const others = ALL_PRODUCTS.filter((p) => p.id !== primaryProduct.id).slice(0, 2);

  const cards = [
    { product: primaryProduct, reason: recommendation.reason },
    {
      product: others[0],
      reason: "A floral, meditative choice — jasmine unfolds slowly in warm water.",
    },
    {
      product: others[1],
      reason: "Layered complexity born from patience. A journey through terroir and time.",
    },
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    if (w === 0) return;
    setActiveIndex(Math.min(Math.round(scrollRef.current.scrollLeft / w), cards.length - 1));
  };

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({ left: i * (scrollRef.current.clientWidth), behavior: "smooth" });
    setActiveIndex(i);
  };

  if (isLoading) {
    return (
      <div style={{
        height: 240, borderRadius: 20,
        background: "linear-gradient(135deg, #f5f5f1, #ededea)",
        animation: "pulse 2s ease-in-out infinite",
      }} />
    );
  }

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{
          fontFamily: SANS, fontSize: 10, fontWeight: 700,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(34,47,38,0.35)",
        }}>
          Lou suggests · {time.period}
        </p>
        <Link href="/lou" style={{
          fontFamily: SANS, fontSize: 11, fontWeight: 500,
          color: "#537062", textDecoration: "none", letterSpacing: "0.03em",
        }}>
          Ask Lou ↗
        </Link>
      </div>

      {/* Swipeable card */}
      <div style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        height: 248,
        boxShadow: "0 8px 32px rgba(34,47,38,0.18), 0 2px 8px rgba(34,47,38,0.10)",
      }}>
        {/* Background image — updates with active slide */}
        {!imgError && cards[activeIndex]?.product.imageUrl ? (
          <Image
            key={activeIndex}
            src={cards[activeIndex].product.imageUrl}
            alt={cards[activeIndex].product.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #537062, #222f26)" }} />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(20,28,22,0.95) 0%, rgba(20,28,22,0.50) 50%, rgba(20,28,22,0.15) 100%)",
        }} />

        {/* Swipeable text content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            position: "absolute", inset: 0,
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {cards.map(({ product, reason }) => (
            <div key={product.id} style={{
              width: "100%", flexShrink: 0,
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 20px 16px",
            }}>
              <p style={{
                fontFamily: SANS, fontSize: 9, fontWeight: 600,
                letterSpacing: "0.20em", textTransform: "uppercase",
                color: "rgba(201,217,201,0.70)", marginBottom: 5,
              }}>
                {product.type} · {product.origin}
              </p>
              <h2 style={{
                fontFamily: SERIF,
                fontSize: 26, fontWeight: 400,
                letterSpacing: "0.04em", lineHeight: 1.15,
                color: "#ffffff", margin: 0,
              }}>
                {product.name}
              </h2>
              <p style={{
                fontFamily: SANS, fontSize: 12, fontWeight: 300,
                color: "rgba(247,247,243,0.55)", lineHeight: 1.55,
                marginTop: 6, letterSpacing: "0.01em",
              }}>
                {reason}
              </p>

              {/* Bottom row: Shop Now + dots */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginTop: 14,
              }}>
                <Link href="/marketplace" style={{
                  display: "inline-block",
                  padding: "9px 22px",
                  borderRadius: 99,
                  background: "#ffffff",
                  fontFamily: SANS, fontSize: 11,
                  fontWeight: 700, letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "#1a2019", textDecoration: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.20)",
                }}>
                  Shop now
                </Link>

                {/* Dots */}
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  {cards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { scrollTo(i); setImgError(false); }}
                      style={{
                        width: i === activeIndex ? 18 : 5, height: 5,
                        borderRadius: 99, border: "none", cursor: "pointer",
                        padding: 0,
                        background: i === activeIndex
                          ? "rgba(255,255,255,0.90)"
                          : "rgba(255,255,255,0.30)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Mood badge ───────────────────────────────────────────────────────────── */
function MoodBadge({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: SANS, fontSize: 9, fontWeight: 600,
      letterSpacing: "0.10em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 99,
      background: "rgba(83,112,98,0.10)",
      color: "#537062",
    }}>
      {label}
    </span>
  );
}

/* ── Ritual entry card ────────────────────────────────────────────────────── */
function RitualCard({
  tea, date, temp, steepTime, notes, mood, index,
}: {
  tea: string; date: string; temp: string; steepTime: string;
  notes: string; mood: string; index: number;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "16px 18px",
        border: "1px solid rgba(34,47,38,0.07)",
        boxShadow: [
          "inset 0 0.5px 0 rgba(255,255,255,0.90)",
          "0 2px 12px rgba(34,47,38,0.07)",
        ].join(", "),
        cursor: "pointer",
        transition: "opacity 0.2s ease",
        /* Staggered entry feel */
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <p style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: "#222f26" }}>{tea}</p>
            <MoodBadge label={mood} />
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: SANS, fontSize: 11,
            color: "rgba(83,112,98,0.65)",
          }}>
            {/* Temperature icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
            </svg>
            <span>{temp}</span>
            <span style={{ color: "rgba(34,47,38,0.18)" }}>·</span>
            {/* Timer icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{steepTime}</span>
          </div>
        </div>
        <span style={{ fontFamily: SANS, fontSize: 10, color: "rgba(34,47,38,0.28)", flexShrink: 0, marginLeft: 8 }}>
          {date}
        </span>
      </div>

      {/* Thin sage divider */}
      <div style={{ height: 1, background: "rgba(83,112,98,0.08)", margin: "0 0 10px" }} />

      {/* Notes */}
      <p style={{
        fontFamily: SANS, fontSize: 13, fontWeight: 300,
        color: "rgba(34,47,38,0.60)", lineHeight: 1.65,
        letterSpacing: "0.01em",
      }}>
        {notes}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Rituals page
   ══════════════════════════════════════════════════════════════════════════════ */
export default function RitualsPage() {
  const { t } = useLocale();
  const [showForm, setShowForm] = useState(false);

  const rituals = [
    {
      tea: "Da Hong Pao",
      date: `${t.dashboard.today}, 10:30`,
      temp: "95°C",
      steepTime: "45s",
      notes: "Roasted chestnut, lingering sweetness. A grounding start to the day — five infusions, each one deepening.",
      mood: t.rituals.focused,
    },
    {
      tea: "Jasmin Snow Buds",
      date: `${t.dashboard.yesterday}, 16:00`,
      temp: "80°C",
      steepTime: "2 min",
      notes: "Floral, clean, meditative. The jasmine opened beautifully in the second steep. Pure clarity.",
      mood: t.rituals.calm,
    },
    {
      tea: "Da Hong Pao",
      date: "2 Apr, 09:15",
      temp: "95°C",
      steepTime: "40s",
      notes: "Rich mineral body, calm focus. The rock terroir comes through strongly in early morning.",
      mood: t.rituals.present,
    },
  ];

  return (
    /* Soft warm tearoom background — not a flat colour */
    <div style={{
      background: "linear-gradient(160deg, #f7f7f3 0%, #f0ece5 100%)",
      minHeight: "100%",
    }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{
            fontFamily: SERIF,
            fontSize: 28, fontWeight: 400,
            letterSpacing: "0.05em",
            color: "#222f26", margin: 0,
          }}>
            {t.rituals.title}
          </h1>
          <p style={{
            fontFamily: SANS, fontSize: 12, fontWeight: 300,
            color: "rgba(34,47,38,0.40)", marginTop: 3,
            letterSpacing: "0.02em",
          }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* Log ritual CTA */}
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 18px", borderRadius: 99,
            border: "none", cursor: "pointer",
            background: "#537062",
            fontFamily: SANS, fontSize: 12,
            fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#ffffff",
            boxShadow: [
              "inset 0 0.5px 0 rgba(255,255,255,0.18)",
              "0 4px 14px rgba(83,112,98,0.35)",
            ].join(", "),
            transition: "opacity 0.2s ease",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t.rituals.log}
        </button>
      </header>

      {/* ── Tea recommendation carousel ──────────────────────────────── */}
      <TeaCarousel />

      {/* ── Ritual log section ───────────────────────────────────────── */}
      <div>
        {/* Section header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Tiny teacup icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(83,112,98,0.60)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a4 4 0 110 8h-1" />
              <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
            <p style={{
              fontFamily: SANS, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "rgba(34,47,38,0.35)",
            }}>
              Your rituals
            </p>
          </div>
          <p style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 400,
            color: "rgba(83,112,98,0.55)",
          }}>
            {rituals.length} sessions
          </p>
        </div>

        {/* Ritual cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rituals.map((ritual, i) => (
            <RitualCard key={i} index={i} {...ritual} />
          ))}
        </div>

        {/* Empty-state hint (hidden when rituals exist) */}
        {rituals.length === 0 && (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: "#ffffff", borderRadius: 20,
            border: "1px solid rgba(34,47,38,0.07)",
          }}>
            <p style={{ fontFamily: SERIF, fontSize: 20, color: "#537062", marginBottom: 8 }}>
              Begin your first ritual
            </p>
            <p style={{
              fontFamily: SANS, fontSize: 13, fontWeight: 300,
              color: "rgba(34,47,38,0.45)", lineHeight: 1.65, marginBottom: 20,
            }}>
              Each session is a moment of presence. Record the tea, the temperature, the feeling.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "12px 28px", borderRadius: 99,
                border: "none", cursor: "pointer",
                background: "#537062",
                fontFamily: SANS, fontSize: 12, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              Log a ritual
            </button>
          </div>
        )}

        {/* Bottom spacer */}
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
