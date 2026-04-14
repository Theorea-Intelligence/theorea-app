"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTeaContext } from "@/lib/context/useTeaContext";
import { useLocale } from "@/i18n/LocaleContext";
import { ALL_PRODUCTS, type TeaProduct } from "@/lib/data/products";

/* ── Font constants — hardcoded to bypass any CSS variable resolution issues ─ */
const SERIF = '"Playfair Display Variable", "Georgia", serif';
const SANS  = '"Nunito Sans Variable", "Helvetica Neue", system-ui, sans-serif';

/* ── Weather icon ─────────────────────────────────────────────────────────── */
function WeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  const s = 14;
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

/* ── Quick action tile ────────────────────────────────────────────────────── */
function ActionTile({ href, icon, label, sub, accentColor }: {
  href: string; icon: React.ReactNode; label: string; sub: string; accentColor: string;
}) {
  return (
    <Link href={href}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
        padding: 16,
        borderRadius: 16,
        background: "#ffffff",
        border: "1px solid rgba(34,47,38,0.08)",
        boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(34,47,38,0.06)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: 36, width: 36, borderRadius: 10,
          background: `${accentColor}18`,
        }}>
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        <div>
          <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: "#222f26" }}>{label}</p>
          <p style={{ fontFamily: SANS, fontSize: 11, color: "rgba(34,47,38,0.35)", marginTop: 2 }}>{sub}</p>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Dashboard — image-first hero with greeting + tea suggestion card
   ══════════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { time, weather, recommendation, isLoading, locationName } = useTeaContext();
  const { t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const primaryProduct =
    ALL_PRODUCTS.find((p) => p.name.toLowerCase() === recommendation.tea.toLowerCase()) ??
    ALL_PRODUCTS[0];
  const others = ALL_PRODUCTS.filter((p) => p.id !== primaryProduct.id).slice(0, 2);

  const cards = [
    { product: primaryProduct, reason: recommendation.reason },
    {
      product: others[0],
      reason: "A floral, meditative choice — jasmine unfolds slowly in warm water, each infusion lighter than the last.",
    },
    {
      product: others[1],
      reason: "Layered complexity born from patience. A journey through terroir, time, and quiet depth.",
    },
  ];

  const active = cards[activeIndex];

  return (
    /* Full-bleed — no container padding, the layout's pb-[88px] handles nav space */
    <div>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — full viewport height, tea photo background
          ══════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        height: "calc(100svh - 88px)",
        minHeight: 560,
        overflow: "hidden",
        background: "#222f26",
      }}>

        {/* ── Background image ─────────────────────────────────────── */}
        {!imgError && active.product.imageUrl ? (
          <Image
            key={active.product.id}
            src={active.product.imageUrl}
            alt={active.product.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #2f2d29 0%, #222f26 100%)",
          }} />
        )}

        {/* ── Top gradient — legible text over image ───────────────── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(22,32,26,0.78) 0%, rgba(22,32,26,0.30) 38%, transparent 58%)",
          pointerEvents: "none",
        }} />

        {/* ── Bottom gradient — card emergence ─────────────────────── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(18,26,21,1.0) 0%, rgba(18,26,21,0.85) 22%, rgba(18,26,21,0.40) 42%, transparent 62%)",
          pointerEvents: "none",
        }} />

        {/* ══════════════════════════════════════════════════════════════
            GREETING — top-left overlay
            ══════════════════════════════════════════════════════════════ */}
        <div style={{
          position: "absolute",
          top: 28,
          left: 24,
          right: 24,
        }}>
          {/* Weather row */}
          {!isLoading && weather && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 14,
              color: "rgba(247,247,243,0.52)",
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

          {/* Main greeting */}
          <h1 style={{
            fontFamily: SERIF,
            fontSize: "clamp(36px, 9vw, 54px)",
            fontWeight: 400,
            letterSpacing: "0.04em",
            lineHeight: 1.08,
            color: "#ffffff",
            margin: 0,
          }}>
            {time.greeting}
          </h1>

          {/* Date subline */}
          <p style={{
            fontFamily: SANS,
            fontSize: 12,
            letterSpacing: "0.05em",
            color: "rgba(247,247,243,0.40)",
            marginTop: 8,
            fontWeight: 300,
          }}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            BOTTOM GLASS CARD — tea suggestion
            ══════════════════════════════════════════════════════════════ */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(18, 26, 21, 0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px 24px 0 0",
          borderTop: "0.5px solid rgba(255,255,255,0.10)",
          padding: "22px 24px 32px",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.10)",
        }}>

          {/* Label row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{
              fontFamily: SANS,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: "rgba(147,163,141,0.80)",
            }}>
              Lou suggests · {time.period}
            </p>
            <p style={{
              fontFamily: SANS,
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(247,247,243,0.28)",
            }}>
              {active.product.type}
            </p>
          </div>

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
            {active.product.name}
          </h2>

          {/* Origin */}
          <p style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.08em",
            color: "rgba(147,163,141,0.70)",
            marginTop: 4,
            fontWeight: 400,
          }}>
            {active.product.origin}
          </p>

          {/* Reason */}
          <p style={{
            fontFamily: SANS,
            fontSize: 13,
            fontWeight: 300,
            color: "rgba(247,247,243,0.58)",
            lineHeight: 1.60,
            marginTop: 10,
            letterSpacing: "0.01em",
          }}>
            {active.reason}
          </p>

          {/* Dot indicators */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 18,
          }}>
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); setImgError(false); }}
                style={{
                  width: i === activeIndex ? 20 : 5,
                  height: 5,
                  borderRadius: 99,
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  background: i === activeIndex
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.22)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/marketplace"
            style={{
              display: "block",
              marginTop: 18,
              padding: "13px 0",
              borderRadius: 99,
              background: "#ffffff",
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#222f26",
              textAlign: "center",
              textDecoration: "none",
              boxShadow: "inset 0 0.5px 0 rgba(255,255,255,1), 0 4px 16px rgba(0,0,0,0.20)",
              transition: "opacity 0.2s ease",
            }}
          >
            Begin your ritual
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BELOW HERO — quick actions + rituals + marketplace
          ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "#f7f7f3",
        padding: "24px 20px 16px",
      }}>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <ActionTile
            href="/rituals"
            label={t.dashboard.logRitual}
            sub={t.dashboard.recordSession}
            accentColor="#537062"
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

        {/* Recent rituals */}
        <section style={{
          borderRadius: 16,
          background: "#ffffff",
          border: "1px solid rgba(34,47,38,0.08)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(34,47,38,0.06)",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
            <p style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(34,47,38,0.30)" }}>
              {t.dashboard.recent}
            </p>
            <Link href="/rituals">
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: "#537062" }}>{t.dashboard.seeAll}</span>
            </Link>
          </div>
          {[
            { tea: "Da Hong Pao",      time: `${t.dashboard.today}, 10:30`,     mood: t.dashboard.focused, note: "Roasted chestnut, lingering sweetness" },
            { tea: "Jasmin Snow Buds", time: `${t.dashboard.yesterday}, 16:00`, mood: t.dashboard.calm,    note: "Floral, clean, meditative" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              padding: "10px 16px",
              borderTop: i > 0 ? "1px solid rgba(34,47,38,0.05)" : undefined,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: "#222f26" }}>{r.tea}</p>
                  <span style={{
                    fontFamily: SANS, fontSize: 9, fontWeight: 600,
                    padding: "2px 7px", borderRadius: 99,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "rgba(83,112,98,0.10)", color: "#537062",
                  }}>{r.mood}</span>
                </div>
                <p style={{ fontFamily: SANS, fontSize: 11, color: "rgba(34,47,38,0.30)", marginTop: 2 }}>{r.note}</p>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 10, color: "rgba(34,47,38,0.20)", marginLeft: 12, flexShrink: 0 }}>{r.time}</span>
            </div>
          ))}
        </section>

        {/* Marketplace peek */}
        <section style={{
          borderRadius: 16,
          background: "#ffffff",
          border: "1px solid rgba(34,47,38,0.08)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(34,47,38,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
            <p style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(34,47,38,0.30)" }}>
              {t.dashboard.marketplace}
            </p>
            <Link href="/marketplace">
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: "#537062" }}>{t.dashboard.browse}</span>
            </Link>
          </div>
          {[
            { tea: "Da Hong Pao",      type: t.marketplace.oolong,          origin: "Wuyi, Fujian",  price: "£28" },
            { tea: "Jasmin Snow Buds", type: t.marketplace.greenTeaScented, origin: "Fuding, Fujian", price: "£24" },
          ].map((tea, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 16px",
              borderTop: i > 0 ? "1px solid rgba(34,47,38,0.05)" : undefined,
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: "#222f26" }}>{tea.tea}</p>
                <p style={{ fontFamily: SANS, fontSize: 11, color: "rgba(34,47,38,0.30)", marginTop: 2 }}>
                  {tea.type} · {tea.origin}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12, flexShrink: 0 }}>
                <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: "#222f26" }}>{tea.price}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(34,47,38,0.20)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
