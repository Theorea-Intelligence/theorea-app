"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTeaContext } from "@/lib/context/useTeaContext";
import { useLocale } from "@/i18n/LocaleContext";
import { ALL_PRODUCTS, type TeaProduct } from "@/lib/data/products";

/** Compact weather icon */
function WeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  const size = 14;
  if (code === 0) {
    return isDay ? (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    );
  }
  if (code >= 51 && code <= 82)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" />
        <line x1="12" y1="15" x2="12" y2="23" />
        <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
      </svg>
    );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

// ── Lou suggestion card ───────────────────────────────────────────────────────

function LouSuggestionCard({
  product,
  reason,
  isActive,
}: {
  product: TeaProduct;
  reason: string;
  isActive: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href="/marketplace"
      className="shrink-0 w-full rounded-[22px] overflow-hidden bg-ink shadow-[0_6px_28px_rgba(0,0,0,0.14)] active:scale-[0.98] transition-all duration-300 block"
    >
      {/* Photo */}
      <div className="relative w-full h-[220px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-br from-ink-light to-ink" />
        )}

        {/* Dark gradient overlay for text on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

        {/* Tea type + name overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <p className="text-[10px] tracking-[0.12em] uppercase text-porcelain/60 font-medium mb-1">
            {product.type}
          </p>
          <h3 className="font-serif text-[26px] font-light text-porcelain leading-tight">
            {product.name}
          </h3>
          <p className="text-[13px] text-porcelain/60 mt-0.5">{product.origin}</p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-5 pt-4 pb-5">
        <p className="text-[13px] text-porcelain/60 leading-relaxed mb-4">
          {reason}
        </p>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-jade/80 active:bg-jade transition-colors">
            <span className="text-[13px] font-medium text-porcelain">View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-porcelain">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <span className="text-[14px] font-medium text-porcelain/40">{product.price}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Carousel with dots ────────────────────────────────────────────────────────

function LouCarousel({
  cards,
  isLoading,
  greeting,
}: {
  cards: { product: TeaProduct; reason: string }[];
  isLoading: boolean;
  greeting: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: index * scrollRef.current.offsetWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <div className="space-y-3 animate-fade-in-up animation-delay-100">
      {/* Section label */}
      <p className="font-serif text-[14px] italic font-light text-ink-muted px-0.5">
        {greeting}
      </p>

      {isLoading ? (
        /* Skeleton */
        <div className="w-full rounded-[22px] overflow-hidden bg-porcelain shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="h-[220px] bg-steam animate-pulse" />
          <div className="px-5 py-4 space-y-2">
            <div className="h-3 w-1/3 rounded bg-steam animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-steam animate-pulse" />
            <div className="h-9 w-32 mt-3 rounded-full bg-steam animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-3 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map(({ product, reason }, i) => (
              <div key={product.id} className="snap-center shrink-0 w-full">
                <LouSuggestionCard
                  product={product}
                  reason={reason}
                  isActive={i === activeIndex}
                />
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          {cards.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-0.5">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeIndex
                      ? "w-5 h-1.5 bg-jade"
                      : "w-1.5 h-1.5 bg-ink-muted/25"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { time, weather, recommendation, isLoading, locationName } =
    useTeaContext();
  const { t } = useLocale();

  // Map the primary recommendation to a product; fall back to first product
  const primaryProduct =
    ALL_PRODUCTS.find(
      (p) => p.name.toLowerCase() === recommendation.tea.toLowerCase()
    ) ?? ALL_PRODUCTS[0];

  // The other two products for the carousel (cycle through catalogue)
  const others = ALL_PRODUCTS.filter((p) => p.id !== primaryProduct.id).slice(0, 2);

  const carouselCards = [
    { product: primaryProduct, reason: recommendation.reason },
    {
      product: others[0],
      reason: "A floral, meditative choice for moments of quiet intention.",
    },
    {
      product: others[1],
      reason: "Layered complexity — a journey through terroir and time.",
    },
  ];

  // Greeting label above the carousel
  const carouselLabel = `Lou's choice for ${time.period ?? "today"}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="animate-fade-in-up">
        <h1 className="font-serif text-[22px] font-light text-ink leading-tight">
          {time.greeting}
        </h1>
        {!isLoading && weather && (
          <div className="flex items-center gap-1.5 mt-1 text-[12px] text-ink-muted">
            <WeatherIcon code={weather.weatherCode} isDay={weather.isDay} />
            <span>
              {Math.round(weather.temperature)}&deg; &middot;{" "}
              {weather.description}
            </span>
            {locationName && <span>&middot; {locationName}</span>}
          </div>
        )}
      </header>

      {/* ── Lou suggestion carousel ─────────────────────────────────────── */}
      <LouCarousel
        cards={carouselCards}
        isLoading={isLoading}
        greeting={carouselLabel}
      />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animation-delay-200">
        <Link href="/rituals" className="group">
          <div className="flex flex-col items-start gap-2 rounded-2xl bg-porcelain p-4 active:scale-[0.97] transition-transform duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-jade/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-jade">
                <path d="M17 8h1a4 4 0 110 8h-1" />
                <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-ink">{t.dashboard.logRitual}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">{t.dashboard.recordSession}</p>
            </div>
          </div>
        </Link>

        <Link href="/lou" className="group">
          <div className="flex flex-col items-start gap-2 rounded-2xl bg-porcelain p-4 active:scale-[0.97] transition-transform duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-oolong/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-oolong">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-ink">{t.dashboard.louSuggests}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">{t.dashboard.startSession}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent rituals */}
      <section className="rounded-2xl bg-porcelain p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-300">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-ink">{t.dashboard.recent}</h2>
          <Link href="/rituals" className="text-[12px] text-oolong-dark font-medium">
            {t.dashboard.seeAll}
          </Link>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {[
            { tea: "Da Hong Pao", time: `${t.dashboard.today}, 10:30`, mood: t.dashboard.focused, note: "Roasted chestnut, lingering sweetness" },
            { tea: "Jasmin Snow Buds", time: `${t.dashboard.yesterday}, 16:00`, mood: t.dashboard.calm, note: "Floral, clean, meditative" },
            { tea: "Da Hong Pao", time: "2 Apr, 09:15", mood: t.dashboard.present, note: "Rich mineral body" },
          ].map((ritual, i) => (
            <div key={i} className="flex items-center py-3 first:pt-0 last:pb-0 active:bg-parchment -mx-1 px-1 rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-ink">{ritual.tea}</p>
                  <span className="text-[10px] px-1.5 py-[1px] rounded-full bg-jade/8 text-jade-dark font-medium">
                    {ritual.mood}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted mt-0.5 truncate">{ritual.note}</p>
              </div>
              <span className="text-[11px] text-ink-muted/50 ml-3 shrink-0">{ritual.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace peek */}
      <section className="rounded-2xl bg-porcelain p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-fade-in-up animation-delay-400">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-ink">{t.dashboard.marketplace}</h2>
          <Link href="/marketplace" className="text-[12px] text-oolong-dark font-medium">
            {t.dashboard.browse}
          </Link>
        </div>
        <div className="divide-y divide-black/[0.04]">
          {[
            { tea: "Da Hong Pao", type: t.marketplace.oolong, price: "£28", origin: "Wuyi, Fujian" },
            { tea: "Jasmin Snow Buds", type: t.marketplace.greenTeaScented, price: "£24", origin: "Fuding, Fujian" },
          ].map((tea, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 active:bg-parchment -mx-1 px-1 rounded-lg transition-colors">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink">{tea.tea}</p>
                <p className="text-[11px] text-ink-muted mt-0.5">{tea.type} &middot; {tea.origin}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <span className="text-[13px] font-medium text-ink">{tea.price}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted/40">
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
