---
title: "Implementing Data Contracts with dbt: From Theory to Practice"
slug: "implementing-data-contracts-with-dbt-from-theory-to-practice"
date: 2025-12-01
category: "data-architecture"
excerpt: "Real code, real patterns, real results"
published: true
tags:
  - data-architecture
  - data-strategy
coverImage: "https://cdn-images-1.medium.com/max/800/1*hO1A1yGBeyos4sluhuHC5Q.png"
---
***Real code, real patterns, real results***

You understand the concept of data contracts. You’re convinced that shift left governance is the right direction. Now comes the practical question: “How do I actually implement this?”

> [Data Contracts: The Missing Link in Your Data Engineering Strategy](https://medium.com/@aradsouza/data-contracts-the-missing-link-in-your-data-engineering-strategy-7dbc1e95e208)

> [Shift Left Governance: Why You Are Fixing Data Problems at the Wrong Time](https://medium.com/@aradsouza/shift-left-governance-why-you-are-fixing-data-problems-at-the-wrong-time-dbaf7895520d)

If your data transformation layer uses dbt — and increasingly, it probably does — you’re in luck. dbt has native support for data contracts that makes enforcement straightforward and integrates seamlessly with your existing workflows.

This article walks through the technical implementation, from basic concepts to advanced patterns, with real examples you can adapt for your own projects.

### Why dbt for Data Contracts?

dbt (data build tool) has become the standard for analytics engineering because it brings software engineering practices to data transformation. Version control, testing, documentation, dependency management — everything that makes code maintainable now applies to data.

Data contracts are a **natural extension**. Instead of transforming data and hoping it meets expectations, you explicitly define those expectations and validate them with every run.

The beauty of dbt’s implementation is that **contracts aren’t separate from your data models** — they’re integrated directly into the model configurations where they belong. The same YAML files that define your models now also define the contracts those models must satisfy.

### The Anatomy of a dbt Data Contract

A dbt data contract has several components:

**Schema definition** that specifies columns, data types, and constraints. This is the foundation — the structural agreement about what fields exist and what types they should be.

**Contract enforcement** that validates actual data against the contract specification during every dbt run. When enabled, dbt checks that the data produced by your model matches the contract before making it available downstream.

**Data quality tests** that go beyond schema validation to enforce business logic. While contracts handle structure, tests handle semantics — the business rules that make data meaningful.

**Versioning** that manages contract changes over time. When you need to evolve a contract, dbt’s versioning features let you maintain backward compatibility while introducing new versions.

![](https://cdn-images-1.medium.com/max/800/1*-IGsbUDR6aoQs6rPc35qYA.png)

Pillars of data contract (Image by author)

Let’s look at how these pieces fit together in practice.

#### Basic Contract Implementation

Here’s a customer model with an enforced contract:

```
# models/customers.yml
version: 2
models:
 - name: customers
 config:
 contract:
 enforced: true
 
 columns:
 - name: customer_id
 data_type: string
 constraints:
 - type: not_null
 - type: unique
 
 - name: email
 data_type: string
 constraints:
 - type: not_null
 
 - name: created_at
 data_type: timestamp
 constraints:
 - type: not_null
```

**The key:** `contract: enforced: true`

This tells dbt to validate the contract on every run. Wrong column names, incorrect types, or missing fields? **The model fails before data gets written.**

#### Adding Business Logic with Tests

Contracts enforce structure. Tests enforce business rules:

```
columns:
 - name: order_amount
 data_type: decimal
 constraints:
 - type: not_null
 tests:
 # Revenue must be non-negative
 - dbt_utils.expression_is_true:
 expression: ">= 0"
 
 - name: order_timestamp
 tests:
 # Orders within last 2 years
 - dbt_utils.expression_is_true:
 expression: ">= current_timestamp - interval '2 years'"
 
 - name: customer_id
 tests:
 # Referential integrity
 - relationships:
 to: ref('customers')
 field: customer_id
```

**Contracts + Tests = Comprehensive Validation**

Structure correctness + content validity = trusted data.

![](https://cdn-images-1.medium.com/max/800/1*I6lC-R3Vt21YcSqrauuAWw.png)

### Versioning: Managing Contract Evolution

Here’s a reality of data systems: requirements change. You need to add new fields, deprecate old ones, or modify business logic. How do you evolve contracts without breaking everything downstream?

dbt’s versioning feature provides the answer. You can maintain multiple versions of a model simultaneously, giving consumers time to migrate.

**dbt’s versioning feature:**

```
models:
 - name: customers
 latest_version: 2
 
 versions:
 - v: 1
 columns:
 - name: customer_id
 - name: email
 # v1: basic fields only
 
 - v: 2
 columns:
 - name: customer_id
 - name: email
 - name: phone_number
 - name: preferred_contact_method
 # v2: adds contact preferences
```

Now consumers can reference either `{{ ref('customers', v=1) }}` or `{{ ref('customers', v=2) }}`. You maintain both versions while teams migrate, then deprecate v1 once adoption of v2 is complete.

This pattern enables backwards-compatible changes. New consumers get the enhanced version. Existing consumers continue working unchanged. Migration happens at a controlled pace without a sudden breakage.

![](https://cdn-images-1.medium.com/max/800/1*zaVwGwcNwQuv4-r6-Lt78g.png)

### Integrating Contracts into CI/CD

The real power of data contracts emerges when you integrate them into your continuous integration/continuous deployment pipeline. Every code change gets validated before merge, catching contract violations in development rather than production.

A typical CI workflow looks like this:

```
# .github/workflows/dbt_ci.yml
name: dbt CI
on:
 pull_request:
 branches: [main]
jobs:
 test:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v2
 
 - name: Install dbt
 run: pip install dbt-databricks
 
 - name: dbt deps
 run: dbt deps
 
 - name: dbt compile
 run: dbt compile
 # Validates that SQL is valid
 
 - name: dbt run (contract check)
 run: dbt run --select state:modified+
 # Builds modified models, enforcing contracts
 
 - name: dbt test
 run: dbt test --select state:modified+
 # Runs data quality tests
```

When a developer opens a pull request that modifies a model, this workflow runs automatically. If their changes violate a contract — maybe they removed a column that downstream models depend on, or changed a data type incompatibly — the build fails with a clear error message.

The developer sees the issue immediately, while the full context is still fresh. They can adjust their changes, coordinate with downstream consumers, or create a new contract version as appropriate.

Compare this to discovering the problem in production after deployment. Instead of a four-hour investigation and emergency rollback, you get a two-minute fix in development.

![](https://cdn-images-1.medium.com/max/800/1*pi-e1FvrqoDQc2NFFCGJnA.png)

### Advanced Pattern: Cross-Database Contracts

In modern data architectures, you often need to share data across different platforms or business units. Data contracts become even more critical here, ensuring that data maintains quality and structure as it crosses boundaries.

At each boundary, contracts enforce quality:

```
# Foundational data product contract
models:
 - name: fct_customer_interactions
 description: "Foundation fact table for all customer interactions"
 config:
 contract:
 enforced: true
 columns:
 - name: interaction_id
 data_type: string
 constraints:
 - type: not_null
 - type: unique
 
 - name: customer_id
 data_type: string
 constraints:
 - type: not_null
 
 - name: interaction_timestamp
 data_type: timestamp
 constraints:
 - type: not_null
 
 - name: interaction_type
 data_type: string
 constraints:
 - type: not_null
 
 - name: channel
 data_type: string
 constraints:
 - type: not_null
```

Consumers in marketing, finance, or other domains can confidently build derived products on this foundation, knowing the contract guarantees specific structure and quality.

![](https://cdn-images-1.medium.com/max/800/1*2RTU5_FJCfM2-A-dPOcdTg.png)

### Contract Documentation: The Human Side

While contracts enforce technical agreements, documentation makes those agreements understandable. dbt automatically generates documentation from your contract specifications, creating a browsable catalog of all data products and their guarantees.

Every contract should include:

**Clear descriptions** that explain business context, not just technical details. “Customer email address for marketing communications” is better than just “email field.”

**Ownership information** that identifies who maintains the contract and who to contact for questions or changes.

**SLA commitments** that specify freshness expectations, update schedules, and reliability guarantees.

**Change history** that documents contract evolution over time, helping consumers understand what changed and why.

This documentation becomes your team’s single source of truth. New team members onboarding can browse the contract catalog to understand available data products. Analysts can self-serve without endless Slack questions. Governance teams can audit compliance without manual spreadsheets.

---

*This article was originally published at <https://medium.com/@aradsouza/implementing-data-contracts-with-dbt-from-theory-to-practice-eb03d568667f>*
