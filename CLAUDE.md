# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Maison Théorea** — a luxury tea brand and ritual intelligence platform.

The Théorea app is an AI tea companion experience featuring **Lou**, a conversational guide for tea rituals, mindfulness, and discovery.

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

## Status

This repository is in early setup. No source code, dependencies, or tooling have been committed yet. The `.gitignore` is pre-configured for Node.js with support for Vite, Next.js, Nuxt, SvelteKit, Gatsby, Firebase, and Serverless deployments.

## Development Guidelines

- Write all copy, comments, and documentation in British English
- Keep the UI minimal and unhurried — favour whitespace and restraint
- Prioritise accessibility and mobile-first responsive design
- All product data must reference SGS-certified lab results where applicable

Update this file as the stack, architecture, and project structure evolve.
