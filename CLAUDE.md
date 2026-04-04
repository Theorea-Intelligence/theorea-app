# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Maison Théorea** — a luxury tea brand, ritual intelligence platform, and premium tea ecosystem.

The Théorea app is a connoisseur-grade tea platform combining a pocket tea sommelier (Lou), ritual tracking, sommelier knowledge-sharing, and a curated premium marketplace — not just for Théorea's own teas, but for exceptional teas available across the market. The app itself is a connoisseur — every surface, every interaction reflects deep tea intelligence.

GitHub remote: `git@github.com:Theorea-Intelligence/theorea-app.git`

## Brand Identity

- **Tone:** Elegant, luxury, minimalistic zen
- **Language:** British English only
- **Aesthetic:** Clean, contemplative, refined — every detail should feel intentional
- **Philosophy:** Tea as ritual, not routine. Intelligence through stillness.

## Business Context

- **Entity:** Maison Théorea, registered at Companies House (July 2025)
- **Founder & CEO:** Kim (kim.bian@maison-theorea.com)
- **Market:** Online retail, UK market
- **Website:** Under construction (home page ready)

### Signature Products

1. **Da Hong Pao** — Oolong tea (SGS lab tested, approved for sale)
2. **Jasmin Snow Buds** — Scented green tea (SGS lab tested, approved for sale)

### Regulatory & Milestones

- Companies House registration: Complete
- SGS lab testing (both products): Passed
- Local council food inspection registration: Pending
- Trademark registration: Pending
- First crowdfunding round: Upcoming

## Google Cloud Platform (GCP)

### Organisation & Projects

- **GCP Organisation:** Maison Théorea (kim.bian@maison-theorea.com)
- **Production project:** `theorea-intelligence-prod`
- **Staging project:** `theorea-intelligence-staging`
- **Region:** `europe-west2` (London) — all services and storage co-located here
- **Billing:** Single billing account covering both projects

### Services & Integrations

- **BigQuery** — Data warehouse for analytics, customer events, and reporting. Datasets live in `theorea-intelligence-prod`. GA4 and Google Ads data flow here automatically.
- **Google Analytics 4 (GA4)** — Website and app tracking. Implemented directly in app code (no GTM). Daily export to BigQuery enabled.
- **Google Ads** — Campaign performance and conversion tracking. Data transferred to BigQuery via the free Google Ads connector.
- **Cloud Storage** — Standard class, `europe-west2`. Used for backups, media assets, and raw data exports.

### Data Architecture

- **App database** — To be configured (Cloud SQL / Firestore). Stores user accounts, Lou conversation history, tea preferences, and ritual logs.
- **GA4 → BigQuery** — Daily export (not streaming) to minimise cost. Raw event data for behavioural analysis.
- **Google Ads → BigQuery** — Free data transfer connector. Campaign and conversion data for ROI analysis.
- **Cloud Storage** — Backups, product images, and static assets.

### Cost Management

- Free tier covers beta usage: 10 GB BigQuery storage, 1 TB queries/month
- GA4 daily export avoids streaming ingestion fees
- Google Ads → BigQuery connector is free
- Set billing alerts at £10/month to avoid surprises

### OAuth & Authentication

- **OAuth client:** Web application (`Theorea Intelligence Prod` project)
- **OAuth client ID:** Stored in environment variable `GCP_OAUTH_CLIENT_ID`
- **OAuth client secret:** Stored in environment variable `GCP_OAUTH_CLIENT_SECRET`
- **Consent screen:** External, app name `Theorea Intelligence`

### Claude Integrations

- **BigQuery MCP connector:** Connected via Google OAuth (kim.bian@maison-theorea.com). Enables direct BigQuery queries from Claude — dataset listing, schema inspection, and SQL execution.

### API Keys & Secrets

> Never commit API keys, OAuth secrets, service account credentials, or any secrets to this repository. Store them as environment variables locally or in GCP Secret Manager for production. Reference keys by their Secret Manager resource name in code.
>
> Use a `.env` file for local development (already covered by `.gitignore`).

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS — minimal, zen aesthetic
- **Hosting:** Vercel (production and preview deployments)
- **Database:** PostgreSQL via Supabase (auth, profiles, marketplace, rituals, social)
- **AI:** Anthropic Claude API (powers Lou, the AI tea companion)
- **Payments:** Stripe (marketplace transactions, sommelier payouts)
- **Media:** GCP Cloud Storage (product images, sommelier uploads)
- **Analytics:** GA4 → BigQuery (no GTM)
- **Search & recommendations:** Algolia or built-in PostgreSQL full-text search (to be decided)

## App Architecture

### Core Features

