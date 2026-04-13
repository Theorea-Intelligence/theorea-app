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

/* ── Venue chip ──────────────────────────────────────────────────────────── */
function VenueChip({ venue }: { venue: TeaVenue }) {
  return (
    <a
      href={`https://www.google.com/maps/search/${venue.mapsQuery}`}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 flex flex-col px-3.5 py-2.5 rounded-[14px] min-w-[140px] active:opacity-70 transition-opacity duration-200"
      style={{ background: "#ffffff", border: "1px solid rgba(34,47,38,0.10)" }}
    >
      <div className="flex items-center justify-between mb-0.5">
        <p className="text-[12px] font-medium leading-tight line-clamp-1" style={{ color: "#222f26" }}>
          {venue.name}
        </p>
        <span className="text-[10px] ml-1 shrink-0" style={{ color: "#222f26" }}>
          ★ {venue.rating}
        </span>
      </div>
      <p className="text-[10px]" style={{ color: "rgba(34,47,38,0.35)" }}>
        {venue.area} · {venue.distance}
      </p>
      <span
        className="mt-1.5 text-[9px] uppercase tracking-[0.07em] font-medium"
        style={{ color: "#6a9a7a" }}
      >
        {venue.type}
      </span>
    </a>
  );
}

/* ── Map section ─────────────────────────────────────────────────────────── */
function MapSection() {
  return (
    <section className="space-y-3 animate-fade-in-up animation-delay-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-[18px] font-light" style={{ color: "#222f26" }}>
            Near You
          </h2>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(34,47,38,0.35)" }}>
            Tea rooms and specialist shops
          </p>
        </div>
        <a
          href="https://www.google.com/maps/search/tea+rooms+near+me"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium active:opacity-60"
          style={{ color: "#222f26" }}
        >
          Open Maps →
        </a>
      </div>

      <div className="relative w-full overflow-hidden" style={{ borderRadius: 16 }}>
        <iframe
          title="Tea rooms near you"
          src="https://maps.google.com/maps?q=tea+rooms+London&output=embed&z=13"
          className="w-full"
          style={{ height: 190, border: 0, filter: "grayscale(40%) contrast(0.85) brightness(0.7)" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 16,
            border: "1px solid rgba(83,112,98,0.20)",
          }}
        />
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LONDON_TEA_VENUES.map((venue) => (
          <VenueChip key={venue.name} venue={venue} />
        ))}
      </div>
    </section>
  );
}

