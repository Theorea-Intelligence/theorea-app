"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { LONDON_TEA_VENUES, type TeaVenue } from "@/lib/data/products";
import { supabase } from "@/lib/supabase/client";

const SERIF = '"Playfair Display Variable", "Georgia", serif';
const SANS  = '"Nunito Sans Variable", "Helvetica Neue", system-ui, sans-serif';

/* ── Types ───────────────────────────────────────────────────────────────── */
interface MarketProduct {
  id: string;
  brandName: string;
  productName: string;
  teaName: string;
  pricePence: number | null;
  weightG: number | null;
  inStock: boolean;
  imageUrl: string | null;
  purchaseUrl: string | null;
  categorySlug: string;
  categoryName: string;
  originRegion: string;
  flavorProfile: string[];
  caffeineLevel: string | null;
  sourcingNotes: string | null;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const fmt = {
  price: (p: number | null) => p ? `£${(p / 100).toFixed(2).replace(/\.00$/, "")}` : "TBC",
  weight: (g: number | null) => g ? `${g}g` : "",
  isApprox: (notes: string | null) => notes?.includes("APPROXIMATE") ?? false,
};

const CATEGORY_MAP: Record<string, string> = {
  "black-tea":   "Black",
  "oolong":      "Oolong",
  "green-tea":   "Green",
  "white-tea":   "White",
  "scented-tea": "Scented",
  "herbal":      "Herbal",
  "pu-erh":      "Pu-erh",
};

/* ── Venue chip ──────────────────────────────────────────────────────────── */
function VenueChip({ venue }: { venue: TeaVenue }) {
  return (
    <a
      href={`https://www.google.com/maps/search/${venue.mapsQuery}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        padding: "10px 14px",
        borderRadius: 14,
        minWidth: 140,
        background: "#ffffff",
        border: "1px solid rgba(34,47,38,0.10)",
        textDecoration: "none",
        transition: "opacity 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: "#222f26", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {venue.name}
        </p>
        <span style={{ fontFamily: SANS, fontSize: 10, color: "#222f26", flexShrink: 0, marginLeft: 4 }}>★ {venue.rating}</span>
      </div>
      <p style={{ fontFamily: SANS, fontSize: 10, color: "rgba(34,47,38,0.35)" }}>{venue.area} · {venue.distance}</p>
      <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600, color: "#6a9a7a", marginTop: 6 }}>
        {venue.type}
      </span>
    </a>
  );
}

/* ── Map section ─────────────────────────────────────────────────────────── */
function MapSection() {
  return (
    <section style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 400, letterSpacing: "0.03em", color: "#222f26", margin: 0 }}>Near You</h2>
          <p style={{ fontFamily: SANS, fontSize: 11, color: "rgba(34,47,38,0.35)", marginTop: 3 }}>Tea rooms and specialist shops</p>
        </div>
        <a
          href="https://www.google.com/maps/search/tea+rooms+near+me"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: "#222f26" }}
        >
          Open Maps →
        </a>
      </div>
      <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
        <iframe
          title="Tea rooms near you"
          src="https://maps.google.com/maps?q=tea+rooms+London&output=embed&z=13"
          style={{ width: "100%", height: 190, border: 0, filter: "grayscale(40%) contrast(0.85) brightness(0.7)", display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {LONDON_TEA_VENUES.map((venue) => (
          <VenueChip key={venue.name} venue={venue} />
        ))}
      </div>
    </section>
  );
}

/* ── Buy label helper ─────────────────────────────────────────────────────── */
function buyLabel(brandName: string): string {
  if (brandName === "Mariage Frères") return "Buy at Mariage Frères";
  if (brandName === "Twinings")       return "Buy at Twinings";
  return `Buy at ${brandName}`;
}

/* ── Product card ────────────────────────────────────────────────────────── */
function ProductCard({ tea, onAdd }: { tea: MarketProduct; onAdd: (name: string) => void }) {
  const [imgError, setImgError] = useState(false);
  const isTheorea  = tea.brandName === "Maison Théorea";
  const isApprox   = fmt.isApprox(tea.sourcingNotes);
  const displayCat = CATEGORY_MAP[tea.categorySlug] ?? tea.categoryName;

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: "#ffffff",
      boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.9), 0 2px 12px rgba(34,47,38,0.08)" }}>

      {/* Photo */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        {!imgError && tea.imageUrl ? (
          <Image src={tea.imageUrl} alt={tea.teaName} fill style={{ objectFit: "cover" }} unoptimized onError={() => setImgError(true)} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #f5f5f1, #ededea)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(34,47,38,0.85) 0%, transparent 55%)" }} />

        {/* Brand badge */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
          <span style={{
            fontFamily: SANS, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "4px 8px", borderRadius: 99,
            background: "rgba(247,247,243,0.82)", color: "#222f26", backdropFilter: "blur(8px)",
          }}>
            {isTheorea ? "Théorea" : tea.brandName}
          </span>
          {isApprox && (
            <span style={{
              fontFamily: SANS, fontSize: 9, fontWeight: 500, padding: "4px 8px", borderRadius: 99,
              background: "rgba(230,180,100,0.25)", color: "rgba(180,120,40,0.90)",
              backdropFilter: "blur(8px)",
            }}>
              Approx. price
            </span>
          )}
        </div>

        {/* Tea name overlaid */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 16px" }}>
          <p style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(247,247,243,0.65)", marginBottom: 4, fontWeight: 500 }}>
            {displayCat}
          </p>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 400, letterSpacing: "0.04em", lineHeight: 1.1, color: "#ffffff", margin: 0 }}>
            {tea.teaName}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <p style={{ fontFamily: SANS, fontSize: 11, color: "rgba(34,47,38,0.35)", marginBottom: 5 }}>
          {tea.originRegion}
        </p>
        <p style={{ fontFamily: SANS, fontSize: 13, color: "#537062", lineHeight: 1.5, fontWeight: 300 }}>
          {(tea.flavorProfile ?? []).slice(0, 3).join(" · ")}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(34,47,38,0.08)" }}>
          <div>
            <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 700, color: "#222f26" }}>
              {fmt.price(tea.pricePence)}
            </span>
            {isApprox && <span style={{ fontFamily: SANS, fontSize: 9, color: "rgba(180,120,40,0.80)", marginLeft: 4 }}>est.</span>}
            <span style={{ fontFamily: SANS, fontSize: 11, color: "rgba(34,47,38,0.30)", marginLeft: 6 }}>
              {fmt.weight(tea.weightG)}
            </span>
          </div>

          {/* CTA — external buy link for partners, Add to Bag for Théorea */}
          {isTheorea ? (
            <button
              onClick={() => onAdd(tea.teaName)}
              style={{
                fontFamily: SANS, fontSize: 12, fontWeight: 600,
                padding: "8px 18px", borderRadius: 10, border: "none",
                cursor: "pointer", letterSpacing: "0.04em",
                background: "rgba(83,112,98,0.14)", color: "#222f26",
                transition: "opacity 0.2s",
              }}
            >
              Add to Bag
            </button>
          ) : tea.purchaseUrl ? (
            <a
              href={tea.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontFamily: SANS, fontSize: 12, fontWeight: 600,
                padding: "8px 14px", borderRadius: 10,
                letterSpacing: "0.04em", textDecoration: "none",
                background: "#222f26", color: "#f7f7f3",
                transition: "opacity 0.2s",
              }}
            >
              {buyLabel(tea.brandName)}
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : (
            <button
              style={{
                fontFamily: SANS, fontSize: 12, fontWeight: 500,
                padding: "8px 18px", borderRadius: 10, border: "none",
                background: "rgba(34,47,38,0.07)", color: "rgba(34,47,38,0.30)",
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

/* ── Toast ───────────────────────────────────────────────────────────────── */
function BagToast({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        position: "fixed", bottom: 120, left: "50%", transform: "translateX(-50%)",
        zIndex: 50, display: "flex", alignItems: "center", gap: 12,
        padding: "12px 20px", borderRadius: 20,
        background: "rgba(247,247,243,0.92)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(83,112,98,0.28)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        fontFamily: SANS, color: "#222f26",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 300 }}>
        <strong style={{ fontWeight: 600 }}>{name}</strong> added to your bag
      </span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "rgba(34,47,38,0.35)", lineHeight: 1 }}>×</button>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function MarketplacePage() {
  const { t }    = useLocale();
  const router   = useRouter();
  const [products, setProducts]       = useState<MarketProduct[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [bagToast, setBagToast]       = useState<string | null>(null);

  /* ── Fetch all products from Supabase ─────────────────────────────── */
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("tea_products")
        .select(`
          id, brand_name, product_name, price_pence, weight_g, in_stock, image_url, sourcing_notes, purchase_url,
          teas (
            name, origin_region, flavor_profile, caffeine_level, body,
            tea_categories ( name, slug )
          )
        `)
        .eq("in_stock", true)
        .order("brand_name")
        .order("product_name");

      if (!error && data) {
        const mapped: MarketProduct[] = (data as Array<Record<string, unknown>>).map((row) => {
          const tea = row.teas as Record<string, unknown>;
          const cat = tea?.tea_categories as Record<string, unknown>;
          return {
            id:            row.id as string,
            brandName:     row.brand_name as string,
            productName:   row.product_name as string,
            teaName:       tea?.name as string ?? "",
            pricePence:    row.price_pence as number | null,
            weightG:       row.weight_g as number | null,
            inStock:       row.in_stock as boolean,
            imageUrl:      row.image_url as string | null,
            purchaseUrl:   row.purchase_url as string | null,
            categorySlug:  cat?.slug as string ?? "",
            categoryName:  cat?.name as string ?? "",
            originRegion:  tea?.origin_region as string ?? "",
            flavorProfile: (tea?.flavor_profile as string[]) ?? [],
            caffeineLevel: tea?.caffeine_level as string | null,
            sourcingNotes: row.sourcing_notes as string | null,
          };
        });
        setProducts(mapped);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  /* ── Filter categories derived from live data ─────────────────────── */
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => CATEGORY_MAP[p.categorySlug] ?? p.categoryName)))
      .filter(Boolean)
      .sort(),
  ];

  const filtered = activeFilter === "All"
    ? products
    : products.filter((p) => (CATEGORY_MAP[p.categorySlug] ?? p.categoryName) === activeFilter);

  /* ── Group by brand ───────────────────────────────────────────────── */
  const brands = Array.from(new Set(filtered.map((p) => p.brandName)));

  const handleAdd = (name: string) => {
    setBagToast(name);
    setTimeout(() => setBagToast(null), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 16 }}>

      {/* Header */}
      <header>
        <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, color: "rgba(34,47,38,0.30)", marginBottom: 4 }}>
          The Collection
        </p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 30, letterSpacing: "0.04em", color: "#222f26", margin: 0 }}>
          {t.marketplace.title}
        </h1>
        {!isLoading && (
          <p style={{ fontFamily: SANS, fontSize: 11, color: "rgba(34,47,38,0.35)", marginTop: 4 }}>
            {products.length} teas · {brands.length} brands
          </p>
        )}
      </header>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 14px", borderRadius: 14,
        background: "#ffffff", border: "1px solid rgba(34,47,38,0.10)",
        boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.9)",
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(34,47,38,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder={t.marketplace.searchPlaceholder}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: SANS, fontSize: 14, color: "#222f26" }}
        />
      </div>

      {/* Map */}
      <MapSection />

      {/* Category filters — derived from live data */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              flexShrink: 0,
              padding: "6px 16px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.04em",
              transition: "all 0.2s ease",
              ...(activeFilter === cat
                ? { background: "rgba(83,112,98,0.20)", color: "#222f26", boxShadow: "0 0 0 1px rgba(83,112,98,0.40)" }
                : { background: "#ffffff", color: "rgba(34,47,38,0.40)", boxShadow: "0 0 0 1px rgba(34,47,38,0.10)" }),
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading shimmer */}
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-shimmer" style={{ height: 280, borderRadius: 16 }} />
          ))}
        </div>
      )}

      {/* Products grouped by brand */}
      {!isLoading && brands.map((brand) => {
        const brandProducts = filtered.filter((p) => p.brandName === brand);
        if (brandProducts.length === 0) return null;
        const isTheorea = brand === "Maison Théorea";

        return (
          <section key={brand} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Brand header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(34,47,38,0.30)" }}>
                  {isTheorea ? "Our teas" : "Partner brand"}
                </p>
                <p style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 400, letterSpacing: "0.04em", color: "#222f26", marginTop: 2 }}>
                  {brand}
                </p>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 10, color: "rgba(34,47,38,0.25)" }}>
                {brandProducts.length} teas
              </span>
            </div>

            {/* Product cards */}
            {brandProducts.map((tea) => (
              <ProductCard key={tea.id} tea={tea} onAdd={handleAdd} />
            ))}
          </section>
        );
      })}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ fontFamily: SERIF, fontSize: 18, color: "#537062" }}>No teas in this category yet</p>
          <p style={{ fontFamily: SANS, fontSize: 13, color: "rgba(34,47,38,0.40)", marginTop: 8 }}>More are being curated</p>
        </div>
      )}

      {/* Ask Lou */}
      <button
        onClick={() => router.push("/lou")}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: 16, borderRadius: 16, border: "none", cursor: "pointer",
          background: "#ffffff",
          boxShadow: "0 0 0 1px rgba(83,112,98,0.20), 0 2px 12px rgba(34,47,38,0.06)",
          transition: "opacity 0.2s",
        }}
      >
        <div style={{ height: 36, width: 36, borderRadius: "50%", background: "rgba(83,112,98,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
            <path d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44" stroke="#222f26" strokeWidth="1.5" fill="#8a6a4a" fillOpacity="0.3" strokeLinecap="round" />
            <path d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44" stroke="rgba(34,47,38,0.3)" strokeWidth="1.5" fill="rgba(34,47,38,0.1)" strokeLinecap="round" />
            <line x1="24" y1="10" x2="24" y2="44" stroke="#222f26" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: "#222f26", margin: 0 }}>Not sure what to choose?</p>
          <p style={{ fontFamily: SANS, fontSize: 11, color: "rgba(34,47,38,0.30)", marginTop: 2 }}>Ask Lou — your personal tea sommelier</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34,47,38,0.2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {bagToast && <BagToast name={bagToast} onClose={() => setBagToast(null)} />}
    </div>
  );
}
