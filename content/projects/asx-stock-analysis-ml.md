---
id: "asx-stock-analysis-ml"
title: "ASX Stock Analysis & ML Pipeline"
description: "An automated pipeline that ingests ASX mining stock data via Yahoo Finance, transforms it with dbt, generates 45+ ML features, and surfaces trading signals through Streamlit dashboards."
status: production
category: "data-engineering"
featured: false
draft: false
order: 8
tech:
  - Python
  - dbt
  - DuckDB
  - dlt
  - Streamlit
  - GitHub Actions
links:
  github: "https://github.com/alwyndsouza/asx_stock_analysis_using_ml"
---

A fully automated stock analysis pipeline for ASX mining stocks — from raw price data to ML-ready features, running daily without any infrastructure costs.

**Pipeline:** Yahoo Finance → dlt (incremental ingestion) → DuckDB → dbt (staging → marts) → Streamlit. GitHub Actions runs the full pipeline daily at 7 PM AEST; artifacts are stored in GitHub Releases — no servers needed.

Incremental processing cuts runtime from 20+ minutes to 2–3 minutes on daily runs.

**What gets generated:**
- 45+ technical indicators and ML features per stock
- 35+ dbt data quality tests
- Three Streamlit apps: main dashboard, trading signals, and ML trainer

## Quick Start

```bash
uv sync
python main.py all        # full pipeline
python main.py dashboard  # start Streamlit
```
