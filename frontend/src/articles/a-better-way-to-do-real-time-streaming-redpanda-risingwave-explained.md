---
title: "A Better Way to Do Real-Time Streaming (Redpanda + RisingWave Explained)"
slug: "a-better-way-to-do-real-time-streaming-redpanda-risingwave-explained"
date: 2026-04-22
category: "risingwave"
excerpt: "If your team wants real-time streaming but keeps hitting the wall of JVM tuning, ZooKeeper management, and Flink job orchestration, this stack is worth your tim..."
published: true
tags:
  - risingwave
  - data-quality
  - data-engineering
  - red-panda
  - streaming
coverImage: "https://cdn-images-1.medium.com/max/1024/1*4Wq1KSREfuUl0fo9w9gDwQ.png"
---

> If your team wants real-time streaming but keeps hitting the wall of JVM tuning, ZooKeeper management, and Flink job orchestration, this stack is worth your time.

Redpanda + RisingWave + Grafana offers a SQL-first, operationally lean alternative to the traditional Kafka + Flink/Spark approach — without sacrificing production capability.

This article explains how each component works, why they fit together, and what adopting this combination actually looks like — using a runnable fraud detection reference architecture as the worked example throughout.

> *Redpanda + RisingWave + dbt + Grafana Fraud Detection Reference Architecture* — [https://github.com/alwyndsouza/rp-rw-fraud-monitor](https://github.com/alwyndsouza/rp-dbt-rw-fraud-monitor)

### Overview

Real-time streaming has a complexity problem. The standard Kafka + Flink/Spark combination is powerful, but it comes with significant operational weight: ZooKeeper clusters, JVM heap tuning, Flink job JAR management, separate state backends, and a skill surface wide enough to require a dedicated platform engineering team. For many organisations, that overhead is the price of admission to real-time workloads — and it’s often too high.

This article introduces a modern stack for real time streaming — **Redpanda** for event transport, **RisingWave** for streaming SQL computation, and **Grafana** for operational visibility — and explains what each component brings, how they connect, and where the trade-offs sit.

To keep concepts grounded, we use a fraud detection reference architecture [1] throughout, because it stresses the stack in the right ways: high event volume, multi-stream joins, time-windowed aggregations, and real operational stakes. But the stack doesn’t care about fraud. It cares about events. Whatever your domain, the patterns transfer.

We will cover the streaming landscape problem first, then go deep on each component, walk through the full developer experience, and close with an honest assessment of production readiness. By the end, you should have enough to decide whether this stack belongs on your evaluation list.

### The Streaming Stack Landscape: Why This Combination Exists

#### The Standard Pattern — and Its Weight

The dominant real-time streaming pattern is well established: **Kafka** handles event ingestion and durability, **Flink** (or Spark Structured Streaming) handles stateful computation, and something downstream, a data warehouse, a BI tool, a custom API — surfaces results. It works. It scales. Major companies run it in production at extraordinary volume.

But here’s what that pattern actually requires on a typical team: Kafka brokers with ZooKeeper coordination (or KRaft, which is newer and still maturing), JVM-based brokers with heap tuning and GC pressure, Flink clusters with job managers and task managers, Flink job JARs compiled and submitted through cluster management tooling, a separate state backend (RocksDB, typically) for stateful operators, and a local development story that often involves running a truncated version of the stack on a machine that starts to sound like a jet engine.

That’s before you get to the actual streaming logic.

#### Where Teams Get Stuck

The pattern breaks down most visibly in two places.

First, **local development friction**: running Kafka + Flink + dependencies locally is feasible but painful, and the gap between what runs locally and what runs in production creates a class of bugs that only appear in the pipeline.

Second, **operational specialisation**: Flink in particular has its own programming model (DataStream API or Table API), its own deployment concepts, and its own failure modes. Teams without dedicated streaming engineers often find that the logic they want to express is simple, but the operational surface required to run it is not.

#### The Bet This Stack Makes

The Redpanda + RisingWave combination is built on a specific set of bets:

* A C++ reimplementation of Kafka’s protocol can eliminate ZooKeeper and JVM overhead without sacrificing API compatibility.
* A streaming database with a PostgreSQL-compatible interface can replace Flink’s job model with SQL that any data engineer can write and maintain.
* The entire stack can run on a laptop via Docker Compose with the same architecture it uses in production.

These bets have trade-offs — we will get to those in each section. But the bet that simplicity and production capability don’t have to be in tension is what makes this combination worth understanding.

Let’s look at each component and what it brings to the table.

### Redpanda: Kafka Without the JVM

#### What It Is

**Redpanda** is a ground-up C++ rewrite of Kafka’s API. It speaks the same protocol: the same producers, the same consumers, the same Schema Registry, the same Kafka Connect interface. Any application that talks to Kafka can talk to Redpanda without modification. This isn’t a wrapper or a compatibility layer — it’s a full reimplementation, from the wire protocol down to the storage engine [2].

The architectural decision that matters most is what Redpanda *doesn’t* include: no ZooKeeper, no JVM, no multi-process broker topology. A Redpanda cluster is a set of identical C++ processes with a built-in Raft consensus protocol for leader election and replication. Each node handles what previously required coordinating a broker process, a ZooKeeper ensemble, and — in many deployments — a Schema Registry service running separately.

#### What It Eliminates

For engineers who have operated Kafka in production, “no ZooKeeper” is significant. ZooKeeper coordination has been a source of operational complexity for years: separate ZooKeeper clusters to maintain, ZooKeeper-specific failure modes to understand, and coupling between Kafka’s metadata state and ZooKeeper’s consistency model.

Apache Kafka 4.x has now made KRaft the production standard, so new Kafka deployments no longer require ZooKeeper. But “no longer required” and “already migrated” are different things — many production clusters predate KRaft and carry the operational debt of that migration path.

Redpanda’s advantage here isn’t just that it lacks ZooKeeper; it’s that it was designed without it from day one, which means no migration story, no hybrid mode phase, and no institutional memory of ZooKeeper-specific incidents to manage through.

The JVM elimination matters operationally, not just for performance. JVM-based services require heap sizing decisions upfront, GC tuning as load profiles change, and a class of memory pressure issues (GC pauses, heap exhaustion, metaspace growth) that have no direct equivalent in native binaries. Redpanda replaces this with a process that manages its own memory with predictable, low-latency characteristics.

#### What It Preserves

Here is the practical upshot: if your team has Kafka producers, Kafka consumers, or Kafka Connect pipelines, they work with Redpanda as-is. This includes tooling like kcat, Kafka UI interfaces, Schema Registry clients, and Kafka-aware Terraform providers. The compatibility story is strong enough that the reference architecture [1] uses Redpanda as a direct stand-in for Kafka across all five event streams.

#### In the Reference Architecture

In this stack, Redpanda handles five event topics — transactions, login\_events, card\_events, alert\_events, and kyc\_profile\_events; each representing a distinct event domain. Events arrive from a Python producer that simulates a realistic banking workload, with configurable transaction rates and customer pool sizes.

The **dead letter queue (DLQ)** pattern is worth calling out explicitly and worth being precise about how it works. Redpanda doesn’t automatically route malformed events to a DLQ; that routing is a deliberate design decision implemented at the application or transformation layer. In this reference architecture, the Python producer performs basic validation before publishing and routes events that fail schema checks to a separate dlq topic. For events that enter the pipeline and fail RisingWave parsing or transformation logic, the pipeline's staging layer handles the routing. It's an explicit pattern, not an implicit safety net — which means it only works if your team designs for it upfront.

This matters for two reasons: in compliance-sensitive workloads like fraud monitoring, silent event loss creates audit gaps; and in any operational pipeline, a rising DLQ rate is one of the most useful early signals that something upstream has changed.

![](https://cdn-images-1.medium.com/max/1024/1*4Wq1KSREfuUl0fo9w9gDwQ.png)

Image generated using chatgpt

The key takeaway: Redpanda’s topic structure externalises event domain separation early, which makes the downstream RisingWave pipeline easier to reason about.

#### Trade-Offs

Redpanda’s ecosystem maturity is real. Confluent has a decade of production hardening, a significantly larger library of pre-built connectors through Confluent Hub, and enterprise governance tooling — Stream Governance, advanced Data Quality Rules, audit logging — that organisations with strict compliance requirements may need.

Redpanda Cloud is newer, and while Redpanda does have robust native Tiered Storage (Shadow Indexing), the breadth of managed integrations and governance features at the Confluent enterprise tier is meaningfully wider. If your organisation is standardised on Confluent’s governance suite or depends heavily on connectors from Confluent Hub that have no Redpanda equivalent yet, that’s a real evaluation criterion.

For greenfield workloads or teams evaluating their options, though — especially those who want a simpler operational profile locally and in staging — Redpanda is a credible alternative worth benchmarking.

Redpanda gets events in. RisingWave is where the real work happens.

### RisingWave: Streaming SQL That Thinks Like a Database

#### **What It Is**

**RisingWave** is a streaming database. That distinction matters, so let’s be precise about it. It supports the **PostgreSQL dialect and wire protocol** — which means you connect to it with any Postgres client, write standard SQL, and query it exactly as you would a Postgres database. But it is not a general-purpose relational database. Under the hood it’s a purpose-built streaming engine optimised for incremental computation over continuous event streams, with state stored in S3-compatible object storage rather than local disk. The Postgres interface is a deliberate developer experience choice; the engine beneath it is built for streaming, not for transactional workloads.

A traditional stream processor like Flink operates on a DAG (directed acyclic graph) of operators — map, filter, join, aggregate — that you compose into a job, compile, and submit to a cluster. The cluster maintains state across operators using a configurable state backend, typically RocksDB on local disk, which introduces its own complexity around disk provisioning, checkpoint storage, and recovery behaviour after failures.

RisingWave inverts this model. You write a SQL query. RisingWave maintains the result. Continuously. Incrementally. You don’t submit jobs; you create materialized views [3]. The runtime decides how to execute and maintain them — and because state lives in object storage, scaling and recovery don’t require you to think about local disk at all.

#### The Core Abstraction: Materialized Views

If you have used a SQL VIEW before, you have the foundation. A regular view is a saved query — every time you query it, the database executes the underlying SQL against current data. A **materialized view** stores the result. In traditional databases, materialised views are refreshed on a schedule or on demand.

RisingWave’s materialized views are different: they update *continuously* as new events arrive. The mental model is: you write the query once, and RisingWave maintains the result as a living, always-current table that you can query at any time. This is the abstraction that eliminates the Flink job model entirely.

#### Incremental Computation

The performance story depends on understanding **incremental computation**. When a new event arrives, RisingWave doesn’t rerun the full query across the entire dataset. It processes only the *delta* — the new event and its effect on the materialized view result. For windowed aggregations over large datasets, this is the difference between microsecond update latency and second-scale batch refresh cycles.

A concrete example from the reference architecture: a velocity burst view counts transactions per customer in a 5-minute tumbling window. As each new transaction event arrives, RisingWave updates only the affected customer’s window count. The SQL looks familiar:

```
CREATE MATERIALIZED VIEW mv_velocity_burst AS
SELECT
    customer_id,
    window_start,
    window_end,
    COUNT(*) AS txn_count,
    SUM(amount) AS total_amount
FROM TUMBLE(transactions, event_time, INTERVAL '5 minutes')
GROUP BY customer_id, window_start, window_end;
```

This is the key insight about incremental computation made tangible: the TUMBLE window function defines the aggregation boundary, and RisingWave maintains the running result across those windows — not as a batch job that runs on a schedule, but as a continuously-updated state that reflects the latest events.

#### The Layered Pipeline Pattern

The reference architecture organises RisingWave into four logical layers — a pattern worth naming explicitly: this is a **Streaming Medallion Architecture**. If you have worked with Databricks, Snowflake, or a dbt-based warehouse project, the Medallion pattern (Bronze → Silver → Gold) will be immediately familiar. The streaming equivalent maps directly onto those same principles, just running continuously instead of on a schedule:

![](https://cdn-images-1.medium.com/max/1024/1*6WUvxpE9ip1UR9WPlxbY8w.png)

Image generated using chatgpt

The key takeaway: this layered approach creates clear separation between *what data is* (source tables), *what it means in context* (staging), *what patterns it exhibits* (signals), and *what action it implies* (risk/cases) — the same separation you would apply in a dbt project or a Medallion lakehouse, now running in real time.

**Source Tables** define the ingestion points — each Redpanda topic maps to a source table that RisingWave continuously reads. **Staging Views** handle enrichment joins: attaching KYC profile data to transaction events, normalising field formats, filtering invalid records. **Signal Views** contain the detection logic — the velocity bursts, the cross-channel correlations, the threshold exceedances — expressed as SQL materialized views over the staging layer. **Risk/Case Views** aggregate signals into investigation-ready outputs: case summaries, risk scores, alert counts by severity.

Each layer only depends on the layer below it. Adding a new signal view doesn’t require touching the ingestion logic. Changing an enrichment join in the staging layer cascades automatically to everything above it. The dependency graph is explicit and SQL-native.

### Why This Matters vs. Flink

For teams where **SQL fluency outweighs streaming DSL expertise** — which is most data engineering teams — RisingWave’s programming model is a significant advantage. There’s no JAR to compile, no cluster to submit to, no restart semantics to configure. An engineer who can write a dbt model can write a RisingWave materialized view with minimal ramp-up.

The state management story is also meaningfully different. Flink typically relies on RocksDB on local disk for state storage, which means provisioning disk capacity per task manager, thinking carefully about checkpoint sizes, and managing recovery behaviour after node failures. RisingWave stores its state in S3-compatible object storage. For cloud deployments, this eliminates a significant class of infrastructure decisions — storage scales independently of compute, and recovery means fetching state from object storage rather than rebuilding it from local disk.

The trade-off is real, though. Flink’s DataStream API offers expressive power that SQL cannot match: custom operators, complex stateful logic with fine-grained control over state backends, Python UDFs with arbitrary computation, and a mature ecosystem of connectors. For workloads at the frontier of streaming complexity, Flink’s expressiveness matters. For the large middle ground — windowed aggregations, stream-stream joins, enrichment pipelines, threshold monitoring — RisingWave’s SQL model covers the territory with significantly less operational overhead [4].

With events flowing through Redpanda and continuously computed in RisingWave, the final layer is making that state visible to operators.

### Grafana: Operational Visibility as a First-Class Citizen

#### What It Adds

**Grafana** connects to RisingWave directly via its PostgreSQL-compatible wire protocol. No custom connector, no intermediate export layer — Grafana queries RisingWave the same way it would query a Postgres database, using standard SQL. This means RisingWave’s materialized views are queryable from dashboards immediately, without an additional serving layer [5].

That same Postgres compatibility has a less obvious implication: **RisingWave is AI-ready out of the box**. Any tool that speaks the Postgres protocol can query it — including MCP (Model Context Protocol) servers and AI agent frameworks. If you’re building towards a world where analysts ask natural language questions against live fraud signals, or where an AI agent triggers investigation workflows based on real-time risk scores, RisingWave slots into that stack without a custom integration layer. It’s worth keeping in mind as you design the downstream interface.

The reference architecture ships with pre-provisioned dashboards defined as code — Grafana JSON datasource and dashboard definitions that are loaded automatically when the stack starts. From make up to a live operational dashboard is a single command.

#### Why Observability Belongs in the Architecture

Silent failures are the default failure mode for streaming pipelines. An upstream schema change silently writes null values into a field your detection logic depends on. A topic partition falls behind without triggering an alert. A DLQ event rate climbs because a third-party system changed its event format over the weekend. None of these generate exceptions; they generate degraded, misleading results.

Building observability in from the start — not bolted on after the first incident — is what separates a reference architecture from a demo. The stack monitors four categories of signal:

* **Consumer lag** (Redpanda): how far behind each consumer group is on each topic
* **Materialized view freshness** (RisingWave): how current the aggregated state is relative to the latest ingested events
* **DLQ event rate**: the volume of malformed or unprocessable events being routed out of the main pipeline
* **Producer throughput**: the rate and health of upstream event generation

In the fraud monitoring context, the operational dashboard surfaces active signal counts, case volumes by severity, and pipeline health in a single view. But the pattern is domain-agnostic: the same four categories of signal apply whether you’re monitoring fraud, logistics events, IoT telemetry, or user behaviour streams.

With the individual components understood, the question becomes: what does working with this stack actually feel like?

### The Full Stack in Practice: Developer Experience

#### From Clone to Dashboard in Four Commands

https://github.com/alwyndsouza/rp-rw-fraud-monitor

The entire stack — Redpanda, RisingWave, Grafana, Python producers, SQL bootstrap — runs via Docker Compose. The developer workflow is intentionally minimal:

```
make up        # Start all services
make validate  # Run smoke tests and pipeline health checks
make status    # Check service health and consumer lag
make logs      # Tail service logs
```

make up brings all services online, waits for readiness checks, and bootstraps the SQL pipeline — source tables, staging views, signal views, risk views — automatically. By the time the command returns, the pipeline is running. make validate runs smoke tests: it checks that each source table is receiving events, that materialized views are updating, and that the DLQ rate is within acceptable bounds.

These four commands cover 90% of the daily development workflow. That’s not accidental — the Makefile is a developer contract, not a convenience wrapper.

#### Local-First as a Production Philosophy

The reference architecture runs on a laptop. Not a stripped-down version of it — the same Docker Compose topology, the same SQL pipeline layers, the same Grafana dashboards. This is a deliberate architectural choice: if the local environment diverges significantly from production, the gap becomes a source of bugs that only manifest in the pipeline. Local-first means the architecture is the same; only the resource limits and external dependencies differ.

#### Configuration-Driven Behaviour

Fraud rate, transaction rate, customer pool size, and event domain weightings are all driven by environment variables. Testing a high-volume burst scenario means changing TRANSACTION\_RATE\_PER\_SECOND=500 and restarting the producer — no code changes. This matters during development when you want to exercise the pipeline under different load profiles, and it matters in CI/CD when you want to run smoke tests at a controlled, deterministic rate.

#### CI/CD Integration

GitHub Actions pipelines cover SQL lint (validating DDL syntax before it reaches a running cluster), unit tests on producer logic, and pipeline smoke tests that boot the stack, run the validator, and report results. The same checks run locally via make validate. When the local and CI/CD environments execute the same tests, the definition of "this works" is shared — not assumed.

Taking this stack to production requires a few more conversations.

### Production Readiness: What the Reference Architecture Gives You and What It Doesn’t

#### What’s Already Production-Oriented

The reference architecture is not a toy. Several production-grade patterns are already present:

* **DLQ with explicit routing** — malformed events are captured, not lost
* **Health check endpoints** on all services — suitable for Kubernetes liveness and readiness probes
* **Version-pinned service images** — no latest tags introducing silent breaking changes
* **Resource limit placeholders** in the Docker Compose configuration — ready to be filled with production values
* **CI/CD gates** for SQL and code quality — the same checks that run locally

#### What You Need to Add

The reference architecture is production-*oriented*, not production-*complete*. The distinction matters when building a deployment plan:

* **TLS and SASL** for Redpanda — the default configuration is unauthenticated, appropriate for local dev, not for production
* **Secret management** — credentials and connection strings should move to a secrets manager (AWS Secrets Manager, HashiCorp Vault) rather than environment files
* **Kubernetes manifests** — the Docker Compose topology translates to Kubernetes, but you’ll need to write the manifests, configure persistent volumes, and add autoscaling policies
* **State backend considerations** for RisingWave at scale — particularly if you’re running large windowed aggregations with long retention windows
* **Schema evolution strategy** — while the stack supports Schema Registry for schema enforcement, your team needs to define compatibility rules (Backward, Forward, or Full) before the first production event is fired. A schema change that breaks a downstream materialized view in production is significantly harder to recover from than one caught in a dev environment with a clear compatibility contract

### Managed Service Options

For teams who want the stack’s operational profile without self-managing clusters: **Redpanda Cloud** offers a managed Kafka-compatible service with the same API. **RisingWave Cloud** offers managed RisingWave. Both are newer than the Confluent/Databricks managed offerings but are actively developed and production-viable for teams willing to be on a slightly earlier adoption curve.

### Practical Takeaways

Now that you understand the full stack, here’s how to put it to use:

1. **Clone and run the reference architecture locally** [1]. The make up → make validate workflow takes less than ten minutes on a modern laptop. Seeing the full pipeline in operation — events flowing through Redpanda into RisingWave materialized views, surfaced in live Grafana dashboards — is worth more than any architectural description.
2. **Use the layered MV pipeline pattern in your own workloads**. Source → Staging → Signal → Output is a generalizable pattern for any event-driven domain. The separation of concerns it provides scales to complex pipelines without becoming unmaintainable.
3. **Evaluate Redpanda as a Kafka drop-in**. Especially if your team is operating self-managed Kafka and spending meaningful engineering time on ZooKeeper coordination or JVM tuning, Redpanda is worth a proof of concept. The API compatibility means the evaluation risk is low.
4. **Evaluate RisingWave as a Flink alternative** — specifically for workloads where SQL fluency is higher than streaming DSL expertise. If your team can write dbt models, they can write RisingWave materialized views. The operational simplicity is real. The SQL expressiveness limits are also real — test your most complex logic before committing.

### References

[1] Alwyn D’Souza — *rp-rw-fraud-monitor: Redpanda + RisingWave + Grafana Fraud Detection Reference Architecture* — <https://github.com/alwyndsouza/rp-rw-fraud-monitor>

[2] Redpanda — *Redpanda Documentation: Architecture Overview* — <https://docs.redpanda.com>

[3] RisingWave — *RisingWave Documentation: Materialized Views* — <https://docs.risingwave.com>

[4] RisingWave — *RisingWave vs. Apache Flink: A Comparison* — <https://docs.risingwave.com/docs/current/risingwave-flink-comparison/>

[5] Grafana — *Grafana Documentation: PostgreSQL Data Source* — <https://grafana.com/docs/grafana/latest/datasources/postgres/>

*Alwyn D’Souza specialices in real-time streaming architectures, data mesh, and AI/agentic systems. He writes about modern data stack engineering on Medium (*[*@aradsouza*](https://medium.com/@aradsouza)*) and shares technical content on* [*LinkedIn*](https://www.linkedin.com/in/alwynanildsouza/) *and*[*GitHub*](https://github.com/alwyndsouza)*.*

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=465f780b5012)

---

[A Better Way to Do Real-Time Streaming (Redpanda + RisingWave Explained)](https://blog.dataengineerthings.org/a-better-way-to-do-real-time-streaming-redpanda-risingwave-explained-465f780b5012) was originally published in [Data Engineer Things](https://blog.dataengineerthings.org) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---

*This article was originally published at <https://blog.dataengineerthings.org/a-better-way-to-do-real-time-streaming-redpanda-risingwave-explained-465f780b5012?source=rss-670f6306e3c0------2>*
