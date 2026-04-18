---
id: "dbt-synthetic-data"
title: "dbt Synthetic Data Generator"
description: "An automated star-schema data generator for dbt and DuckDB — producing realistic, referentially-intact dimension and fact tables for testing and development."
status: production
category: "data-engineering"
featured: false
draft: false
order: 7
tech:
  - Python
  - dbt
  - DuckDB
  - Parquet
links:
  github: "https://github.com/alwyndsouza/dbt_synthetic_data"
---

Generates ~500 MB of realistic, interconnected star-schema data for dbt + DuckDB development and testing.

**Schema:** 4 dimension tables (users, products, locations, devices) and 3 fact tables (transactions, sessions, events) — from 100 rows up to 5M. All output is Parquet, queried directly via `read_parquet()` in dbt models.

**Data quality built in:** referential integrity between all foreign keys, temporal consistency, and realistic business distributions (premium users at 3× transaction volume, mobile generating 60% of events, weekday peaks, seasonal Q4 spikes).

## Quick Start

```bash
git clone https://github.com/alwyndsouza/dbt_synthetic_data.git
cd dbt_synthetic_data
make setup   # installs dependencies and generates all data
```
