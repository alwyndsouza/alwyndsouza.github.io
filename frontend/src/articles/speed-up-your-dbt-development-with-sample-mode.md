---
title: "Speed Up Your dbt Development with Sample Mode"
slug: "speed-up-your-dbt-development-with-sample-mode"
date: 2025-12-07
category: "code-quality"
excerpt: "We have all been there. You make a small change to your dbt model, run dbt build, and then wait. And wait. Sometimes for minutes, sometimes longer. Meanwhile, y..."
published: true
tags:
  - code-quality
  - ci-cd-pipeline
  - developer-experience
  - speed
  - dbt
coverImage: "https://cdn-images-1.medium.com/max/2018/1*PO39m9rVniIUkhLWH2_k1g.png"
---

We have all been there. You make a small change to your dbt model, run `dbt build`, and then wait. And wait. Sometimes for minutes, sometimes longer. Meanwhile, your cloud warehouse is churning through millions of rows just so you can verify a simple join logic or test a new transformation.

What if you could slash that development time dramatically?

The `--sample` flag is a powerful new addition to dbt that changes the game for development workflows. This feature lets you work with time-filtered subsets of your data during development, dramatically reducing build times and warehouse compute costs.

Instead of processing your entire dataset every time you test a change, sample mode lets you work with recent data that’s actually relevant to your development needs. Think of it as a fast-forward button for your development cycle.

Sample mode uses **time-based filtering** rather than row limiting. You specify a time period, and dbt automatically filters your source tables and models to include only data within that timeframe.

The flag is available for `dbt run` and `dbt build` commands:

---

*This article was originally published at <https://medium.com/towards-data-engineering/speed-up-your-dbt-development-with-sample-mode-fbf9ec131a9d?source=rss-670f6306e3c0------2>*
