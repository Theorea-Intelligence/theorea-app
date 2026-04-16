# Supabase — Database & Edge Functions

This folder contains all Supabase-managed infrastructure: schema migrations and edge functions.

## Structure

```
supabase/
├── README.md               ← you are here
├── migrations/             ← SQL migration files (version-controlled schema changes)
│   └── YYYYMMDDHHMMSS_description.sql
└── functions/              ← Supabase Edge Functions (serverless, Deno)
    └── recommend/          ← Tea recommendation endpoint (calls algorithm)
```

## Migrations

Every change to the database schema must be written as a migration file — never edited directly in the Supabase Studio without a corresponding file here. This keeps the schema version-controlled and reproducible.

**Naming convention:** `YYYYMMDDHHMMSS_short-description.sql`

Example: `20260416120000_create-teas-table.sql`

Apply a migration:
```bash
supabase db push
```

## Edge Functions

Serverless functions deployed alongside the Supabase database. Used for logic that needs to run close to the data (e.g. calling the recommendation algorithm, triggering QC notifications).

Deploy a function:
```bash
supabase functions deploy recommend
```

## Connected To

- **algorithm/** — edge functions may invoke the Python scorer or replicate its logic
- **src/lib/db/** — Next.js database client connects to this Supabase project
- **B2B portal** — tea submission, QC workflow, and approval status all managed here

## Key Tables (to be created via migrations)

| Table | Purpose |
|---|---|
| `teas` | Approved tea catalogue — the algorithm reads from here |
| `tea_submissions` | B2B partner uploads, pending QC review |
| `businesses` | B2B partner accounts |
| `users` | Consumer accounts (via Supabase Auth) |
| `rituals` | Logged tea sessions and tasting notes |
| `recommendations` | Algorithm output log — future ML training data |
| `conversations` | Lou chat history per user |

## Supabase Project

- **Production URL:** stored in `NEXT_PUBLIC_SUPABASE_URL` env variable
- **Anon key:** stored in `NEXT_PUBLIC_SUPABASE_ANON_KEY` env variable
- **Service role key:** stored in `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never expose to client)