**1. Lou — Pocket Tea Sommelier**
A digital tea sommelier powered by Claude — not just a chatbot, but a true connoisseur. Lou guides users through tea discovery, brewing technique, flavour profiling, and ritual deepening with the knowledge and sensibility of an expert sommelier. The app itself embodies this connoisseurship — every recommendation, every interaction is informed by deep tea intelligence. Lou personalises guidance based on user preferences, ritual history, and evolving palate.

**2. Tea Ritual Tracker**
Users log tea sessions: what they brewed, brewing parameters (temperature, steep time), tasting notes, mood, mindfulness reflections. Builds a personal tea journal over time. Data feeds into Lou's personalisation and the recommendation algorithm.

**3. Premium Tea Marketplace**
A curated marketplace — not a mass-market shop. Includes Théorea's own products (Da Hong Pao, Jasmin Snow Buds) alongside premium teas from verified sellers and sommeliers. Features an algorithmic recommendation engine that surfaces teas based on user preferences, ritual history, and sommelier endorsements.

**4. Tea Sommelier Social Network**
Tea sommeliers and experts can create profiles, share tasting notes, publish brewing guides, and list their curated teas on the marketplace. Community features include following, commenting, and knowledge sharing. Think of it as a refined, knowledge-driven social layer — not noisy, but contemplative.

### Data Model (Core Entities)

- **Users** — accounts, profiles, preferences, subscription tier
- **Sommeliers** — verified expert profiles, credentials, followers
- **Teas** — product catalogue (own + marketplace), origin, type, flavour profile, certifications
- **Rituals** — logged tea sessions, brewing params, tasting notes, mood
- **Conversations** — Lou chat history per user
- **Orders** — marketplace transactions, payment status, fulfilment
- **Reviews** — tea ratings, tasting reviews from users and sommeliers
- **Posts** — sommelier knowledge shares, brewing guides, articles

### Recommended Project Structure

```
theorea-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Login, signup, onboarding
│   │   ├── (main)/             # Authenticated app shell
│   │   │   ├── lou/            # AI companion chat
│   │   │   ├── rituals/        # Ritual tracker & journal
│   │   │   ├── marketplace/    # Browse, search, product pages
│   │   │   ├── sommeliers/     # Sommelier profiles & social
│   │   │   └── profile/        # User profile & preferences
│   │   └── api/                # API routes
│   │       ├── lou/            # Claude AI endpoints
│   │       ├── rituals/        # Ritual CRUD
│   │       ├── marketplace/    # Products, orders, search
│   │       └── social/         # Follow, comment, share
│   ├── components/             # Shared UI components
│   │   ├── ui/                 # Design system primitives
│   │   ├── lou/                # Chat interface components
│   │   ├── rituals/            # Ritual logging components
│   │   ├── marketplace/        # Product cards, cart, checkout
│   │   └── social/             # Feed, profiles, comments
│   ├── lib/                    # Utilities and shared logic
│   │   ├── ai/                 # Claude API integration
│   │   ├── db/                 # Database client & queries
│   │   ├── auth/               # Authentication helpers
│   │   ├── payments/           # Stripe integration
│   │   └── analytics/          # GA4 event tracking
│   └── styles/                 # Global styles & Tailwind config
├── public/                     # Static assets
├── prisma/                     # Database schema & migrations
└── tests/                      # Test suites
```

### Build Phases

**Phase 1 — Foundation (current)**
Next.js project setup, authentication (Supabase Auth), design system, basic layout, GA4 integration. Deploy to Vercel.

**Phase 2 — Lou & Rituals**
Claude API integration for Lou. Ritual tracker with logging and journal views. User profiles and preferences.

**Phase 3 — Marketplace**
Product catalogue (starting with Théorea's own teas). Product pages, cart, Stripe checkout. Recommendation algorithm foundations.

**Phase 4 — Social & Sommelier Platform**
Sommelier verification and profiles. Knowledge sharing (posts, guides). Social features (follow, comment). Marketplace opens to sommelier-listed teas.

**Phase 5 — Algorithm & Scale**
Recommendation engine refinement. Search optimisation. Performance tuning. BigQuery analytics dashboards.

## Development Guidelines

- Write all copy, comments, and documentation in British English
- Keep the UI minimal and unhurried — favour whitespace and restraint
- Prioritise accessibility and mobile-first responsive design
- All product data must reference SGS-certified lab results where applicable
- Use server components by default; client components only when interactivity requires it
- Keep API routes thin — business logic lives in `lib/`
- Every marketplace seller must be verified before listing
- Lou must never give medical or health claims about tea
- Respect user data privacy — GDPR and UK GDPR compliant from day one

## Status

Repository is in early setup. GCP infrastructure configured. Next step: initialise Next.js project and begin Phase 1.
