---
title: "How to Use the zip function in dbt"
slug: "how-to-use-the-zip-function-in-dbt"
date: 2025-04-04
category: "data-engineering"
excerpt: "The zip function in dbt is a context method that allows you to combine multiple iterables (like lists) into a single iterator of tuples. Each tuple contains ele..."
published: true
tags:
  - data-engineering
  - dbt
  - analytics
coverImage: ""
---
> dbt (data build tool) is a powerful tool for transforming data in your warehouse. One of the lesser-known but incredibly useful features in dbt is the **zip** function, which can be used within Jinja templates to combine multiple lists into a single iterable of tuples.

#### What is the zip Function?

The zip function in dbt is a context method that allows you to combine multiple iterables (like lists) into a single iterator of tuples. Each tuple contains elements from the input iterables at the same position. This can be particularly useful when you need to iterate over multiple lists simultaneously in your dbt models.

#### Basic Usage

Let’s start with a simple example. Suppose you have two lists: one containing names and another containing corresponding ages. You can use the zip function to combine these lists into a single iterable of tuples.

```
{% set names = ['Alice', 'Bob', 'Charlie'] %}
{% set ages = [25, 30, 35] %}
{% set combined = zip(names, ages) | list %}

{% for name, age in combined %}
 {{ name }} is {{ age }} years old.
{% endfor %}
```

In this example, the zip function combines the names and ages lists into a list of tuples: `[('Alice', 25), ('Bob', 30), ('Charlie', 35)]`. The for loop then iterates over these tuples, allowing you to access both the name and age in each iteration.

#### Dynamic Column Selection and Aggregation

Suppose you have a list of metrics and corresponding tables, and you want to generate a SQL query that calculates the sum of each metric from its respective table. Here’s how you can use the zip function to achieve this:

```
{% set metrics = ['revenue', 'profit', 'expenses'] %}
{% set tables = ['sales', 'finance', 'costs'] %}
{% set combined = zip(metrics, tables) | list %}

WITH aggregated_data AS (
{% for metric, table in combined %}
 SELECT
 '{{ metric }}' AS metric_name,
 SUM({{ metric }}) AS total_value
 FROM {{ table }}
 {% if not loop.last %} UNION ALL {% endif %}
{% endfor %}
)

SELECT
 metric_name,
 total_value
FROM aggregated_data
ORDER BY metric_name;
```

> **Generated SQL will be :**

```
WITH aggregated_data AS (
 SELECT
 'revenue' AS metric_name,
 SUM(revenue) AS total_value
 FROM sales
 UNION ALL
 SELECT
 'profit' AS metric_name,
 SUM(profit) AS total_value
 FROM finance
 UNION ALL
 SELECT
 'expenses' AS metric_name,
 SUM(expenses) AS total_value
 FROM costs
)

SELECT
 metric_name,
 total_value
FROM aggregated_data
ORDER BY metric_name;
```

This example demonstrates how the zip function can be used to dynamically generate SQL code for more complex data transformations in dbt models.

### References

[**About zip context method | dbt Developer Hub**\
*Use this context method to return an iterator of tuples.*docs.getdbt.com](https://docs.getdbt.com/reference/dbt-jinja-functions/zip "https://docs.getdbt.com/reference/dbt-jinja-functions/zip")

<https://github.com/dbt-labs/dbt-core/pull/5107>

---

*This article was originally published at <https://medium.com/@aradsouza/how-to-use-the-zip-function-in-dbt-a3f1a2c53109>*
