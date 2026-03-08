---
title: "MLOps is Data Engineering"
slug: "mlops-is-data-engineering"
date: 2025-02-28
category: "mlops"
excerpt: "MLOps is the practice of applying DevOps principles to the development and deployment of machine learning models."
published: true
tags:
  - mlops
  - machine-learning
  - ai
coverImage: ""
---
### Why MLOps is Data Engineering

MLOps is the practice of applying DevOps principles to the development and deployment of machine learning models.

It extends the DevOps framework to address the unique engineering challenges associated with machine learning. This includes

* Managing Platform using Cloud Infrastrure (IaC)
* Automating data pipelines to ensure efficient data flow and processing (Engineering)
* Automating ml-model pipelines to build, deploy and serve machine learning models.(Engineering)
* Continuous Integration and Continuous Deployment (CI/CD) pipelines,
* and providing ongoing support and maintenance through DataOps practices.

By integrating these components, MLOps aims to streamline the entire machine learning lifecycle, from model development to production, ensuring scalability, reliability, and efficiency.

Let’s break down the different components, magnify them, and explain exactly how engineering principles all fit into MLOps framework.

**Feature Stores — *The engineering problems here are more related to data engineering.***

Feature stores involve building data pipelines to extract, transform, and prepare data for machine learning model consumption. This process mirrors a data engineering pipeline, where data is transformed into a star schema with dimensions and measures, making it accessible for ML models. Dimensions act like feature lookup tables, while measures are the aggregations needed for ML models to learn from underlying data patterns.

**Model Training and Validation — *The engineering problems here are more related to data engineering and cloud computing***

Model training and validation is also very similar to data pipelines. If we simplify it, it is reading the data from number of tables and get the data transformed by applying training algorithms. It doesnt matter whether you are using CPU or GPU you to process the data, the engineering problem that we need to solve here is related to infrastructure (cloud computing).

Model training at scale is part of the data engineering discipline as engineering teams have the tooling ready, engineering teams have the responsibility for the SLAs on the data needed and they can control the release lifecycle much better.

**Model Deployment and Serving — *The engineering problems here are more related to product engineering and release management.***

At this stage, the work done by data scientists reaches a point where it can generate tangible value. The engineering challenges here are more aligned with product engineering.

We can view the ML model as a product or function that requires input and produces output. From an engineering perspective, this means wrapping the model as a service, deploying it in a scalable and predictable manner, and operating the service to ensure it has the necessary resources based on demand. Additionally, a CI/CD process is needed to trigger model retraining and deployment when performance degrades due to model drift.

This process mirrors the release cycles managed by engineering teams, utilising the necessary tools and falling under the responsibility of release management.

> *Separation of concerns is a good thing both in software architecture and in organisational design.*

**Model Quality and Monitoring — *The engineering problems here are more related to observability and alerting.***

This is very similar to data quality dashboards which is the primary function of engineering team. The engineering team will setup dashboards to monitor the data, the quality of data, schema changes, volume anamolies etc, and when any data quaility or data anlomolies are detected ,alerts are engineering team to intevene and fix the issues.

ML models are built on top of data, their quality is a direct reflection of the quality of data used to build them. Data engineers are the people who are monitoring the data from its capture to the point where the ML engineer can use it. They have access to the whole supply chain of data and they can monitor and add controls at any point of that chain.

We apply the same principle for ml-model monitoring, where engineering team will build dashboards to monitor the perfomance of the ml-models to identify model drift and model performance. If the performance degrades or model performance reduces, alerts are generated and send to the engineering team to intervene. This is the stage where we will retrain the model using fresh data. This stage can be a manual stages and automated.

### References

[MLOps is Mostly Data Engineering.](https://www.cpard.xyz/posts/mlops_is_mostly_data_engineering/)

---

*This article was originally published at <https://medium.com/@aradsouza/mlops-is-data-engineering-1e7f455dec08>*
