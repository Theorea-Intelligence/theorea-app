"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import {
  THEOREA_PRODUCTS,
  PARTNER_PRODUCTS,
  LONDON_TEA_VENUES,
  type TeaProduct,
  type TeaVenue,
} from "@/lib/data/products";

// ── Venue chip ────────────────────────────────────────────────────────────────

function VenueChip({ venue }: { venue: TeaVenue }) {
  return (
    <a
      href={`https://www.google.com/maps/search/${venue.mapsQuery}`}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 flex flex-col px-3.5 py-2.5 rounded-[14px] bg-porcelain shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-w-[140px] active:scale-[0.97] transition-transform duration-200"
    >
      <div className="flex items-center justify-between mb-0.5">
        <p className="text-[12px] font-medium text-ink leading-tight line-clamp-1">
          {venue.name}
        </p>
        {/* Star rating */}
        <span className="text-[10px] text-oolong ml-1 shrink-0">
          ★ {venue.rating}
        </span>
      </div>
      <p className="text-[10px] text-ink-muted">
        {venue.area} · {venue.distance}
      </p>
      <span className="mt-1.5 text-[9px] uppercase tracking-[0.07em] text-jade-dark font-medium">
        {venue.type}
      </span>
    </a>
  );
}

// ── Map section ───────────────────────────────────────────────────────────────

