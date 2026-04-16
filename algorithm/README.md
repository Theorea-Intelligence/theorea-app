# Algorithm — Tea Sommelier Engine

This folder contains the Python-based recommendation engine that powers Lou's tea suggestions.

## Purpose

The algorithm takes a **context** (time of day, weather, mood, food pairing, caffeine sensitivity, flavour preferences) and scores every approved tea in the catalogue against it — returning a ranked shortlist with human-readable reasoning.

## Structure

```
algorithm/
├── README.md               ← you are here
├── scorer.py               ← core scoring function (rule-based engine)
├── features.py             ← tea feature definitions and weightings
├── context.py              ← context input schema and validation
├── recommender.py          ← main entry point: takes context, returns ranked teas
└── tests/
    └── test_recommender.py ← unit tests for scoring logic
```

## Approach

**Phase 1 (current):** Rule-based scoring engine. Expert sommelier knowledge is encoded as weighted rules. Fully explainable — every recommendation includes a reason.

**Phase 2:** Layer in ML once user interaction data is available. Preference learning and collaborative filtering built on top of the rule base.

## Running Locally / in Codespaces

```bash
pip install supabase pandas scikit-learn
python recommender.py
```

## Connected To

- **Supabase** — reads from the `teas` table (approved products only)
- **Next.js API** — called via `/api/lou/recommend` endpoint
- **BigQuery** — logs recommendation events for future model training (Phase 5)

## Data Contract

Input: a JSON context object (see `context.py` for full schema)
Output: a ranked array of tea objects with scores and reasoning strings
