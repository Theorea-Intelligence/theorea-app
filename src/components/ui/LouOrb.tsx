/**
 * LouOrb — The breathing dual-leaf icon for Lou, Théorea's AI sommelier.
 *
 * Inspired by a luxury embossed-leather aesthetic: two tea leaves intertwined,
 * one dark (oolong) and one light (porcelain), with fine gold vein details
 * and a subtle vertical accent line. Breathes gently to convey presence.
 *
 * Variants:
 *  - "hero"   — large, for welcome screen (80px)
 *  - "card"   — medium, for dashboard Lou card (40px, light strokes for dark bg)
 *  - "chat"   — medium-large, for Lou chat empty state (56px)
 */

type LouOrbVariant = "hero" | "card" | "chat";

const sizeMap: Record<LouOrbVariant, { orb: number; ring: number; glow: number }> = {
  hero: { orb: 80, ring: 112, glow: 80 },
  card: { orb: 40, ring: 48, glow: 0 },
  chat: { orb: 56, ring: 80, glow: 56 },
};

function DualLeafIcon({ size, light = false }: { size: number; light?: boolean }) {
  const s = size * 0.45; // icon takes ~45% of orb
  const darkLeaf = light ? "#f5f0ea" : "#8a6a4a";
  const lightLeaf = light ? "rgba(255,255,255,0.5)" : "#d4d0c8";
  const vein = light ? "rgba(255,255,255,0.35)" : "#c4a46a";
  const accent = light ? "rgba(255,255,255,0.2)" : "rgba(196,164,106,0.5)";

  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left dark leaf */}
      <path
        d="M24 6C18 12 12 20 14 32C16 38 20 42 24 44"
        stroke={darkLeaf}
        strokeWidth="1.2"
        fill={darkLeaf}
        fillOpacity="0.25"
        strokeLinecap="round"
      />
      {/* Left leaf veins */}
      <path d="M24 44L20 30" stroke={vein} strokeWidth="0.6" strokeLinecap="round" />
      <path d="M24 44L18 24" stroke={vein} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M24 44L16 18" stroke={vein} strokeWidth="0.4" strokeLinecap="round" opacity="0.7" />

      {/* Right light leaf */}
      <path
        d="M24 6C30 12 36 20 34 32C32 38 28 42 24 44"
        stroke={lightLeaf}
        strokeWidth="1.2"
        fill={lightLeaf}
        fillOpacity="0.15"
        strokeLinecap="round"
      />
      {/* Right leaf veins */}
      <path d="M24 44L28 30" stroke={vein} strokeWidth="0.6" strokeLinecap="round" />
      <path d="M24 44L30 24" stroke={vein} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M24 44L32 18" stroke={vein} strokeWidth="0.4" strokeLinecap="round" opacity="0.7" />

      {/* Centre vein / stem */}
      <line x1="24" y1="10" x2="24" y2="44" stroke={vein} strokeWidth="0.8" strokeLinecap="round" />

      {/* Vertical accent line (right side) */}
      <line x1="40" y1="8" x2="40" y2="40" stroke={accent} strokeWidth="0.5" strokeLinecap="round" />
      {/* Accent dot */}
      <circle cx="40" cy="6" r="1.2" fill={accent} />
    </svg>
  );
}

export default function LouOrb({ variant = "hero" }: { variant?: LouOrbVariant }) {
  const { orb, ring, glow } = sizeMap[variant];
  const isCard = variant === "card";

  return (
    <div className="relative flex items-center justify-center">
      {/* Breathing ring */}
      <div
        className="absolute rounded-full animate-breathe-ring"
        style={{
          width: ring,
          height: ring,
          background: isCard
            ? "rgba(184,149,106,0.15)"
            : "rgba(184,149,106,0.08)",
        }}
      />

      {/* Glow (hero & chat only) */}
      {glow > 0 && (
        <div
          className="absolute rounded-full animate-breathe-glow"
          style={{ width: glow, height: glow }}
        />
      )}

      {/* Main orb */}
      <div
        className="relative flex items-center justify-center rounded-full animate-breathe shadow-lift"
        style={{
          width: orb,
          height: orb,
          background: isCard
            ? "linear-gradient(135deg, rgba(184,149,106,0.2), rgba(138,106,74,0.3))"
            : "linear-gradient(135deg, #3a3028, #1a1a1a)",
        }}
      >
        <DualLeafIcon size={orb} light={isCard} />
      </div>

      {/* Steam wisps (not on card variant) */}
      {!isCard && (
        <>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div
              className="rounded-full animate-steam mx-auto"
              style={{
                width: 1.5,
                height: variant === "hero" ? 16 : 12,
                background: "rgba(184,149,106,0.2)",
              }}
            />
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-[5px]">
            <div
              className="rounded-full animate-steam-delayed"
              style={{
                width: 1.5,
                height: variant === "hero" ? 12 : 8,
                background: "rgba(184,149,106,0.12)",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
