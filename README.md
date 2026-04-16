# Théorea App

> A digital tea sommelier in your pocket — built by Maison Théorea. Recommends the right tea for any time of day, weather, or food pairing, across all brands and origins.

---

## What This Is

A mobile-first Next.js PWA that serves as a universal tea intelligence companion — not a storefront. The app is built and operated by Maison Théorea but is designed for all tea drinkers, regardless of brand. The core experience: a context-aware AI companion called **Lou** recommends the best tea match based on the user's current time of day, live weather, and food pairing context. The catalogue spans multiple brands (Maison Théorea, Twinings, Mariage Frères, and future partners). Users can browse teas, follow guided brewing rituals, and chat with Lou for personalised guidance.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + inline styles for fixed-position layouts |
| Fonts | `@fontsource-variable/playfair-display` + `@fontsource-variable/nunito-sans` — self-hosted via `public/fonts/`, declared with `@font-face` in `globals.css` (do NOT use `next/font/google` — conflicts with Tailwind v4 CSS variable system) |
| Database | Supabase (PostgreSQL) — EU West region |
| Auth | Supabase Auth (email/password + SSO planned) |
| AI | Anthropic API via `/api/lou/chat` route (streaming) |
| Analytics | Google Analytics 4 |
| Payments | Stripe (wired, not yet live) |
| PWA | Service worker + manifest in `public/` |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Pre-auth pages (no nav)
│   │   ├── start/          # Landing / onboarding splash
│   │   ├── welcome/        # Post-signup welcome
│   │   └── reset-password/
│   ├── (main)/             # Authenticated shell (sidebar nav)
│   │   ├── dashboard/      # Full-screen hero: greeting + tea recommendation carousel
│   │   ├── lou/            # AI chat with Lou
│   │   ├── rituals/        # Guided brewing ritual page
│   │   ├── marketplace/    # Tea catalogue (Supabase-backed, grouped by brand)
│   │   ├── sommeliers/     # Expert sommeliers (placeholder)
│   │   └── profile/        # User profile
│   ├── api/
│   │   └── lou/chat/       # Server-sent events (SSE) streaming route for Lou AI
│   └── auth/callback/      # Supabase OAuth callback
├── components/
│   ├── ui/                 # Sidebar navigation (mobile pill + desktop sidebar)
│   ├── lou/                # Lou chat components
│   ├── marketplace/        # Product cards
│   ├── rituals/            # Ritual step components
│   └── social/
├── lib/
│   ├── context/
│   │   └── useTeaContext.ts  # Core hook: fetches weather, location, Supabase recommendations
│   ├── data/
│   │   └── products.ts       # Static fallback product catalogue + Lou suggestion engine
│   ├── supabase/             # Supabase client (browser + server + middleware)
│   ├── ai/                   # Anthropic SDK wrappers
│   ├── auth/
│   ├── analytics/
│   └── payments/
└── styles/
    └── globals.css           # @font-face declarations, Tailwind theme, glassmorphism utilities, grain overlay
```

---

## Database Schema (Supabase)

Three-tier model: **category → tea → product**

```
tea_categories   (id, name, slug, description, sort_order)
       ↓
teas             (id, category_id, name, origin_region, flavor_profile[], body,
                  caffeine_level, brew_temp_min/max_c, steep_time_min/max_s,
                  infusions_max, best_time_of_day[], best_weather[], image_url)
       ↓
tea_products     (id, tea_id, brand_name, product_name, sku, price_pence,
                  weight_g, in_stock, image_url, sourcing_notes)
```

**Current data:**
- 2 Maison Théorea signature teas (Da Hong Pao, Jasmin Snow Buds)
- 7 Twinings loose-leaf varieties → 10 products
- 6 Mariage Frères varieties → 10 products (images from mariagefreres.com catalogue)
- 22 products total across 3 brands

**Key function:** `recommend_teas(p_time_of_day, p_weather, p_temp_celsius, p_current_hour, p_limit)`
Scores teas by time-of-day fit, weather match, body, and caffeine level. Applies hard caffeine cutoffs: high caffeine −4pts after 15:00, stacking −4pts more after 18:00; low/none +2pts after 18:00.

---

## Recommendation Engine (`useTeaContext.ts`)

1. Requests browser geolocation
2. Fetches weather from Open-Meteo API + reverse-geocodes via Nominatim
3. Calls `supabase.rpc("recommend_teas", {...})` with time, weather condition, temperature, and current hour
4. Maps results to `RecommendationCard[]` — the type used throughout the UI
5. Generates Théorea-voice narrative descriptions client-side via `buildNarrativeReason()`
6. Falls back to hardcoded Da Hong Pao + Jasmin Snow Buds if Supabase is unreachable

---

## Key Design Decisions

**Full-screen dashboard:** Uses `position: fixed; inset: 0` to escape the layout container and bleed behind the iOS status bar. Other pages use the normal `(main)/layout.tsx` container with `pb-[88px] md:pb-0 md:pl-56`.

**Glassmorphism:** `backdrop-filter: blur(20–28px)` with `rgba()` backgrounds and `inset 0 0.5px 0 rgba(255,255,255,0.10)` rim-light shadow. Defined as `.glass`, `.glass-sage`, `.glass-dark` utilities in `globals.css`.

**Grain overlay:** `body::after` with SVG `feTurbulence` data URI at `opacity: 0.032`.

**Colour palette:** Dark forest green (`#1a2019`, `#0c120d`) backgrounds, sage green (`rgb(83,112,98)`) UI accents, warm white (`#f7f7f3`) for light pages.

**Font loading:** Self-hosted woff2 via `@font-face` in `globals.css` with absolute paths (`/fonts/nunito-sans-vf.woff2`, `/fonts/playfair-display-vf.woff2`). CSS variables: `--nf-serif` and `--nf-sans`. Never use `next/font` — it conflicts with Tailwind v4's `@theme` variable resolution.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon key (public)
ANTHROPIC_API_KEY                 # For Lou AI (add when ready)
NEXT_PUBLIC_GA4_ID                # Google Analytics 4 measurement ID
STRIPE_SECRET_KEY                 # Stripe secret (add when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
GCP_PROJECT_ID                    # BigQuery proxy (legacy, may be removed)
GCP_BQ_PROXY_SECRET
```

---

## Running Locally

```bash
npm install
npm run dev       # Turbopack dev server at localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

---

## Brand Voice & Constraints

- **Built by:** Maison Théorea — luxury, minimalist, zen. British English only throughout the app.
- **Audience:** All tea drinkers. The app is brand-agnostic in its recommendations; Maison Théorea teas appear alongside partner brands on equal footing.
- **AI persona Lou** speaks in the Théorea voice: calm, knowledgeable, never verbose.
- **Core recommendation signals:** time of day, live weather, temperature, and food pairing context.
- **Maison Théorea signature teas:** Da Hong Pao (oolong, Wuyi Fujian) and Jasmin Snow Buds (scented green, Fuding Fujian). Both SGS lab-certified and cleared for UK sale.
- **Business model:** B2B (brand partnerships — Twinings and Mariage Frères are the first examples) alongside D2C for Maison Théorea's own teas.
- **Company status:** Registered at Companies House since July 2025. Food inspection registration and trademark filing are pending.
