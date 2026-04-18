---
id: "dbt-cicd-pipeline-slim-ci"
title: "dbt CI/CD Pipeline with Slim CI"
description: "A production-ready CI/CD pipeline for dbt projects using GitHub Actions and Slim CI — running only modified models and their downstream dependencies to cut build times and warehouse costs."
status: production
category: "data-engineering"
featured: true
draft: false
order: 1
tech:
  - dbt
  - GitHub Actions
  - Databricks
  - Python
  - SQLFluff
  - dbt-checkpoint
  - Prettier
  - pre-commit
links:
  github: "https://github.com/alwyndsouza/dbt-ci-cd"
---

A production-ready CI/CD pipeline for dbt projects on Databricks — running quality checks and deploying only what changed.

The pipeline triggers on pushes to `dev` and `feature/*` branches, and PRs targeting `main`. Five sequential GitHub Actions jobs handle everything end-to-end:

| Job | What it does |
|---|---|
| Setup & Validation | Checkout, file change detection, Python env |
| Pre-commit | Code quality hooks on modified files only |
| Prettier | YAML formatting compliance |
| dbt Build & Test | Runs models in a temp schema, auto-cleans up |
| Summary | Pipeline status and artifact reporting |

## Quality Tools

- **SQLFluff** — SQL linting with project-specific rules (`.sqlfluff`)
- **dbt-checkpoint** — dbt-specific validations (model configs, test coverage)
- **Prettier** — consistent YAML/JSON formatting via npm
- **pre-commit** — enforces all checks locally before push

## Quick Start

**Requirements:** Python 3.8+, Node.js 16+, Databricks workspace

```bash
pip install -r requirements.txt
npm install
pre-commit install
```

Set three GitHub secrets: `DBT_HOST`, `DBT_HTTP_PATH`, `DBT_TOKEN`.

Run checks locally:

```bash
pre-commit run --all-files
npm run format:check:dbt   # check YAML
npm run format:dbt         # auto-fix YAML
```