/* ── Product card — full-bleed gallery style ─────────────────────────────── */
function ProductCard({ tea, onAdd }: { tea: TeaProduct; onAdd: (t: TeaProduct) => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="overflow-hidden active:opacity-90 transition-opacity duration-200"
      style={{ borderRadius: 16, background: "#ffffff" }}
    >
      {/* Full-bleed photo */}
      <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
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
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #c9d9c9, #f1e6c8)" }}
          />
        )}

        {/* Gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(34,47,38,0.85) 0%, rgba(241,230,200,0.1) 60%, transparent 100%)" }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {tea.brandTag === "theorea" && (
            <span
              className="text-[9px] tracking-[0.08em] uppercase font-medium px-2 py-1 rounded-full"
              style={{ background: "rgba(241,230,200,0.75)", color: "#222f26", backdropFilter: "blur(8px)" }}
            >
              Théorea
            </span>
          )}
          {!tea.available && (
            <span
              className="text-[9px] tracking-[0.07em] uppercase px-2 py-1 rounded-full"
              style={{ background: "rgba(241,230,200,0.7)", color: "rgba(34,47,38,0.5)", backdropFilter: "blur(8px)" }}
            >
              Soon
            </span>
          )}
        </div>

        {/* Name overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p
            className="text-[10px] tracking-[0.1em] uppercase mb-1"
            style={{ color: "#222f26" }}
          >
            {tea.brand}
          </p>
          <h3
            className="font-serif text-[20px] font-light leading-tight"
            style={{ color: "#222f26" }}
          >
            {tea.name}
          </h3>
        </div>
      </div>

      {/* Info below */}
      <div className="px-4 pt-3 pb-4">
        <p className="text-[11px] mb-1" style={{ color: "rgba(34,47,38,0.3)" }}>
          {tea.type} · {tea.origin}
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "#537062" }}>
          {tea.profile}
        </p>

        <div
          className="flex items-center justify-between mt-3.5 pt-3.5"
          style={{ borderTop: "1px solid rgba(34,47,38,0.09)" }}
        >
          <div>
            <span className="text-[16px] font-medium" style={{ color: "#222f26" }}>{tea.price}</span>
            <span className="text-[11px] ml-1.5" style={{ color: "rgba(34,47,38,0.3)" }}>{tea.weight}</span>
          </div>

          {tea.available ? (
            <button
              onClick={() => onAdd(tea)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium active:opacity-70 transition-opacity duration-200"
              style={{
                background: "rgba(83,112,98,0.20)",
                border: "1px solid rgba(83,112,98,0.28)",
                color: "#222f26",
              }}
            >
              Add to Bag
            </button>
          ) : (
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium"
              style={{
                background: "rgba(34,47,38,0.10)",
                color: "rgba(34,47,38,0.3)",
              }}
            >
              Notify me
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Filter pills ────────────────────────────────────────────────────────── */
const FILTERS = ["All", "Oolong", "Green", "White", "Pu-erh"] as const;
type Filter = (typeof FILTERS)[number];

/* ── Toast ───────────────────────────────────────────────────────────────── */
function BagToast({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 animate-fade-in-up"
      style={{
        background: "#faf7f0",
        border: "1px solid rgba(83,112,98,0.28)",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        color: "#222f26",
        backdropFilter: "blur(16px)",
      }}
    >
      <span className="text-[13px] font-light">
        <span className="font-medium">{name}</span> added to your bag
      </span>
      <button
        onClick={onClose}
        className="text-[16px] leading-none active:opacity-60"
        style={{ color: "rgba(34,47,38,0.4)" }}
      >
        ×
      </button>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function MarketplacePage() {
  const { t } = useLocale();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [bagToast, setBagToast] = useState<string | null>(null);

  const handleAdd = (tea: TeaProduct) => {
    setBagToast(tea.name);
    setTimeout(() => setBagToast(null), 3000);
  };

  const filterTea = (tea: TeaProduct) => {
    if (activeFilter === "All") return true;
    const type = tea.type.toLowerCase();
    if (activeFilter === "Oolong") return type.includes("oolong");
    if (activeFilter === "Green")  return type.includes("green");
    if (activeFilter === "White")  return type.includes("white");
    if (activeFilter === "Pu-erh") return type.includes("pu-erh") || type.includes("puerh");
    return true;
  };

  const availableTeas = THEOREA_PRODUCTS.filter(filterTea);
  const partnerTeas   = PARTNER_PRODUCTS.filter(filterTea);

  return (
    <div className="space-y-7 pb-4">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="animate-fade-in-up">
        <p
          className="text-[10px] tracking-[0.14em] uppercase font-medium mb-1"
          style={{ color: "rgba(34,47,38,0.3)" }}
        >
          Maison Théorea
        </p>
        <h1
          className="font-serif font-light"
          style={{ fontSize: 30, color: "#222f26" }}
        >
          {t.marketplace.title}
        </h1>
      </header>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 py-3 animate-fade-in-up animation-delay-75"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(34,47,38,0.10)",
          borderRadius: 14,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(34,47,38,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder={t.marketplace.searchPlaceholder}
          className="flex-1 bg-transparent text-[14px] focus:outline-none"
          style={{ color: "#222f26" }}
        />
      </div>

      {/* ── Map ────────────────────────────────────────────────────────── */}
      <MapSection />

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden animate-fade-in-up animation-delay-200">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="shrink-0 px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 active:opacity-70"
            style={
              activeFilter === f
                ? {
                    background: "rgba(83,112,98,0.24)",
                    border: "1px solid rgba(83,112,98,0.48)",
                    color: "#222f26",
                  }
                : {
                    background: "#ffffff",
                    border: "1px solid rgba(34,47,38,0.10)",
                    color: "rgba(34,47,38,0.4)",
                  }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Available teas ─────────────────────────────────────────────── */}
      {availableTeas.length > 0 && (
        <section className="space-y-4 animate-fade-in-up animation-delay-250">
          <div className="flex items-center justify-between">
            <p
              className="text-[10px] tracking-[0.1em] uppercase font-medium"
              style={{ color: "rgba(34,47,38,0.3)" }}
            >
              {t.marketplace.available}
            </p>
            <span
              className="text-[10px] tracking-wide font-medium"
              style={{ color: "#222f26" }}
            >
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

      {/* ── Partner / coming soon ───────────────────────────────────────── */}
      {(activeFilter === "All" || partnerTeas.length > 0) && (
        <section className="space-y-4 animate-fade-in-up animation-delay-300">
          <div className="flex items-center justify-between">
            <p
              className="text-[10px] tracking-[0.1em] uppercase font-medium"
              style={{ color: "rgba(34,47,38,0.3)" }}
            >
              {t.marketplace.comingSoon}
            </p>
            <span className="text-[10px]" style={{ color: "rgba(34,47,38,0.2)" }}>
              Curated partners
            </span>
          </div>
          <div className="space-y-4">
            {(partnerTeas.length > 0 ? partnerTeas : PARTNER_PRODUCTS).map((tea) => (
              <ProductCard key={tea.id} tea={tea} onAdd={handleAdd} />
            ))}
          </div>
        </section>
      )}

      {/* ── Lou shortcut ───────────────────────────────────────────────── */}
      <button
        onClick={() => router.push("/lou")}
        className="w-full flex items-center gap-3 p-4 active:opacity-80 transition-opacity duration-200 animate-fade-in-up animation-delay-400"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(83,112,98,0.20)",
          borderRadius: 16,
        }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full shrink-0"
          style={{ background: "rgba(83,112,98,0.1)" }}
        >
          <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
            <path d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44" stroke="#222f26" strokeWidth="1.5" fill="#8a6a4a" fillOpacity="0.3" strokeLinecap="round" />
            <path d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44" stroke="rgba(34,47,38,0.3)" strokeWidth="1.5" fill="rgba(34,47,38,0.1)" strokeLinecap="round" />
            <line x1="24" y1="10" x2="24" y2="44" stroke="#222f26" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[13px] font-medium" style={{ color: "#222f26" }}>
            Not sure what to choose?
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(34,47,38,0.3)" }}>
            Ask Lou — your personal tea sommelier
          </p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34,47,38,0.2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {bagToast && <BagToast name={bagToast} onClose={() => setBagToast(null)} />}
    </div>
  );
}
