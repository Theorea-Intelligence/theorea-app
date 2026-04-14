"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTeaContext } from "@/lib/context/useTeaContext";
import { ALL_PRODUCTS, type TeaProduct } from "@/lib/data/products";

/* ── Font constants — hardcoded, no CSS var() needed ─────────────────────── */
const SERIF = '"Playfair Display Variable", "Georgia", serif';
const SANS  = '"Nunito Sans Variable", "Helvetica Neue", system-ui, sans-serif';

/* ── Weather icon ─────────────────────────────────────────────────────────── */
function WeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  const s = 13;
  if (code === 0) {
    return isDay ? (
      <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    );
  }
  if (code >= 51 && code <= 82)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" /><line x1="12" y1="15" x2="12" y2="23" />
        <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
      </svg>
    );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

/* ── Individual tea slide inside the swipeable card ─────────────────────── */
function TeaSlide({ product, reason }: { product: TeaProduct; reason: string }) {
  return (
    <div style={{
      width: "100%",
      flexShrink: 0,
      scrollSnapAlign: "start",
      padding: "0 24px",
    }}>
      {/* Tea type label */}
      <p style={{
        fontFamily: SANS,
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(147,163,141,0.75)",
        marginBottom: 8,
      }}>
        {product.type} · {product.origin}
      </p>

      {/* Tea name */}
      <h2 style={{
        fontFamily: SERIF,
        fontSize: 30,
        fontWeight: 400,
        letterSpacing: "0.04em",
        lineHeight: 1.1,
        color: "#ffffff",
        margin: 0,
      }}>
        {product.name}
      </h2>

      {/* Reason */}
      <p style={{
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 300,
        color: "rgba(247,247,243,0.55)",
        lineHeight: 1.65,
        marginTop: 10,
        letterSpacing: "0.01em",
      }}>
        {reason}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Dashboard — full-bleed single screen. No navbar, no below-fold content.
   position:fixed so the hero image bleeds behind the iOS status bar.
   ══════════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { time, weather, recommendation, isLoading, locationName } = useTeaContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const primaryProduct =
    ALL_PRODUCTS.find((p) => p.name.toLowerCase() === recommendation.tea.toLowerCase()) ??
    ALL_PRODUCTS[0];
  const others = ALL_PRODUCTS.filter((p) => p.id !== primaryProduct.id).slice(0, 2);

  const cards = [
    {
      product: primaryProduct,
      reason: recommendation.reason,
    },
    {
      product: others[0],
      reason:
        "A floral, meditative choice — jasmine unfolds slowly in warm water, each infusion lighter than the last.",
    },
    {
      product: others[1],
      reason:
        "Layered complexity born from patience. A journey through terroir, time, and quiet depth.",
    },
  ];

  /* Track active dot as user swipes */
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    if (w === 0) return;
    const idx = Math.min(
      Math.round(scrollRef.current.scrollLeft / w),
      cards.length - 1
    );
    setActiveIndex(idx);
  };

  /* Tap a dot → scroll to that slide */
  const scrollToSlide = (i: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: "smooth" });
    setActiveIndex(i);
  };

  /* Background image cycles with the active slide */
  const bgImage = cards[activeIndex]?.product.imageUrl;

  return (
    /*
     * position:fixed + inset:0 → covers the full viewport including the iOS
     * status bar area. The greeting overlay uses env(safe-area-inset-top) to
     * push its text below the clock/wifi/battery icons.
     */
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#1a2019",
      overflow: "hidden",
    }}>

      {/* ── Background tea image ──────────────────────────────────────── */}
      {!imgError && bgImage ? (
        <Image
          key={activeIndex}
          src={bgImage}
          alt={cards[activeIndex].product.name}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(145deg, #2f2d29 0%, #1a2019 100%)",
        }} />
      )}

      {/* ── Top gradient — text legibility ───────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(16,24,18,0.80) 0%, rgba(16,24,18,0.25) 35%, transparent 55%)",
      }} />

      {/* ── Bottom gradient — card emergence ─────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(12,18,13,1.0) 0%, rgba(12,18,13,0.88) 24%, rgba(12,18,13,0.40) 44%, transparent 62%)",
      }} />

      {/* ══════════════════════════════════════════════════════════════════
          GREETING — top, respects safe-area-inset-top for notch/island
          ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        /* Push text below the status bar (clock, wifi, battery) */
        paddingTop: "max(28px, calc(env(safe-area-inset-top) + 10px))",
        paddingLeft: 24,
        paddingRight: 24,
      }}>

        {/* Weather row */}
        {!isLoading && weather && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 14,
            color: "rgba(247,247,243,0.48)",
            fontFamily: SANS,
            fontSize: 12,
            letterSpacing: "0.04em",
            fontWeight: 400,
          }}>
            <WeatherIcon code={weather.weatherCode} isDay={weather.isDay} />
            <span>
              {Math.round(weather.temperature)}°
              {weather.description ? ` · ${weather.description}` : ""}
              {locationName ? ` · ${locationName}` : ""}
            </span>
          </div>
        )}

        {/* Greeting */}
        <h1 style={{
          fontFamily: SERIF,
          fontSize: "clamp(34px, 9vw, 52px)",
          fontWeight: 400,
          letterSpacing: "0.04em",
          lineHeight: 1.08,
          color: "#ffffff",
          margin: 0,
        }}>
          {time.greeting}
        </h1>

        {/* Date */}
        <p style={{
          fontFamily: SANS,
          fontSize: 12,
          letterSpacing: "0.05em",
          color: "rgba(247,247,243,0.36)",
          marginTop: 7,
          fontWeight: 300,
        }}>
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long",
          })}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          BOTTOM GLASS CARD — swipeable tea suggestions
          ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(12, 18, 13, 0.84)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderRadius: "24px 24px 0 0",
        borderTop: "0.5px solid rgba(255,255,255,0.10)",
        boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.10)",
        /* Respect home-indicator on modern iPhones */
        paddingBottom: "max(28px, env(safe-area-inset-bottom))",
      }}>

        {/* Section label */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px 14px",
        }}>
          <p style={{
            fontFamily: SANS,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(147,163,141,0.70)",
          }}>
            Lou suggests · {time.period}
          </p>
          <Link href="/lou" style={{
            fontFamily: SANS,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "rgba(147,163,141,0.55)",
            textDecoration: "none",
          }}>
            Ask Lou ↗
          </Link>
        </div>

        {/* ── Swipeable slides ─────────────────────────────────────── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            /* Hide scrollbar */
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            /* Negative horizontal padding trick so slides reach the edges */
            gap: 0,
          }}
        >
          {cards.map(({ product, reason }) => (
            <TeaSlide key={product.id} product={product} reason={reason} />
          ))}
        </div>

        {/* ── Dot indicators ───────────────────────────────────────── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "14px 24px 0",
        }}>
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              style={{
                width: i === activeIndex ? 20 : 5,
                height: 5,
                borderRadius: 99,
                border: "none",
                cursor: "pointer",
                padding: 0,
                background: i === activeIndex
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.20)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* ── CTA → Ritual ─────────────────────────────────────────── */}
        <div style={{ padding: "14px 24px 0" }}>
          <Link
            href="/rituals"
            style={{
              display: "block",
              padding: "14px 0",
              borderRadius: 99,
              background: "#ffffff",
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "#1a2019",
              textAlign: "center",
              textDecoration: "none",
              boxShadow: [
                "inset 0 0.5px 0 rgba(255,255,255,1)",
                "0 4px 20px rgba(0,0,0,0.30)",
              ].join(", "),
            }}
          >
            Begin your ritual
          </Link>
        </div>

      </div>
    </div>
  );
}
