---
title: "Building Data Cards for Data Products Using dbt"
slug: "building-data-cards-for-data-products-using-dbt"
date: 2025-06-08
category: "data-architecture"
excerpt: "Data cards are structured documents that provide essential metadata, quality metrics, lineage information, and usage guidelines for data products. They serve as..."
published: true
tags:
  - data-architecture
  - data-strategy
coverImage: "https://cdn-images-1.medium.com/max/800/1*ot_NxI-lrozxH4Jr5Tg9UA.png"
---
### What Are Data Cards?

Data cards are structured documents that provide essential metadata, quality metrics, lineage information, and usage guidelines for data products. They serve as a bridge between data producers and consumers, establishing trust through transparency.

They offer crucial explanations of the processes and rationales that shape the data, detailing how it might be used to train or evaluate models. Often compared to “model cards,” data cards specifically concentrate on the data’s lifecycle rather than the ML model itself.

### Why Data Cards Matter?

The implementation of data cards yields multifaceted benefits, fundamentally transforming how organisations interact with and derive value from their data.

**Enhancing Discoverability and Understanding**

Data discovery is defined as the process of identifying, cataloguing, and classifying business-critical and sensitive data, which is significantly improved by data cards. By offering structured summaries and detailed metadata, data cards act as a navigational aid in complex data environments, making data searchable and discoverable. They improve data discoverability by clearly articulating the purpose of each data product, which in turn helps eliminate wasteful duplication of effort across teams. This helps transform **“data unknowns”** into **“data opportunities”**. Without data cards, data often remains an opaque entity, significantly hindering its utility and the creation of business value.

**Driving Informed Decision-Making**

Reliable data, made transparent through data cards, forms the bedrock of confident decision-making. Data cards, through their explicit detailing of data quality metrics, lineage, and inherent limitations, equip decision-makers with the vital context needed to assess the trustworthiness of the data they are utilising. This directly addresses the “garbage in, garbage out” challenge, ensuring that business strategies are founded upon a robust and transparent understanding of data’s strengths and weaknesses.

**Strengthening Data Governance and Compliance**

Data governance aims to ensure data is reliable, secure, and compliant. Data cards contribute significantly by increasing the visibility of datasets and models, thereby addressing regulatory concerns regarding transparency in machine learning. Metadata, a foundational component of data cards, is central to robust governance, enabling comprehensive management, monitoring, and control of all an organisation’s data. Regulations such as GDPR, HIPAA, and CCPA mandate documentation of data usage and protection. By detailing sensitive attributes, access rules, and transformations, data cards provide auditable evidence of compliance. This facilitates a proactive risk management strategy, where transparency is embedded within the data product itself, mitigating legal and reputational exposure

**Fostering Collaboration and Accountability**

When metadata is well-described and organised, it promotes shared understanding and strengthens collaboration among teams, even across different departments and roles. Establishing clear data ownership and accountability is/are crucial data governance objective. Data cards can explicitly identify data owners and publishers, fostering a culture where teams are more inclined to trust and steward their data.

### How dbt Enables Data Card Creation

dbt empowers users to generate comprehensive documentation for their projects and underlying data platforms. This documentation is automatically updated following successful job runs, ensuring its accuracy and relevance.

**dbt Facilitates Metadata Generation**

1. **Model.yml for Descriptions and Tests:** Within dbt projects, `model.yml` files are utilised to define various resources such as models, columns, and sources, including the ability to add detailed descriptions. This feature supports granular, column-level documentation, allowing developers to explain a column's purpose, any calculations or transformations applied, its data type, format, context from the source system, and relevant business rules. For instance, a `model.yml` file for an `orders` model might include:

```
models:
 - name: orders
 description: "Order data from Shopify"
 columns:
 - name: order_id
 description: "Unique identifier for each order"
 tests:
 - unique
 - not_null
```

This direct integration means that documentation is version-controlled, resides alongside the data transformations, and updates automatically with code changes. This eliminates the common challenge of outdated documentation, making the dbt project itself the authoritative source of truth for data product metadata.

