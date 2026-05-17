---
id: "mds-duckdb-semantic-layer"
title: "Modern Data Stack: DuckDB Semantic Layer"
description: "A local-first Modern Data Stack reference using dlt for ingestion, dbt for transformation, and DuckDB as the engine — with a MetricFlow semantic layer and Rill dashboards."
status: production
category: "data-engineering"
featured: true
draft: false
order: 5
tech:
  - dbt
  - DuckDB
  - dlt
  - MetricFlow
  - Rill
  - Python
links:
  github: "https://github.com/alwyndsouza/mds-duckdb-semantic-layer"
---

A fully local Modern Data Stack reference implementation — no cloud account required. Everything runs against a single DuckDB file.

The pipeline follows a three-layer architecture:

| Layer | Tool | What it does |
|---|---|---|
| Ingestion | dlt | Loads raw data into DuckDB bronze tables |
| Transformation | dbt-core + dbt-duckdb | Stages, transforms, and materialises mart tables |
| Presentation | Rill | Connects directly to the semantic layer for dashboards |

A MetricFlow semantic layer sits on top of the marts, providing standardised metric definitions across revenue, customer segmentation, and store performance.

## Quick Start

**Requirements:** Python 3.11+, `uv`

```bash
uv venv && source .venv/bin/activate
make install && make run
make rill-dev   # dashboards at localhost:9009
```
