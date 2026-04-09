#!/bin/bash
# =============================================================================
# Théorea Analytics — BigQuery Setup Script
#
# Creates the full data warehouse structure:
#   raw_app        → raw events from Supabase app (built now)
#   raw_web        → raw events from GA4/website (future)
#   staging        → dbt cleaning layer (future)
#   marts_users    → user analytics models (future)
#   marts_rituals  → tea & ritual analytics (future)
#   marts_commerce → marketplace analytics (future)
#
# Naming convention:
#   Datasets:  snake_case, prefixed by layer (raw_, staging_, marts_)
#   Tables:    src_<source>__<entity>  (raw layer)
#              stg_<source>__<entity>  (staging layer, dbt)
#              dim_<entity>            (dimension tables, dbt)
#              fct_<entity>            (fact tables, dbt)
#
# Usage:
#   1. Install gcloud CLI: https://cloud.google.com/sdk/docs/install
#   2. Authenticate: gcloud auth login
#   3. Set your project: export GCP_PROJECT_ID=your-project-id
#   4. Run: bash scripts/setup-bigquery.sh
# =============================================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
GCP_PROJECT_ID="${GCP_PROJECT_ID:-}"
BQ_LOCATION="${BQ_LOCATION:-EU}"   # EU keeps data in Europe (GDPR friendly)

if [ -z "$GCP_PROJECT_ID" ]; then
  echo "❌  Please set GCP_PROJECT_ID environment variable"
  echo "    export GCP_PROJECT_ID=theorea-analytics"
  exit 1
fi

echo ""
echo "🍃  Théorea Analytics — BigQuery Setup"
echo "    Project:  $GCP_PROJECT_ID"
echo "    Location: $BQ_LOCATION"
echo ""

# ── 1. Create Datasets ────────────────────────────────────────────────────────
echo "📁  Creating datasets..."

create_dataset() {
  local dataset=$1
  local description=$2
  if bq ls --project_id="$GCP_PROJECT_ID" "$dataset" &>/dev/null; then
    echo "    ✓  $dataset (already exists)"
  else
    bq mk \
      --project_id="$GCP_PROJECT_ID" \
      --location="$BQ_LOCATION" \
      --dataset \
      --description="$description" \
      "$dataset"
    echo "    ✓  $dataset (created)"
  fi
}

create_dataset "raw_app"        "Raw, untransformed events from the Théorea app (Supabase). Never modify — source of truth."
create_dataset "raw_web"        "Raw events from website and GA4. Reserved for future web analytics pipeline."
create_dataset "staging"        "dbt staging layer. Lightly cleaned and renamed from raw sources. Reserved for future dbt project."
create_dataset "marts_users"    "dbt-transformed user analytics models. Reserved for future dbt project."
create_dataset "marts_rituals"  "dbt-transformed tea ritual and engagement analytics. Reserved for future dbt project."
create_dataset "marts_commerce" "dbt-transformed marketplace and commerce analytics. Reserved for future dbt project."

echo ""

# ── 2. Create Tables in raw_app ───────────────────────────────────────────────
echo "📋  Creating tables in raw_app..."

# src_supabase__login_events
bq mk --force \
  --project_id="$GCP_PROJECT_ID" \
  --table \
  --description="Raw login events from Supabase. One row per sign-in. Append-only." \
  --time_partitioning_field="created_at" \
  --time_partitioning_type="DAY" \
  "${GCP_PROJECT_ID}:raw_app.src_supabase__login_events" \
  event_id:STRING,user_id:STRING,auth_provider:STRING,device_type:STRING,ip_address:STRING,user_agent:STRING,created_at:TIMESTAMP,_loaded_at:TIMESTAMP,_source:STRING,_table:STRING,_event_type:STRING

echo "    ✓  raw_app.src_supabase__login_events"

# src_supabase__users (signup events)
bq mk --force \
  --project_id="$GCP_PROJECT_ID" \
  --table \
  --description="Raw user signup events from Supabase. One row per new account created. Append-only." \
  --time_partitioning_field="created_at" \
  --time_partitioning_type="DAY" \
  "${GCP_PROJECT_ID}:raw_app.src_supabase__users" \
  user_id:STRING,email:STRING,display_name:STRING,auth_provider:STRING,experience_level:STRING,brewing_style:STRING,taste_preferences:STRING,sign_in_count:INTEGER,created_at:TIMESTAMP,last_sign_in_at:TIMESTAMP,_loaded_at:TIMESTAMP,_source:STRING,_table:STRING,_event_type:STRING

echo "    ✓  raw_app.src_supabase__users"

# src_supabase__users_updates (profile change events)
bq mk --force \
  --project_id="$GCP_PROJECT_ID" \
  --table \
  --description="Raw profile update events. Tracks preference and personalisation changes over time. Append-only." \
  --time_partitioning_field="updated_at" \
  --time_partitioning_type="DAY" \
  "${GCP_PROJECT_ID}:raw_app.src_supabase__users_updates" \
  user_id:STRING,changed_fields:STRING,experience_level:STRING,brewing_style:STRING,taste_preferences:STRING,sign_in_count:INTEGER,last_sign_in_at:TIMESTAMP,updated_at:TIMESTAMP,_loaded_at:TIMESTAMP,_source:STRING,_table:STRING,_event_type:STRING

echo "    ✓  raw_app.src_supabase__users_updates"

echo ""

# ── 3. Set app config in Supabase ────────────────────────────────────────────
echo "🔧  Next steps to activate the webhook:"
echo ""
echo "    a) Add Supabase Edge Function secrets:"
echo "       npx supabase secrets set BIGQUERY_PROJECT_ID=$GCP_PROJECT_ID"
echo "       npx supabase secrets set BIGQUERY_SERVICE_ACCOUNT_KEY='<paste JSON key here>'"
echo "       npx supabase secrets set BIGQUERY_WEBHOOK_SECRET='<generate a random secret>'"
echo ""
echo "    b) Get your Edge Function URL:"
echo "       https://lqzwgjcdbcnlojnmfheb.supabase.co/functions/v1/bigquery-sync"
echo ""
echo "    c) Activate the webhook in Supabase SQL Editor:"
echo "       ALTER DATABASE postgres SET app.bigquery_webhook_url = 'https://lqzwgjcdbcnlojnmfheb.supabase.co/functions/v1/bigquery-sync';"
echo "       ALTER DATABASE postgres SET app.bigquery_webhook_secret = '<your secret>';"
echo ""

echo "✅  BigQuery setup complete."
echo ""
echo "    Structure:"
echo "    $GCP_PROJECT_ID"
echo "    ├── raw_app"
echo "    │   ├── src_supabase__login_events   (partitioned by day)"
echo "    │   ├── src_supabase__users           (partitioned by day)"
echo "    │   └── src_supabase__users_updates   (partitioned by day)"
echo "    ├── raw_web                           (reserved)"
echo "    ├── staging                           (reserved for dbt)"
echo "    ├── marts_users                       (reserved for dbt)"
echo "    ├── marts_rituals                     (reserved for dbt)"
echo "    └── marts_commerce                    (reserved for dbt)"
echo ""
