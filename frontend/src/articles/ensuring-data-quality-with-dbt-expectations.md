---
title: "Ensuring Data Quality with dbt-expectations"
slug: "ensuring-data-quality-with-dbt-expectations"
date: 2025-03-07
category: "data-quality"
excerpt: "In the world of data engineering, ensuring the accuracy and reliability of your data is paramount. Enter dbt-expectations, an extension package for dbt (data bu..."
published: true
tags:
  - data-quality
  - testing
  - validation
coverImage: ""
---
In the world of data engineering, ensuring the accuracy and reliability of your data is paramount. Enter dbt-expectations, an extension package for dbt (data build tool), inspired by the Great Expectations package for Python. This powerful tool allows dbt users to deploy Great Expectations-like tests directly within their data warehouse, eliminating the need for additional integrations.

#### Why Use dbt-expectations?

Data quality is critical for making informed business decisions. dbt-expectations provides a robust framework for defining and validating expectations for your data. Whether it’s the expected number of rows in a table or the expected value of a column, dbt-expectations ensures your data meets these criteria and reports any discrepancies.

#### Installing the Package

To get started with dbt-expectations, you need to add it to your `packages.yml` file in your dbt project folder. Here’s how:

```
packages:
 - package: calogica/dbt_expectations
 version: [">=0.10.0", "<0.11.0"]
```

Next, define the necessary variables in your `dbt_project.yml` file:

```
vars:
 'dbt_date:time_zone': 'Australia/Sydney'
```

You can specify any valid timezone string in place of `Australia/Sydney`. For example, use `America/New_York` for East Coast Time.

Once you have set up the project definition, install the package using the following command:

```
dbt deps
```

With the package installed, you can now leverage a powerful arsenal of tests to ensure your data’s integrity.

#### Writing Tests

dbt-expectations allows you to define tests at both the model and column levels. Here’s an example to illustrate:

```
model:
 - name: my_test_model
 description: this is a test model for demo purposes
 tests:
 - dbt_expectations.expect_table_row_count_to_equal_other_table:
 compare_model: ref("staging_accountd")
 - dbt_expectations.expect_grouped_row_values_to_have_recent_data:
 group_by: [group_id]
 timestamp_column: date_day
 datepart: day
 interval: 1
 row_condition: "id is not null" # optional
 columns:
 - name: created_at
 tests:
 - dbt_expectations.expect_column_values_to_be_of_type:
 column_type: timestamp
 - dbt_expectations.expect_row_values_to_have_recent_data:
 datepart: hour
 interval: 3
```

In this example, we define a model named `my_test_model` with two table-level tests and two column-level tests. The table-level tests ensure the row count matches another table and that grouped row values have recent data. The column-level tests check that the `created_at` column values are of type `timestamp` and that the row values have recent data within the last three hours.

dbt-expectations is a powerful tool for maintaining data quality within your dbt projects. By integrating Great Expectations-like tests directly into your data warehouse, you can ensure your data is accurate, reliable, and ready for analysis. Start using dbt-expectations today to take your data quality to the next level!

---

*This article was originally published at <https://medium.com/@aradsouza/ensuring-data-quality-with-dbt-expectations-4918a98a870d>*
