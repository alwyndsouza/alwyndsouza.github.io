---
title: "dbt-checkpoint — Improve Data Quality"
slug: "dbt-checkpoint-improve-data-quality"
date: 2024-11-05
category: "data-quality"
excerpt: "Data is the lifeblood of good decision-making, but it’s like food: if it’s rotten, it can make you sick. That’s where data quality comes in. It’s all about maki..."
published: true
tags:
  - data-quality
  - testing
  - validation
coverImage: ""
---
### Overview

Data is the lifeblood of good decision-making, but it’s like food: if it’s rotten, it can make you sick. That’s where **data quality** comes in. It’s all about making sure our data is **accurate, consistent, and reliable**.

As data grows , it becomes more and more difficult to keep up to date with new data models and sources, leading to issues like:

* Metrics calculated incorrectly due to misunderstanding of business or simple error on calculation
* Ambiguous column/table naming. We assume a field means something it doesn’t. Attributes are not easy to discover, causing column duplication
* Documentation on the models not upto date leading to inconsistent understanding and confusions

Ensuring data quality is crucial because inaccuracies in the data ecosystem can have far-reaching implications. Incorrect data not only erodes trust in the organizational data but also undermines efforts to **foster a>But not all hope is lost, we can still do something to prevent these problems before they arise and that’s where **dbt-checkpoint** can come to our rescue.**

> dbt-checkpoint provides [pre-commit](https://pre-commit.com/ "https://pre-commit.com/") hooks to ensure the quality of your [dbt](https://www.getdbt.com/ "https://www.getdbt.com/") projects.

> `dbt` is awesome, but when the number of models, sources, and macros in a project grows, it becomes challenging to maintain the same level of quality across developers.. Users forget to update columns in property(yml) files or add table and column add descriptions. Without automation the reviewer workload increases and unintentional errors may be missed. dbt-checkpoint allows organizations to add automated validations improving your code review and release process.

### Deep dive into dbt-checkpoint

### Install

For detailed installation and usage, instructions see [pre-commit.com](https://pre-commit.com/ "https://pre-commit.com/") site.

`pip install pre-commit`

### Setup

1. Create a file named `.pre-commit-config.yaml` in your project root folder.
2. Add [list of hooks](https://github.com/dbt-checkpoint/dbt-checkpoint?tab=readme-ov-file#list-of-dbt-checkpoint-hooks "https://github.com/dbt-checkpoint/dbt-checkpoint?tab=readme-ov-file#list-of-dbt-checkpoint-hooks") you want to run before every commit. E.g.:

```
repos:
- repo: https://github.com/dbt-checkpoint/dbt-checkpoint
 rev: v1.2.0
 hooks:
 - id: check-script-semicolon
 - id: check-script-has-no-table-name
 - id: dbt-test
 - id: dbt-docs-generate
 - id: check-model-has-all-columns
 name: Check columns - core
 files: ^models/core
```

3. Optionally, run `pre-commit install` to set up the git hook scripts. With this, `pre-commit` will run automatically on `git commit`! You can also manually run `pre-commit run` after you `stage` all files you want to run. Or `pre-commit run --all-files` to run the hooks against all of the files (not only `staged`).

### Housekeeping for pre-commit

`pre-commit autoupdate`

This command is also useful if you do not know what version is appropriate for the hooks you wish to use. If in doubt. Set rev: 0.0.1 and run pre-commit autoupdate.

---

*This article was originally published at <https://medium.com/@aradsouza/dbt-checkpoint-improve-data-quality-9e07fd4f0fa4>*