function MapSection() {
  return (
    <section className="space-y-3 animate-fade-in-up animation-delay-100">
      {/* Section header */}
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h2 className="font-serif text-[17px] font-light text-ink">
            Near You
          </h2>
          <p className="text-[11px] text-ink-muted mt-0.5">
            Tea rooms and specialist shops
          </p>
        </div>
        <a
          href="https://www.google.com/maps/search/tea+rooms+near+me"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-oolong font-medium tracking-wide active:opacity-60"
        >
          Open Maps →
        </a>
      </div>

      {/* Google Maps embed */}
      <div className="relative w-full rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <iframe
          title="Tea rooms near you"
          src="https://maps.google.com/maps?q=tea+rooms+London&output=embed&z=13"
          className="w-full"
          style={{ height: 200, border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Fine overlay border */}
        <div className="absolute inset-0 rounded-[20px] ring-1 ring-black/[0.06] pointer-events-none" />
      </div>

      {/* Venue chips */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LONDON_TEA_VENUES.map((venue) => (
          <VenueChip key={venue.name} venue={venue} />
        ))}
      </div>
    </section>
  );
}

// ── Product card (full-width with photo) ──────────────────────────────────────

function ProductCard({
  tea,
  onAdd,
}: {
  tea: TeaProduct;
  onAdd: (tea: TeaProduct) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="rounded-[20px] bg-porcelain shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden active:scale-[0.99] transition-transform duration-200">
      {/* Product photo */}
      <div className="relative w-full h-[180px] bg-steam overflow-hidden">
        {!imgError ? (
          <Image
            src={tea.imageUrl}
            alt={tea.name}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback gradient when image fails */
          <div className="absolute inset-0 bg-gradient-to-br from-steam to-parchment-warm flex items-center justify-center">
            <span className="text-ink-muted/30 text-[40px]">🍃</span>
          </div>
        )}

        {/* Bottom gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {tea.brandTag === "theorea" && (
            <span className="text-[9px] tracking-[0.08em] uppercase font-medium text-oolong-light bg-ink/70 backdrop-blur-sm px-2 py-1 rounded-full">
              Théorea
            </span>
          )}
          {!tea.available && (
            <span className="text-[9px] tracking-[0.07em] uppercase text-porcelain/80 bg-ink/60 backdrop-blur-sm px-2 py-1 rounded-full">
              Coming soon
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3.5 pb-4">
        {/* Brand */}
        <p className="text-[10px] tracking-[0.08em] uppercase text-ink-muted font-medium mb-0.5">
          {tea.brand}
        </p>

        {/* Name + type */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-serif text-[16px] font-light text-ink leading-tight">
              {tea.name}
            </h3>
            <p className="text-[11px] text-ink-muted mt-0.5">
              {tea.type} · {tea.origin}
            </p>
          </div>
        </div>

        {/* Flavour profile */}
        <p className="text-[13px] text-ink-light mt-2 leading-relaxed">
          {tea.profile}
        </p>

        {/* Price row + CTA */}
        <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-black/[0.05]">
          <div>
            <span className="text-[16px] font-medium text-ink">{tea.price}</span>
            <span className="text-[11px] text-ink-muted ml-1.5">{tea.weight}</span>
          </div>

          {tea.available ? (
            <button
              onClick={() => onAdd(tea)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink text-porcelain text-[12px] font-medium active:scale-[0.95] transition-all duration-200"
            >
              <span>Add to Bag</span>
            </button>
          ) : (
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-steam text-ink-muted text-[12px] font-medium active:scale-[0.95] transition-all duration-200">
              Notify me
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Filter pill ───────────────────────────────────────────────────────────────

const FILTERS = ["All", "Oolong", "Green", "White", "Pu-erh"] as const;
type Filter = (typeof FILTERS)[number];

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 active:scale-[0.96] ${
        active
          ? "bg-ink text-porcelain shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          : "bg-porcelain text-ink-muted shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      }`}
    >
      {label}
    </button>
  );
}

// ── Bag toast ─────────────────────────────────────────────────────────────────

function BagToast({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-ink text-porcelain rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] animate-fade-in-up">
      <span className="text-[13px] font-light">
        <span className="font-medium">{name}</span> added to your bag
      </span>
      <button
        onClick={onClose}
        className="text-porcelain/50 text-[16px] leading-none active:text-porcelain transition-colors"
      >
        ×
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const { t } = useLocale();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [bagToast, setBagToast] = useState<string | null>(null);

  const handleAdd = (tea: TeaProduct) => {
    setBagToast(tea.name);
    setTimeout(() => setBagToast(null), 3000);
  };

  // Filter logic
  const filterTea = (tea: TeaProduct): boolean => {
    if (activeFilter === "All") return true;
    const type = tea.type.toLowerCase();
    if (activeFilter === "Oolong") return type.includes("oolong");
    if (activeFilter === "Green") return type.includes("green");
    if (activeFilter === "White") return type.includes("white");
    if (activeFilter === "Pu-erh") return type.includes("pu-erh") || type.includes("puerh");
    return true;
  };

  const availableTeas = THEOREA_PRODUCTS.filter(filterTea);
  const partnerTeas = PARTNER_PRODUCTS.filter(filterTea);

  return (
    <div className="space-y-6 pb-4">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="animate-fade-in-up">
        <h1 className="font-serif text-[22px] font-light text-ink">
          {t.marketplace.title}
        </h1>
        <p className="text-[12px] text-ink-muted mt-0.5">
          {t.marketplace.subtitle}
        </p>
      </header>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="animate-fade-in-up animation-delay-75">
        <div className="flex items-center gap-2 rounded-2xl bg-porcelain px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink-muted/40 shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={t.marketplace.searchPlaceholder}
            className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted/50 focus:outline-none"
          />
        </div>
      </div>

      {/* ── Map — nearby tea rooms ─────────────────────────────────────────── */}
      <MapSection />

      {/* ── Filter pills ────────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden animate-fade-in-up animation-delay-200">
        {FILTERS.map((f) => (
          <FilterPill
            key={f}
            label={f}
            active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          />
        ))}
      </div>

      {/* ── Maison Théorea — available now ─────────────────────────────────── */}
      {availableTeas.length > 0 && (
        <section className="space-y-3 animate-fade-in-up animation-delay-250">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">
              {t.marketplace.available}
            </h2>
            <span className="text-[10px] text-oolong font-medium tracking-wide">
              Maison Théorea
            </span>
          </div>
          <div className="space-y-4">
            {availableTeas.map((tea) => (
              <ProductCard key={tea.id} tea={tea} onAdd={handleAdd} />
            ))}
          </div>
        </section>
      )}

      {/* ── Curated partners — coming soon ────────────────────────────────── */}
      {(activeFilter === "All" || partnerTeas.length > 0) && (
        <section className="space-y-3 animate-fade-in-up animation-delay-300">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">
              {t.marketplace.comingSoon}
            </h2>
            <span className="text-[10px] text-ink-muted/60 tracking-wide">
              Curated partners
            </span>
          </div>
          <div className="space-y-4">
            {(partnerTeas.length > 0 ? partnerTeas : PARTNER_PRODUCTS).map(
              (tea) => (
                <ProductCard key={tea.id} tea={tea} onAdd={handleAdd} />
              )
            )}
          </div>
        </section>
      )}

      {/* ── Lou shortcut ───────────────────────────────────────────────────── */}
      <div className="animate-fade-in-up animation-delay-400">
        <button
          onClick={() => router.push("/lou")}
          className="w-full flex items-center gap-3 p-4 rounded-[20px] bg-ink text-porcelain shadow-[0_4px_20px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all duration-200"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-oolong/30 to-oolong-dark/20 shrink-0">
            <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
              <path d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44" stroke="#c4a46a" strokeWidth="1.5" fill="#8a6a4a" fillOpacity="0.3" strokeLinecap="round" />
              <path d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="rgba(255,255,255,0.1)" strokeLinecap="round" />
              <line x1="24" y1="10" x2="24" y2="44" stroke="#c4a46a" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[13px] font-medium text-porcelain leading-tight">
              Not sure what to choose?
            </p>
            <p className="text-[11px] text-porcelain/50 mt-0.5">
              Ask Lou — your personal tea sommelier
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-porcelain/30 shrink-0"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ── Bag toast ──────────────────────────────────────────────────────── */}
      {bagToast && (
        <BagToast name={bagToast} onClose={() => setBagToast(null)} />
      )}
    </div>
  );
}
