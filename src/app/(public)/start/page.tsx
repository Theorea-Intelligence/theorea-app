import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Théorea — Begin Your Ritual",
  description: "A connoisseur-grade tea experience. Discover exceptional teas, deepen your ritual.",
};

/* ── Scattered photo positions ────────────────────────────────────────────── */
const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=420&q=80",
    alt: "Oolong tea leaves in a ceramic bowl",
    style: {
      position: "absolute" as const,
      top: "3%",
      left: "-4%",
      width: 200,
      height: 270,
      borderRadius: 18,
      transform: "rotate(-8deg)",
      zIndex: 1,
    },
  },
  {
    src: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=380&q=80",
    alt: "Green tea ceremony",
    style: {
      position: "absolute" as const,
      top: "8%",
      right: "-2%",
      width: 180,
      height: 240,
      borderRadius: 18,
      transform: "rotate(6deg)",
      zIndex: 1,
    },
  },
  {
    src: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
    alt: "Tea steeping in a glass pot",
    style: {
      position: "absolute" as const,
      top: "28%",
      left: "-8%",
      width: 220,
      height: 160,
      borderRadius: 16,
      transform: "rotate(4deg)",
      zIndex: 2,
    },
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=360&q=80",
    alt: "Jasmine tea blossoms",
    style: {
      position: "absolute" as const,
      top: "32%",
      right: "-6%",
      width: 195,
      height: 220,
      borderRadius: 20,
      transform: "rotate(-5deg)",
      zIndex: 2,
    },
  },
  {
    src: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=340&q=80",
    alt: "Ceramic teapot on stone",
    style: {
      position: "absolute" as const,
      bottom: "22%",
      left: "-3%",
      width: 175,
      height: 210,
      borderRadius: 16,
      transform: "rotate(7deg)",
      zIndex: 1,
    },
  },
  {
    src: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=380&q=80",
    alt: "Da Hong Pao rock oolong",
    style: {
      position: "absolute" as const,
      bottom: "18%",
      right: "-4%",
      width: 190,
      height: 250,
      borderRadius: 18,
      transform: "rotate(-4deg)",
      zIndex: 1,
    },
  },
  {
    src: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&q=80",
    alt: "Tea tasting notes",
    style: {
      position: "absolute" as const,
      bottom: "5%",
      left: "8%",
      width: 155,
      height: 185,
      borderRadius: 14,
      transform: "rotate(-10deg)",
      zIndex: 3,
    },
  },
  {
    src: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80",
    alt: "Tea leaves close-up",
    style: {
      position: "absolute" as const,
      bottom: "4%",
      right: "6%",
      width: 160,
      height: 175,
      borderRadius: 16,
      transform: "rotate(9deg)",
      zIndex: 3,
    },
  },
];

/* ── Page indicator dots ──────────────────────────────────────────────────── */
function PageDots({ total, active }: { total: number; active: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        justifyContent: "center",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === active ? 20 : 5,
            height: 5,
            borderRadius: 99,
            background: i === active ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.28)",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Start page — Cosmos-style onboarding splash
   ══════════════════════════════════════════════════════════════════════════════ */
export default function StartPage() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: "#f7f7f3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Noise grain overlay ─────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />

      {/* ── Scattered photo collage ─────────────────────────────────────── */}
      {PHOTOS.map((photo, i) => (
        <div
          key={i}
          style={{
            ...photo.style,
            overflow: "hidden",
            boxShadow: [
              "0 8px 32px rgba(34,47,38,0.22)",
              "0 2px 8px rgba(34,47,38,0.12)",
              /* Rim light */
              "inset 0 0.5px 0 rgba(255,255,255,0.60)",
            ].join(", "),
          }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}

      {/* ── Centre vignette — fades photos toward middle ────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          background: "radial-gradient(ellipse 60% 70% at 50% 50%, #f7f7f3 30%, rgba(247,247,243,0.80) 55%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          textAlign: "center",
          padding: "0 28px",
          maxWidth: 380,
          width: "100%",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--nf-sans)",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(83,112,98,0.70)",
            marginBottom: 18,
          }}
        >
          Tea as Ritual
        </p>

        {/* Wordmark — large Playfair Display */}
        <h1
          style={{
            fontFamily: "var(--nf-serif)",
            fontSize: "clamp(52px, 14vw, 72px)",
            fontWeight: 400,
            letterSpacing: "0.12em",
            lineHeight: 1.0,
            color: "#222f26",
            margin: 0,
          }}
        >
          THÉOREA
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--nf-sans)",
            fontSize: 14,
            fontWeight: 300,
            letterSpacing: "0.06em",
            color: "rgba(34,47,38,0.55)",
            marginTop: 20,
            lineHeight: 1.6,
          }}
        >
          Discover exceptional teas.<br />Deepen your ritual.
        </p>

        {/* ── CTA Button ─────────────────────────────────────────────── */}
        <Link
          href="/welcome"
          style={{
            display: "inline-block",
            marginTop: 44,
            padding: "14px 52px",
            borderRadius: 99,
            background: "rgba(83, 112, 98, 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            /* Rim light on button */
            boxShadow: [
              "inset 0 0.5px 0 rgba(255,255,255,0.22)",
              "inset 0 -0.5px 0 rgba(0,0,0,0.10)",
              "0 8px 32px rgba(83,112,98,0.35)",
              "0 2px 8px rgba(83,112,98,0.20)",
            ].join(", "),
            fontFamily: "var(--nf-sans)",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#ffffff",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
        >
          Begin
        </Link>

        {/* ── Page dots ──────────────────────────────────────────────── */}
        <div style={{ marginTop: 44 }}>
          <PageDots total={4} active={0} />
        </div>
      </div>

      {/* ── Bottom ambient gradient ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          zIndex: 4,
          background: "linear-gradient(to top, rgba(83,112,98,0.08) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </main>
  );
}
