---
id: "rp-dbt-rw-fraud-monitor"
title: "SQL-First Real-Time Fraud Detection"
description: "Production-oriented reference architecture for real-time fraud detection using Redpanda, dbt, RisingWave, and Grafana"
status: production
category: "data-engineering"
featured: true
draft: false
order: 0
tech:
  - Redpanda
  - RisingWave
  - dbt
  - Grafana
  - Python
links:
  github: "https://github.com/alwyndsouza/rp-dbt-rw-fraud-monitor"
coverImage: ""
---

A production-oriented, local-first reference architecture for real-time fraud detection. The system uses **Redpanda** for event transport via the Kafka API, **RisingWave** for continuous SQL and materialized views, **Grafana** for operational dashboards, and a **Python** producer for synthetic banking event generation.

## Architecture

The pipeline follows a four-stage data transformation model:

1. **Producer** — Python generates transactions, logins, card events, alerts, and KYC updates
2. **Event Broker** — Redpanda buffers and distributes events across topics; malformed events route to a Dead Letter Queue
3. **Stream Processing** — RisingWave consumes topics into sources and transforms data through staging, signal, and risk/case materialized views
4. **Observability** — Grafana queries RisingWave directly for live operational dashboards

## Fraud Detection Capabilities

The system implements detection logic for:

- Velocity bursts and transaction rate spikes
- Geographic impossibility checks
- Account takeover indicators
- Card-not-present transaction anomalies
- Brute-force login detection
- Structuring and smurfing patterns
- Correlated multi-alert analysis

## Quick Start

```bash
git clone https://github.com/alwyndsouza/rp-dbt-rw-fraud-monitor
make up        # start the stack (wait 90–120s)
make validate  # verify everything is running
```

Key commands: `make status`, `make kpis`, `make risk`, `make psql`, `make ci` (runs pytest, ruff, SQL validation, and dbt tests).

## Design Goals

Built for platform engineering and fraud analytics teams who need a runnable streaming baseline with clear lineage, observability, and extensible detection rules — without the operational overhead of a JVM-heavy Kafka + Flink stack.
