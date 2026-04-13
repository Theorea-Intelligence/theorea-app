"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTeaContext } from "@/lib/context/useTeaContext";
import { useLocale } from "@/i18n/LocaleContext";
import { ALL_PRODUCTS, type TeaProduct } from "@/lib/data/products";

/* ── Weather icon ────────────────────────────────────────────────────────── */
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

/* ── Suggestion card — full-width, single snap card ─────────────────────── */
function SuggestionCard({ product, reason }: { product: TeaProduct; reason: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href="/marketplace"
      className="block active:opacity-90 transition-opacity duration-200"
      style={{
        /* Full width of the scroll container — one card at a time */
        width: "100%",
        flexShrink: 0,
        scrollSnapAlign: "start",
      }}
    >
      {/* Photo — taller, more editorial */}
      <div className="relative w-full overflow-hidden" style={{ height: 220, borderRadius: 14 }}>
        {!imgError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f5f5f1, #f7f7f3)" }} />
        )}
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(34,47,38,0.90) 0%, rgba(34,47,38,0.10) 55%, transparent 100%)" }}
        />
        {/* Labels on photo */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 9,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: "rgba(247,247,243,0.65)",
              marginBottom: 5,
            }}
          >
            {product.type}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "0.04em",
              lineHeight: 1.15,
              color: "#ffffff",
            }}
          >
            {product.name}
          </h3>
        </div>
      </div>

      {/* Reason text below photo */}
      <div style={{ paddingTop: 12, paddingLeft: 2, paddingRight: 2 }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "#537062",
            lineHeight: 1.55,
            letterSpacing: "0.01em",
          }}
        >
          {reason}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            color: "rgba(34,47,38,0.28)",
            letterSpacing: "0.04em",
            marginTop: 5,
          }}
        >
          {product.origin}
        </p>
      </div>
    </Link>
  );
}

