import functions_framework
import json
import os
from google.cloud import bigquery
from flask import Request


@functions_framework.http
def bigquery_proxy(request: Request):
    """
    Théorea BigQuery Proxy
    Receives structured event payloads from Supabase Edge Function
    and writes them to BigQuery using Application Default Credentials.
    No service account key required — runs as the Cloud Function's identity.
    """
    # Validate shared secret
    expected_secret = os.environ.get("WEBHOOK_SECRET", "")
    if not expected_secret or request.headers.get("x-webhook-secret") != expected_secret:
        return (json.dumps({"error": "Unauthorized"}), 401)

    try:
        data = request.get_json(silent=True)
        if not data:
            return (json.dumps({"error": "Invalid JSON body"}), 400)

        table_id = data.get("table")   # e.g. "raw_app.src_supabase__login_events"
        rows = data.get("rows", [])

        if not table_id or not rows:
            return (json.dumps({"error": "Missing table or rows"}), 400)

        project_id = os.environ.get("GCP_PROJECT_ID", "theorea-intelligence-prod")
        full_table_id = f"{project_id}.{table_id}"

        client = bigquery.Client()
        errors = client.insert_rows_json(full_table_id, rows)

        if errors:
            return (json.dumps({"error": "BigQuery insert failed", "details": errors}), 500)

        return (json.dumps({"ok": True, "inserted": len(rows), "table": full_table_id}), 200)

    except Exception as e:
        return (json.dumps({"error": str(e)}), 500)