**2. Meta Config for Custom Metadata:** dbt's `meta` configuration allows for the assignment of arbitrary key-value pairs to various resources, including models, sources, snapshots, and tests. This custom metadata is compiled into the `manifest.json` file, which is then viewable in the auto-generated documentation. The `meta` config proves invaluable for diverse use cases, such as identifying model owners, indicating data maturity levels (e.g., development, production, deprecated), flagging PII for compliance purposes, defining Service Level Agreement (SLA) requirements for monitoring, and linking to related business processes or dashboards. An example illustrating PII identification might look like:

```
columns:
 - name: email
 config:
 meta:
 contains_pii: true
```

#### Leveraging dbt Tests for Data Quality Signals

dbt tests serve as assertions designed to validate data models and uphold data quality and integrity. They are instrumental in identifying data anomalies and issues early in the data transformation pipeline. dbt supports both generic tests (e.g., `unique`, `not_null`, `accepted_values`, `relationships`) and custom tests, which can be defined using SQL. These tests can be configured to check for null values, ensure values fall within a defined range, or validate specific business logic.

The results of these dbt tests (e.g., pass/fail status, severity levels) can be directly surfaced on a data card as critical data quality indicators. This integration provides immediate, automated feedback on the reliability and trustworthiness of the data product. Data quality is paramount for building trust in data. dbt’s automated testing capabilities enable data cards to display real-time “health signals” for data products. This moves beyond static documentation to dynamic, verifiable quality assurance, allowing users to see tangible evidence of data quality directly on the card, which significantly boosts confidence and mitigates the risk of utilising flawed data.

#### Automating Documentation and Lineage with dbt Catalog

dbt Catalog, a core component of dbt Explorer, represents the default documentation experience for dbt users on paid plans. It offers a dynamic, real-time interface enriched with enhanced metadata, customizable views, deeper project insights, and collaborative features. Catalog provides a comprehensive view of project resources — including models, tests, and metrics — along with their lineage and consumption patterns.

* **Lineage Visualisation:** dbt automatically constructs a Directed Acyclic Graph (DAG) that visually represents the relationships between models, tables, and transformations. dbt Catalog visualises this lineage, clearly depicting upstream dependencies and downstream impacts. This includes granular column-level lineage and connections across multiple dbt projects.
* **Metadata Ingestion:** Catalog leverages metadata provided by the Discovery API and can also ingest external metadata directly from data warehouses. To ensure all relevant metadata — including lineage, test results, and documentation — is available, it is crucial to run `dbt build` and `dbt docs generate` as part of production jobs.
* **Data Health Signals:** Catalog provides intuitive health indicators (e.g., Healthy, Caution, Degraded, Unknown) and source freshness status for each resource. This offers an at-a-glance understanding of the data’s quality and reliability.

dbt Catalog’s rich metadata and lineage visualisation capabilities can be directly leveraged to power data cards, offering clear context and transparency for data consumers.

By automating metadata generation and lineage tracking and surfacing it through dbt Catalog, this approach tackles key challenges in data discoverability and accessibility. With a centralised, always up-to-date view of data assets and their dependencies, data consumers can independently find, understand, and use data products, minimising the need for ad-hoc support from data engineers and analysts.

> Below is an example of telecom analytics

