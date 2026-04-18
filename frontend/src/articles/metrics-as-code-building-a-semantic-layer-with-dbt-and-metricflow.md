---
title: "Metrics as Code: Building a Semantic Layer With dbt and MetricFlow"
slug: "metrics-as-code-building-a-semantic-layer-with-dbt-and-metricflow"
date: 2026-03-14
category: "data"
excerpt: "The Idea in One Sentence  A semantic layer lets you define business metrics — revenue, active users, conversion rate, whatever matters to your organisation — on..."
published: true
tags:
  - data
  - data-governance
  - dbt
coverImage: "https://cdn-images-1.medium.com/max/1890/1*XjQA3WpUyMw1JGdMY1L4jg.png"
---

## The Idea in One Sentence

A semantic layer lets you define business metrics — revenue, active users, conversion rate, whatever matters to your organisation — **once, as code**, and serve them consistently to every tool and consumer in your data stack.

That’s the pitch. This article is the practice. I’ll walk through the mechanics of building a semantic layer using dbt, MetricFlow, and semantic models – the actual components, how they fit together, and the decisions you’ll face along the way.

No vendor evangelism. Just the architecture and the trade-offs.

## Why Metrics Belong in the Transformation Layer

If you have worked in data for any length of time, you have encountered the metric consistency problem. Revenue means one thing in the finance dashboard and another thing in the marketing report. Customer count includes trial users in one tool and excludes them in another. Everyone is technically “correct” — they’re just using different definitions.

The root cause is that most organisations define metrics at the **BI layer** — inside their visualisation tools. This means definitions are tool-specific, not version-controlled, and invisible to non-BI consumers like AI agents…

---

*This article was originally published at <https://medium.com/towards-data-engineering/metrics-as-code-building-a-semantic-layer-with-dbt-and-metricflow-93d7e29e6ab3?source=rss-670f6306e3c0------2>*
