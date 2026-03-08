---
title: "Understanding Principles of Data Mesh Architecture — part 2"
slug: "understanding-principles-of-data-mesh-architecture-part-2"
date: 2025-03-23
category: "data-architecture"
excerpt: "In this section — we will deep dive into each of the guiding principles of data mesh"
published: true
tags:
  - data-architecture
  - data-strategy
coverImage: "https://cdn-images-1.medium.com/max/800/0*ORJBwjmAD8AUIMnD.png"
---
In this section — we will deep dive into each of the guiding principles of data mesh

### Domain-Driven Data Ownership (Soul)

Domain Driven Data Ownership decentralises data ownership and management across different domains within an organisation. Each domain operates autonomously, handling its own data extraction, loading, transformation (ELT), and data modeling processes locally.

This approach allows each domain to develop and manage its own data products independently. It enhances scalability, flexibility, and agility, as domains tailor their data practices to specific needs and respond quickly to changes. Teams within each domain leverage their expertise, ensuring higher data quality and relevant insights.

This reduces bottlenecks, fosters innovation, and promotes clear ownership and accountability. Overall, it significantly improves an organisation’s ability to manage and utilise data effectively, driving better business outcomes.

### Data as a Product (Heart)

Data product is a domain-specific, consumable entity designed to transform data into actionable insights for stakeholders and AI systems, facilitating informed decision-making processes.

![](https://cdn-images-1.medium.com/max/800/0*-7dLPopM6EIfU_2_.png)

illustration of data product — by Author

**Key Components of a data product are :**

* **Input Ports:** The interfaces through which data enters the data product, connected to various data sources like databases, APIs, or files. A sales data product might ingest data from CRM systems, e-commerce platforms, and customer feedback forms
* **Output Ports:** Interfaces through which processed data or results exit the data product, delivering information to other systems, dashboards, or users. The same sales data product might output sales forecasts to a business intelligence dashboard or send alerts to sales managers.
* **Metadata:** In a data product, metadata refers to the descriptive information about the data being processed. It provides context and details that help users understand the data’s characteristics and how it should be used. Metadata for a customer data product might include customer ID, purchase history, and demographic information.
* **Observability:** In a data product, the observability refers to the ability to understand and monitor the internal state of the system based on its outputs. It involves tracking various metrics, logs, and traces to ensure the data product is functioning correctly and efficiently.
* **Quality:** In a data product, the quality ensures the accuracy and reliability of the processed data by validating input data for errors and inconsistencies.

### Self-Serve Data Platform (Body)

A self-serve data platform is an infrastructure that empowers users to access, manage, and analyse data independently, without needing extensive support from IT or data engineering teams.

Think of it as a separate environment created for each domain, equipped with the necessary tools to build their own data products. Data domain teams can develop their own ELT pipelines to extract data from a central data domain (hub). While domain users have the freedom to work with data as needed, there are still overarching guidelines and policies in place to maintain data quality and compliance.

![](https://cdn-images-1.medium.com/max/800/0*rGjsNlwlFIVl4_iG.png)

### Federated Data Governance (Mind)

Federated governance in a data mesh is a model that balances centralised governance with decentralised execution. This approach ensures that data governance standards are defined centrally, but local domain teams have the autonomy and resources to implement these standards in a way that best suits their specific environments.

![](https://cdn-images-1.medium.com/max/800/0*X2q6gUJOR0CCqCDP.png)

Illustration of federated governance — by author

Central governance sets the overarching guidelines, standards, and best practices for data management. It establishes boundaries and policies to ensure consistency and compliance across the organisation. And acts as a center of excellence, offering expertise and support to federated domains.

### Data Mesh Logical Architecture

The below logical architecture depicts how a data mesh typical looks with 4 guiding principles.

![](https://cdn-images-1.medium.com/max/800/0*gIn7Jlc6orJ5fbKH.png)

Logical Architecture of Data Mesh

### References

<https://www.oreilly.com/library/view/data-mesh/9781492092384/>\
<https://martinfowler.com/articles/data-mesh-principles.html>\
<https://aws.amazon.com/what-is/data-mesh/>\
<https://www.ovaledge.com/blog/data-mesh>

---

*This article was originally published at <https://medium.com/@aradsouza/understanding-principles-of-data-mesh-architecture-part-2-7817c86fcc40>*
