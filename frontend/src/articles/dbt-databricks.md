---
title: "Using dbt with Databricks — A Practical Guide"
slug: "dbt-databricks"
date: 2025-03-01
category: Data Engineering
excerpt: "A step-by-step walkthrough of integrating dbt Core with a Databricks lakehouse, covering project setup, model layering, and CI/CD pipelines."
published: true
tags:
  - dbt
  - Databricks
  - SQL
  - Data Engineering
---

dbt (data build tool) has become the standard for SQL-based data transformation.
When paired with Databricks, it enables a powerful, scalable lakehouse transformation
layer with version control, testing, and documentation built in.

## Prerequisites

- A Databricks workspace with a running cluster or SQL warehouse
- Python 3.9+ installed locally
- A Databricks personal access token (PAT)
- dbt-databricks adapter installed

## Installation

Install the dbt adapter for Databricks using pip:

```bash
pip install dbt-databricks
```

Verify the installation:

```bash
dbt --version
```

## Project Setup

Initialise a new dbt project:

```bash
dbt init my_dbt_project
```

When prompted, select `databricks` as the database type. dbt creates a
`profiles.yml` file (in `~/.dbt/`) and a project directory with the standard layout.

### profiles.yml

```yaml
my_dbt_project:
  target: dev
  outputs:
    dev:
      type: databricks
      host: <your-workspace-host>.azuredatabricks.net
      http_path: /sql/1.0/warehouses/<warehouse-id>
      token: "{{ env_var('DBT_DATABRICKS_TOKEN') }}"
      catalog: main
      schema: dbt_dev
      threads: 4
```

Store your token as an environment variable rather than hardcoding it.

## Model Layering

A clean medallion architecture works well with dbt and Databricks. Organise models into three layers:

- **Staging (`stg_`)** — light cleaning, renaming, type casting from raw sources
- **Intermediate (`int_`)** — business logic joins and aggregations
- **Mart (`fct_` / `dim_`)** — final analytical tables consumed by BI tools

### Example staging model

```sql
-- models/staging/stg_orders.sql
{{ config(materialized='view') }}

select
    order_id::bigint            as order_id,
    customer_id::bigint         as customer_id,
    order_date::date            as order_date,
    total_amount::decimal(18,2) as total_amount,
    status                      as order_status
from {{ source('raw', 'orders') }}
```

### Example mart model

```sql
-- models/marts/fct_daily_revenue.sql
{{ config(materialized='table') }}

select
    order_date,
    sum(total_amount) as daily_revenue,
    count(order_id)   as order_count
from {{ ref('stg_orders') }}
where order_status = 'completed'
group by 1
```

## Adding Tests

dbt ships with built-in generic tests. Define them in a YAML schema file alongside your models:

```yaml
# models/staging/schema.yml
version: 2

models:
  - name: stg_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: order_status
        tests:
          - accepted_values:
              values: ['pending', 'completed', 'cancelled']
```

Run all tests:

```bash
dbt test
```

## CI/CD with GitHub Actions

Automate dbt runs on every pull request using GitHub Actions:

```yaml
# .github/workflows/dbt-ci.yml
name: dbt CI

on:
  pull_request:
    branches: [main]

jobs:
  dbt-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install dbt-databricks
      - run: dbt deps
      - run: dbt build --target ci
    env:
      DBT_DATABRICKS_TOKEN: ${{ secrets.DBT_DATABRICKS_TOKEN }}
```

## Key Takeaways

- Use Unity Catalog as the default catalog for governance and lineage
- Prefer SQL warehouses over clusters for dbt runs — they are cheaper and scale to zero
- Use `incremental` materialisation with `merge` strategy for large tables
- Add sources and expose them with `freshness` checks for data quality monitoring
- Generate and host dbt docs as a static site alongside your dbt project
