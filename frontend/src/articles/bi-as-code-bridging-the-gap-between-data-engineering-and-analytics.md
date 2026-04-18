---
title: "BI-as-Code: Bridging the Gap Between Data Engineering and Analytics"
slug: "bi-as-code-bridging-the-gap-between-data-engineering-and-analytics"
date: 2026-04-18
category: "data-quality"
excerpt: "BI-as-Code treats dashboards and metrics as version-controlled, testable, reusable code artefacts closing the last remaining gap in the modern data stack where..."
published: true
tags:
  - data-quality
  - version-control
  - bi-as-code
  - automation
  - dbt
coverImage: "https://cdn-images-1.medium.com/max/1009/1*jYbjbd4is9uu59GDoMKlog.png"
---

**BI-as-Code treats dashboards and metrics as version-controlled, testable, reusable code artefacts** closing the last remaining gap in the modern data stack where visualisation has traditionally lagged behind orchestration and transformation. If your team has adopted dbt for transformation and Airflow for pipelines, but still clicks through Tableau to update a dashboard, this article is for you. By the end, you will understand what BI-as-Code is, why it matters, and how tools like Rill Data make it practical today.

Most data teams have done the hard work of operationalising their pipelines. Ingestion is automated. Transformations are version-controlled in dbt. Tests run in CI before code merges. And then almost paradoxically the final step in the chain, the dashboard that stakeholders actually look at, is managed through a GUI with no Git history, no automated testing, and metric definitions duplicated across a dozen different views.

This article is for data engineers, analytics engineers, and platform engineers who want to apply the same software engineering discipline to their BI layer that they’ve already applied everywhere else.

---

*This article was originally published at <https://medium.com/towards-data-engineering/bi-as-code-bridging-the-gap-between-data-engineering-and-analytics-9da47a39fb8c?source=rss-670f6306e3c0------2>*
