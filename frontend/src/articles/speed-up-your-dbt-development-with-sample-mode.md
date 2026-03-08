---
title: "Speed Up Your dbt Development with Sample Mode"
slug: "speed-up-your-dbt-development-with-sample-mode"
date: 2025-12-07
category: "data-engineering"
excerpt: "We have all been there. You make a small change to your dbt model, run dbt build, and then wait. And wait. Sometimes for minutes, sometimes longer. Meanwhile, y..."
published: true
tags:
  - data-engineering
  - dbt
  - analytics
coverImage: "https://cdn-images-1.medium.com/max/800/1*PO39m9rVniIUkhLWH2_k1g.png"
---
We have all been there. You make a small change to your dbt model, run `dbt build`, and then wait. And wait. Sometimes for minutes, sometimes longer. Meanwhile, your cloud warehouse is churning through millions of rows just so you can verify a simple join logic or test a new transformation.

What if you could slash that development time dramatically?

### Introducing the — sample Flag

The `--sample` flag is a powerful new addition to dbt that changes the game for development workflows. This feature lets you work with time-filtered subsets of your data during development, dramatically reducing build times and warehouse compute costs.

Instead of processing your entire dataset every time you test a change, sample mode lets you work with recent data that’s actually relevant to your development needs. Think of it as a fast-forward button for your development cycle.

### How Sample Mode Works

Sample mode uses **time-based filtering** rather than row limiting. You specify a time period, and dbt automatically filters your source tables and models to include only data within that timeframe.

The flag is available for `dbt run` and `dbt build` commands:

```
dbt build --sample="3 days"
```

This samples data from the last 3 days across your entire project. Your source tables get filtered, and that reduced dataset flows through all your downstream models automatically.

### Configuring Event Time

Because sample mode uses time-based filtering, you need to specify which timestamp column to use. This is done through the `event_time` configuration on your models and sources:

```
models:
 - name: stg_orders
 config:
 event_time: order_created_at
```

This tells dbt which column to use when applying the time filters during sampling.

### Two Sampling Approaches

Sample mode supports two ways to specify time ranges:

**Relative Time Specs** — Filter data backwards from when you run the command:

```
dbt run --sample="6 hours"
dbt run --sample="3 days"
dbt run --sample="2 months"
```

Supported granularities: hours, days, months, years

**Static Time Specs** — Define an exact time window:

```
dbt run --sample="{'start': '2024-07-01', 'end': '2024-07-08 18:00:00'}"
```

This approach is perfect when you want to test your models against a specific period, like your busiest week or a time when you know edge cases occurred.

### Real Impact on Development Speed

Let’s talk about what this means in practice. Imagine you’re working on a large fact table with billions of rows that typically takes 8 minutes to build. With sample mode filtering to just 3 days of data, that same model might build in under a minute.

For a typical development session where you’re iterating on logic, testing edge cases, and refining transformations, you might run `dbt build` a dozen times. Without sampling, that's over an hour and a half of waiting. With sampling? Maybe 15 minutes.

That’s time you get back to actually think about your data models, not watch progress bars.

### Perfect for CI/CD Pipelines

Sample mode isn’t just for local development. It’s a powerful tool for your continuous integration pipelines. When a developer opens a pull request, your CI system can run a quick sanity check using sampled data before committing to a full build.

This creates a faster feedback loop. Developers know within minutes if their changes break anything, rather than waiting for a full data refresh. You catch syntax errors, logical mistakes, and broken references early — when they’re cheapest to fix.

![](https://cdn-images-1.medium.com/max/800/1*oCUbwMsEvx_bOibEsAB4Jw.png)

### Working with Recent Data

Here’s where sample mode really shines: when you use relative time specifications like “3 days”, you’re automatically working with your most recent data patterns. This often makes your testing more relevant than running against years of historical data.

Recent data reflects:

* Current business patterns and seasonality
* Latest schema changes
* Recent edge cases and data quality issues
* Active customer behavior

This isn’t just faster — it’s often more meaningful for development and testing purposes.

### Controlling What Gets Sampled

Sometimes you don’t want certain refs to be sampled. Maybe it’s a small dimension table, or a critical reference that needs full data. You can prevent sampling by appending `.render()`:

```
with source as (
 select * from {{ ref('stg_customers').render() }}
),
...
```

This gives you surgical control over which parts of your DAG use sampled data.

### When to Use Sample Mode

Sample mode excels in specific scenarios:

**During active development**: When you’re iterating on model logic and need quick feedback loops.

**In CI/CD checks**: For fast validation before running full production builds.

**For schema testing**: When you need to verify column names, data types, and basic transformations.

**While debugging**: To quickly reproduce issues without waiting for full data processing.

### When Full Data Matters

Of course, sample mode isn’t appropriate everywhere. Before merging to production, run your full test suite against complete datasets. Use sample mode for speed during development, but validate thoroughly before deployment.

Similarly, for data quality checks that need to catch rare edge cases, or for aggregations where sampling might skew results, stick with full builds.

![](https://cdn-images-1.medium.com/max/800/1*AZE0cFcN-rC1GLrwo7XhlA.png)

### Important Limitations

Keep in mind that sample mode:

* Is **not currently available for Python models** — the flag will be ignored if used
* Uses **time-based sampling only** — you need timestamp columns configured via `event_time`
* May not populate all joins if your time ranges don’t align perfectly across tables
* Seeds are created normally but sampled when referenced by downstream models

### References

[**About the sample flag | dbt Developer Hub**\
*Use the sample flag to lower development time and reduce warehouse spend.*docs.getdbt.com](https://docs.getdbt.com/docs/build/sample-flag "https://docs.getdbt.com/docs/build/sample-flag")[**Sample Mode (for faster Development and CI 🚀) · dbt-labs dbt-core · Discussion #11200**\
*Have you ever wanted to run a smaller slice of your project during development? It would be faster and cheaper if you…*github.com](https://github.com/dbt-labs/dbt-core/discussions/11200 "https://github.com/dbt-labs/dbt-core/discussions/11200")

---

*This article was originally published at <https://medium.com/@aradsouza/speed-up-your-dbt-development-with-sample-mode-fbf9ec131a9d>*
