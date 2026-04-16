# Notebooks — ML Experimentation & Research

This folder contains Jupyter / Google Colab notebooks used for research, prototyping, and data exploration. Nothing here runs in production — it is the laboratory.

## Purpose

Use notebooks to:
- Experiment with scoring weights before committing them to `algorithm/`
- Explore and visualise the tea feature schema
- Prototype ML models (clustering, collaborative filtering) before productionising
- Analyse BigQuery data (user interactions, recommendation performance)
- Document research findings with inline commentary

## Workflow

1. Experiment freely in Colab or Jupyter
2. Save completed notebooks to this folder via GitHub (`File → Save a copy in GitHub`)
3. Once a prototype is validated, graduate the logic into `algorithm/`
4. Notebooks remain here as a research trail — never delete them

## Naming Convention

```
YYYY-MM-DD_topic-description.ipynb
```

Examples:
- `2026-04-16_flavour-matrix-exploration.ipynb`
- `2026-05-01_caffeine-ltheanine-weighting.ipynb`
- `2026-06-15_clustering-tea-archetypes.ipynb`

## Opening in Google Colab

From Colab: `File → Open notebook → GitHub` → search for `Theorea-Intelligence/theorea-app` → navigate to `notebooks/`

## Connected To

- **BigQuery** — analytics queries and model training data
- **algorithm/** — notebooks feed validated logic into production code
