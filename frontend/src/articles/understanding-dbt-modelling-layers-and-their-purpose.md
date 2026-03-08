---
title: "Understanding dbt Modelling Layers and Their Purpose"
slug: "understanding-dbt-modelling-layers-and-their-purpose"
date: 2024-11-17
category: "data-engineering"
excerpt: "Models — The landing layer, also called the raw zone or source layer, acts as the initial point of entry for data."
published: true
tags:
  - data-engineering
  - dbt
  - analytics
coverImage: "https://cdn-images-1.medium.com/max/1200/1*h9QYSfBaYM13KNfRahhngg.jpeg"
---
> dbt (data build tool) is a powerful tool for transforming raw data into meaningful insights. It organizes data transformation into distinct layers, each serving a specific purpose. This structured approach ensures data is clean, consistent, and ready for analysis. Below, we delve into each layer in detail.

### Landing Layer

**Models —**The landing layer, also called the **raw zone** or **source layer**, acts as the initial point of entry for data.

**Structure —**1:1 reflection of source tables without any transformations.

**Transformations —**No Transformation.

### **Staging Layer**

**Models —**Staging Models (`stg_*`): These models are responsible for **transforming raw data** from the source into a **clean and consistent format**. Staging layers is the replica of source with light column transformations.

**Structure —**Typically a 1:1 reflection of source tables. No joins between models in this layer.

**Transformations —**Light modifications like data type casting, column renaming, and (optional) filtering out deleted records.

**Purpose —**To cleanse, standardize, and prepare raw data for downstream consumption.

### **Intermediate Layer**

**Models —**Intermediate models (`int_*`): Apply business logic to prepare data for fact modeling.

**Structure —**These models build upon the clean and transformed data from the staging layer, focusing on **business logic and calculations** relevant to specific use cases that can feed into facts.

**Transformations —**Heavier transformations compared to staging, including aggregations, calculations, and applying business logic. Uses CASE statements, window functions, and other advanced SQL techniques.

**Purpose —**The intermediate layer acts as a bridge between the raw data sources (loaded in the staging area) and the final consumable data models (marts)

### **Marts Layer**

**Models**

* Dimension models (`dim_*`): Represent slowly changing entities (e.g., customers, products).
* Fact models (`fact_*`): Contain quantitative measures associated with dimensions.

**Structure —**Utilizes joins to combine data from various facts, dims and intermediate modes. Can involve unions for combining similar fact data.

**Transformations —**No Transformation logic reside in marts layer

**Purpose —**To transform data into a dimensional model that reflects the business’s perspective and supports analytics.

![](https://cdn-images-1.medium.com/max/800/1*zntx0x2taPSRaeRXw6TQsA.png)

### **Model Contracts**

For model contracts refer to the below article

<https://medium.com/@emp0-data-whisperer/dbt-model-contracts-e0a6a6e58c0e>

---

*This article was originally published at <https://medium.com/@aradsouza/understanding-dbt-modelling-layers-and-their-purpose-ff393e96d83a>*