```
version: 2

models:
 - name: customer_network_usage_daily
 description: |
 Daily aggregated network usage metrics per customer.
 
 **Business Purpose:** Enable customer behaviour analysis, network capacity planning, and usage-based billing.
 
 **Key Use Cases:**
 - Customer segmentation and churn prediction
 - Network capacity forecasting 
 - Usage-based service recommendations
 
 **Data Sources:**
 - Call Detail Records (CDR)
 - Network Performance Data
 - Network Tower Data
 - Customer Master Data
 
 **Update Schedule:** Daily at 06:00 UTC
 **Data Availability:** From 2024-01-01 onwards
 
 **Important Limitations:**
 - Roaming usage data excluded
 - 5G network usage requires a separate data product
 
 **Performance Notes:**
 - Query performance optimised for date range filters
 - Large customer cohort analysis may require sampling
 
 meta:
 owner: "Network Analytics Team"
 contact: "network-analytics@my-company.com"
 version: "2.1.0"
 update_frequency: "daily"
 sla_target_hours: 6
 
 config:
 materialized: table
 
 columns:
 - name: customer_id
 description: "Unique customer identifier"
 data_type: string
 constraints:
 - type: not_null
 - type: check
 expression: "LENGTH(customer_id) = 10"
 data_tests:
 - not_null
 - unique
 - dbt_utils.accepted_range:
 min_value: 0
 inclusive: false
 - dbt_expectations.expect_column_values_to_match_regex:
 regex: "^[A-Z0-9]{10}$"

 - name: usage_date
 description: "Date of usage measurement"
 data_type: date
 constraints:
 - type: not_null
 - type: check
 expression: "usage_date >= '2024-01-01'"
 data_tests:
 - not_null
 - dbt_utils.accepted_range:
 min_value: "'2024-01-01'"
 max_value: "current_date()"

 
 - name: data_usage_mb
 description: "Total data usage in megabytes"
 data_type: decimal(12,2)
 constraints:
 - type: check
 expression: "data_usage_mb >= 0"
 data_tests:
 - not_null
 - dbt_utils.accepted_range:
 min_value: 0
 inclusive: true
 - dbt_expectations.expect_column_values_to_be_between:
 min_value: 0
 max_value: 999999999999
 
 - name: voice_minutes
 description: "Voice call duration in minutes"
 data_type: integer
 constraints:
 - type: check
 expression: "voice_minutes >= 0"
 data_tests:
 - not_null
 - dbt_utils.accepted_range:
 min_value: 0
 inclusive: true
 - dbt_expectations.expect_column_values_to_be_between:
 min_value: 0
 max_value: 100000
 
 - name: sms_count
 description: "Number of SMS messages sent"
 data_type: integer
 constraints:
 - type: check
 expression: "sms_count >= 0"
 data_tests:
 - not_null
 - dbt_utils.accepted_range:
 min_value: 0
 inclusive: true
 - dbt_expectations.expect_column_values_to_be_between:
 min_value: 0
 max_value: 10000

 data_tests:
 - dbt_utils.unique_combination_of_columns:
 combination_of_columns:
 - customer_id
 - usage_date
 name: unique_customer_usage_per_date
 - dbt_expectations.expect_table_row_count_to_be_between:
 min_value: 1000000
 max_value: 50000000
 name: validate_daily_record_count
 - dbt_expectations.expect_table_columns_to_match_ordered_list:
 column_list: ["customer_id", "usage_date", "data_usage_mb", "voice_minutes", "sms_count"]
 name: validate_column_structure
 - dbt_utils.recency:
 datepart: hour
 field: usage_date
 interval: 30
 name: data_freshness_check

 # Data quality monitoring configs
 freshness:
 warn_after: {count: 6, period: hour}
 error_after: {count: 12, period: hour}
 
 # Source table definitions
sources:
 - name: raw_telecom_data
 description: "Raw telecom data from various source systems"
 meta:
 owner: "Data Engineering Team"
 
 tables:
 - name: cdr_data
 description: "Call Detail Records capturing voice and SMS usage"
 columns:
 - name: customer_id
 data_tests:
 - not_null
 - name: call_start_time
 data_tests:
 - not_null
 - name: call_duration_seconds
 data_tests:
 - not_null
 - name: call_type
 data_tests:
 - not_null
 - accepted_values:
 values: ['voice', 'sms']
 
 - name: network_data
 description: "Network usage data capturing data consumption"
 columns:
 - name: customer_id
 data_tests:
 - not_null
 - name: session_start_time
 data_tests:
 - not_null
 - name: bytes_uploaded
 data_tests:
 - not_null
 - name: bytes_downloaded
 data_tests:
 - not_null
 
 - name: network_tower_data
 description: "Network tower performance and coverage data"
 columns:
 - name: tower_id
 data_tests:
 - not_null
 - name: customer_id
 data_tests:
 - not_null
 - name: signal_strength
 data_tests:
 - not_null
 - name: connection_timestamp
 data_tests:
 - not_null
 
 - name: customer_master_data
 description: "Customer master data and account information"
 columns:
 - name: customer_id
 data_tests:
 - not_null
 - unique
 - name: account_status
 data_tests:
 - not_null
 - accepted_values:
 values: ['active', 'suspended', 'terminated']
```

---

*This article was originally published at <https://medium.com/@aradsouza/building-data-cards-for-data-products-using-dbt-07c97452a0ce>*
