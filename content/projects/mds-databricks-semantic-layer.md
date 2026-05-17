---
id: "mds-databricks-semantic-layer"
title: "Modern Data Stack: Databricks Semantic Layer"
description: "Production-grade Modern Data Stack reference on Databricks Unity Catalog — Medallion architecture with dlt ingestion, dbt transformation, MetricFlow metrics, and GitHub Actions CI/CD."
status: production
category: "data-engineering"
featured: true
draft: false
order: 6
tech:
  - dbt
  - Databricks
  - dlt
  - MetricFlow
  - Unity Catalog
  - GitHub Actions
  - Python
links:
  github: "https://github.com/alwyndsouza/mds-databricks-semantic-layer"
---

A production-grade Modern Data Stack reference on Databricks, implementing Medallion Architecture within Unity Catalog.

| Layer | Tool | What it does |
|---|---|---|
| Ingestion | dlt | Schema-aware loading into Bronze Delta tables |
| Transformation | dbt-core | Silver staging → Gold analytics marts |
| Governance | Unity Catalog | Lineage tracking and access control |
| Metrics | MetricFlow | Centralised semantic layer |
| CI/CD | GitHub Actions | Automated validation on every push |

Incremental processing is built in — dlt metadata tracks what's already loaded, and dbt models run only against new data.

## Quick Start

```bash
make install
# Configure .env with Databricks credentials
make run
make query-marts
```
