---
title: "Customizing Your dbt Documentation with node_color"
slug: "customizing-your-dbt-documentation-with-node-color"
date: 2025-12-06
category: "data-engineering"
excerpt: "If you have ever looked at your dbt DAG and wished you could add some visual distinction to help your team quickly identify different model types, domains, or d..."
published: true
tags:
  - data-engineering
  - dbt
  - analytics
coverImage: "https://cdn-images-1.medium.com/max/800/1*6I0up47vTmbrO6KnmQ_Row.png"
---
If you have ever looked at your dbt DAG and wished you could add some visual distinction to help your team quickly identify different model types, domains, or data layers, the `node_color` configuration is exactly what you need. This powerful feature allows you to customize the appearance of your models, seeds, snapshots, and analyses directly in the dbt documentation DAG.

### What is node\_color?

The `node_color` configuration is a documentation attribute within dbt that lets you customize the display color of supported node types in the DAG visualization. This feature helps teams create more intuitive and visually organized data lineage graphs by color-coding models based on their purpose, domain, or layer in the data architecture.

**Supported node types:**

* Models
* Seeds
* Snapshots
* Analyses

**Note:** Sources, macros, and tests do not currently support custom node colors.

### Why Use node\_color?

![](https://cdn-images-1.medium.com/max/800/1*DymQIOwaIZ_JKADL43NTVQ.png)

Visual organization in data pipelines can significantly improve team productivity and understanding. Here are some compelling reasons to implement custom node colors:

**Domain separation:** Color-code models by business domain (Finance = gold, Marketing = blue, Operations = green)

**Data layer identification:** Distinguish between staging (bronze), intermediate (silver), and mart (gold) layers at a glance

**Team ownership:** Use colors to indicate which team owns specific models

**Priority levels:** Visually emphasize critical business metrics or high-priority pipelines

### How to Configure node\_color

The `node_color` configuration can be set at multiple levels, giving you flexibility in how you organize your documentation. The configuration follows a hierarchy where more specific configurations override broader ones.

**Configuration Hierarchy**

![](https://cdn-images-1.medium.com/max/800/1*KPhy1DsHaKXS4OAll7n6FQ.png)

This means a color defined in your SQL model file will override what’s in your schema.yml, which in turn overrides what’s in dbt\_project.yml.

**Syntax Options**

You can define colors using either:

**Named colors:** Standard HTML color names like `red`, `blue`, `purple`, `gold`

**Hex codes:** Custom colors using hex notation like `#cd7f32`, `#000000`, `#FF6B6B` (must be in quotes)

![](https://cdn-images-1.medium.com/max/800/1*qejCbMtlRxZX-0bVgg_d-Q.png)

### Project-Level Configuration

Set default colors for entire subdirectories in your `dbt_project.yml`:

```
models:
 my_project:
 staging:
 +materialized: view
 +docs:
 node_color: "#cd7f32" # Bronze for raw/staging
 
 intermediate:
 +docs:
 node_color: "silver" # Silver for intermediate transformations
 
 marts:
 core:
 +materialized: table
 +docs:
 node_color: "gold" # Gold for final data products
```

### Schema-Level Configuration

Override colors for specific models in your `schema.yml`:

```
models:
 - name: dim_customers
 description: Customer dimensions table
 config:
 docs:
 node_color: '#4A90E2' # Custom blue for dimension tables
 
 - name: fct_orders
 description: Orders fact table
 config:
 docs:
 node_color: '#E94B3C' # Custom red for fact tables
```

### Model-Level Configuration

Set colors directly in your SQL model files for the most specific control:

```
{{
 config(
 materialized = 'table',
 tags=['finance'],
 docs={'node_color': 'purple'}
 )
}}

select
 order_id,
 customer_id,
 order_total
from {{ ref('stg_orders') }}
```

### Important Considerations

#### Regenerating Documentation

After configuring your node colors, you must run or re-run the documentation generation command to see the changes:

```
dbt docs generate
dbt docs serve
```

#### Error Handling

If you specify an invalid color, dbt will throw a compilation error:

```
Invalid color name for docs.node_color: invalidcolor123. 
It is neither a valid HTML color name nor a valid HEX code.
```

This validation ensures that only compatible colors are used in your documentation.

#### Catalog vs. Explorer

It’s important to note that the `node_color` attribute applies only to dbt Docs, not to the Catalog feature in dbt Cloud. For more advanced organization in dbt Cloud, use Explorer's lens feature, which provides map layers for understanding contextual metadata at scale.

#### Hidden Models

Remember that models marked as hidden using `docs: {show: false}` will still appear in the DAG visualization but will be labeled as hidden. The node\_color configuration works independently of the show property.

### Best Practices

**Be consistent:** Establish a color scheme guide for your team and stick to it across all projects

**Document your scheme:** Add comments in your dbt\_project.yml explaining what each color represents

**Don’t overdo it:** Too many colors can be as confusing as none. Stick to 4–6 distinct colors

**Consider accessibility:** Choose colors with sufficient contrast for team members with color vision deficiencies

**Start at the project level:** Define your base colors in dbt\_project.yml, then override only when necessary

### Combining with Other Documentation Features

Node colors work beautifully alongside other dbt documentation features:

```
models:
 - name: fct_orders
 description: Core orders fact table
 config:
 docs:
 show: true
 node_color: '#E94B3C'
 meta:
 owner: "data-team@company.com"
 certified: true
 columns:
 - name: order_id
 description: Unique order identifier
```

The `node_color` configuration is a simple yet powerful feature that can transform your dbt documentation from a functional reference into an intuitive, visually organized resource. By thoughtfully applying colors to represent different layers, domains, or quality tiers, you create documentation that communicates your data architecture at a glance.

Start small by adding colors to your main data layers, then expand as your team develops conventions. Your future self and your teammates will thank you for the visual clarity when navigating complex data pipelines.

Ready to add some color to your dbt project? Run `dbt docs generate` and watch your DAG come to life with meaningful visual organization.

### References

* [Official dbt docs configuration documentation](https://docs.getdbt.com/reference/resource-configs/docs)

---

*This article was originally published at <https://medium.com/@aradsouza/customizing-your-dbt-documentation-with-node-color-2e7eda74434b>*