/* ── Carousel — full-width snap, one card at a time ─────────────────────── */
function LouCarousel({ cards, isLoading, label }: {
  cards: { product: TeaProduct; reason: string }[];
  isLoading: boolean;
  label: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    if (w === 0) return;
    setActiveIndex(Math.min(Math.round(scrollRef.current.scrollLeft / w), cards.length - 1));
  };

  const scrollTo = (i: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: "smooth" });
    setActiveIndex(i);
  };

  return (
    <div
      className="animate-fade-in-up animation-delay-100"
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "#ffffff",
        /* Rim light on the card surface */
        boxShadow: [
          "inset 0 0.5px 0 rgba(255,255,255,0.90)",
          "inset 0 -0.5px 0 rgba(34,47,38,0.04)",
          "0 4px 24px rgba(34,47,38,0.10)",
          "0 1px 4px rgba(34,47,38,0.06)",
        ].join(", "),
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 12px",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: "rgba(34,47,38,0.32)",
            }}
          >
            Lou suggests
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 15,
              letterSpacing: "0.03em",
              fontWeight: 400,
              color: "#222f26",
              marginTop: 3,
            }}
          >
            {label}
          </p>
        </div>
        {/* Dot indicators — bottom of header area */}
        {cards.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                style={{
                  width: i === activeIndex ? 18 : 5,
                  height: 5,
                  borderRadius: 99,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  background: i === activeIndex ? "#537062" : "rgba(83,112,98,0.20)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thin divider */}
      <div style={{ height: 1, background: "rgba(34,47,38,0.06)", margin: "0 16px" }} />

      {/* Snap scroll container — exactly one card wide, no peek */}
      <div style={{ padding: "16px" }}>
        {isLoading ? (
          <div className="animate-shimmer rounded-[14px]" style={{ height: 220 }} />
        ) : (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              gap: 0,
              /* Hide scrollbar */
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {cards.map(({ product, reason }) => (
              <SuggestionCard key={product.id} product={product} reason={reason} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Quick action tile ───────────────────────────────────────────────────── */
function ActionTile({
  href,
  icon,
  label,
  sub,
  accentColor,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  accentColor: string;
}) {
  return (
    <Link href={href}>
      <div
        className="flex flex-col items-start gap-3 p-4 rounded-[16px] active:opacity-80 transition-opacity duration-200"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(34,47,38,0.09)",
        }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: `${accentColor}18` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        <div>
          <p className="text-[13px] font-medium" style={{ color: "#222f26" }}>{label}</p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(34,47,38,0.35)" }}>{sub}</p>
        </div>
      </div>
    </Link>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { time, weather, recommendation, isLoading, locationName } = useTeaContext();
  const { t } = useLocale();

  const primaryProduct =
    ALL_PRODUCTS.find((p) => p.name.toLowerCase() === recommendation.tea.toLowerCase()) ??
    ALL_PRODUCTS[0];
  const others = ALL_PRODUCTS.filter((p) => p.id !== primaryProduct.id).slice(0, 2);

  const carouselCards = [
    { product: primaryProduct, reason: recommendation.reason },
    { product: others[0], reason: "A floral, meditative choice — jasmine unfolds slowly in warm water, each infusion lighter than the last." },
    { product: others[1], reason: "Layered complexity born from patience. A journey through terroir, time, and quiet depth." },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="animate-fade-in-up pt-1">
        <h1
          className="font-serif font-light leading-[1.1]"
          style={{
            fontSize: "clamp(30px, 8vw, 40px)",
            color: "#222f26",
            fontFamily: "var(--font-serif)",
            letterSpacing: "-0.01em",
          }}
        >
          {time.greeting}
        </h1>

        {!isLoading && weather && (
          <div
            className="flex items-center gap-1.5 mt-2 text-[11px] tracking-wide"
            style={{ color: "rgba(34,47,38,0.35)" }}
          >
            <WeatherIcon code={weather.weatherCode} isDay={weather.isDay} />
            <span>{Math.round(weather.temperature)}° · {weather.description}</span>
            {locationName && <span>· {locationName}</span>}
          </div>
        )}

        {/* Gold rule */}
        <div className="theorea-divider mt-4" />
      </header>

      {/* ── Lou carousel ───────────────────────────────────────────────── */}
      <LouCarousel
        cards={carouselCards}
        isLoading={isLoading}
        label={`Lou's choice for ${time.period}`}
      />

      {/* ── Quick actions ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animation-delay-200">
        <ActionTile
          href="/rituals"
          label={t.dashboard.logRitual}
          sub={t.dashboard.recordSession}
          accentColor="#6a9a7a"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a4 4 0 110 8h-1" /><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
            </svg>
          }
        />
        <ActionTile
          href="/lou"
          label={t.dashboard.louSuggests}
          sub={t.dashboard.startSession}
          accentColor="#222f26"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          }
        />
      </div>

      {/* ── Recent rituals ─────────────────────────────────────────────── */}
      <section
        className="rounded-[16px] animate-fade-in-up animation-delay-300"
        style={{ background: "#ffffff", border: "1px solid rgba(34,47,38,0.09)" }}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <p
            className="text-[10px] tracking-[0.1em] uppercase font-medium"
            style={{ color: "rgba(34,47,38,0.3)" }}
          >
            {t.dashboard.recent}
          </p>
          <Link href="/rituals">
            <span className="text-[11px] font-medium" style={{ color: "#222f26" }}>
              {t.dashboard.seeAll}
            </span>
          </Link>
        </div>

        <div>
          {[
            { tea: "Da Hong Pao",     time: `${t.dashboard.today}, 10:30`,     mood: t.dashboard.focused, note: "Roasted chestnut, lingering sweetness" },
            { tea: "Jasmin Snow Buds",time: `${t.dashboard.yesterday}, 16:00`, mood: t.dashboard.calm,    note: "Floral, clean, meditative" },
            { tea: "Da Hong Pao",     time: "2 Apr, 09:15",                    mood: t.dashboard.present, note: "Rich mineral body" },
          ].map((ritual, i) => (
            <div
              key={i}
              className="flex items-center px-4 py-3 active:opacity-70 transition-opacity"
              style={{
                borderTop: i > 0 ? "1px solid rgba(34,47,38,0.05)" : undefined,
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium" style={{ color: "#222f26" }}>
                    {ritual.tea}
                  </p>
                  <span
                    className="text-[9px] px-1.5 py-[2px] rounded-full font-medium tracking-wide uppercase"
                    style={{ background: "rgba(106,154,122,0.15)", color: "#6a9a7a" }}
                  >
                    {ritual.mood}
                  </span>
                </div>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(34,47,38,0.3)" }}>
                  {ritual.note}
                </p>
              </div>
              <span className="text-[10px] ml-3 shrink-0" style={{ color: "rgba(34,47,38,0.2)" }}>
                {ritual.time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Marketplace peek ───────────────────────────────────────────── */}
      <section
        className="rounded-[16px] animate-fade-in-up animation-delay-400"
        style={{ background: "#ffffff", border: "1px solid rgba(34,47,38,0.09)" }}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <p
            className="text-[10px] tracking-[0.1em] uppercase font-medium"
            style={{ color: "rgba(34,47,38,0.3)" }}
          >
            {t.dashboard.marketplace}
          </p>
          <Link href="/marketplace">
            <span className="text-[11px] font-medium" style={{ color: "#222f26" }}>
              {t.dashboard.browse}
            </span>
          </Link>
        </div>

        <div>
          {[
            { tea: "Da Hong Pao",     type: t.marketplace.oolong,         price: "£28", origin: "Wuyi, Fujian"  },
            { tea: "Jasmin Snow Buds",type: t.marketplace.greenTeaScented, price: "£24", origin: "Fuding, Fujian" },
          ].map((tea, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 active:opacity-70 transition-opacity"
              style={{ borderTop: i > 0 ? "1px solid rgba(34,47,38,0.05)" : undefined }}
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium" style={{ color: "#222f26" }}>{tea.tea}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(34,47,38,0.3)" }}>
                  {tea.type} · {tea.origin}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <span className="text-[13px] font-medium" style={{ color: "#222f26" }}>{tea.price}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(34,47,38,0.2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
