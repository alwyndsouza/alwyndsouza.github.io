---
title: "Databricks transitioning to the Direct Deployment Engine for Declarative Automation Bundles"
slug: "databricks-transitioning-to-the-direct-deployment-engine-for-declarative-automation-bundles"
date: 2026-03-22
category: "software-engineering"
excerpt: "The landscape of Databricks automation is shifting. With the release of Databricks CLI v0.279.0, a new era of “Direct Deployment” has arrived, signalling the ev..."
published: true
tags:
  - software-engineering
  - devops
  - databricks
  - data-engineering
  - databricks-asset-bundles
coverImage: "https://cdn-images-1.medium.com/max/1218/1*1vVtx7puXhu5vjjZR8yAOA.png"
---

The landscape of Databricks automation is shifting. With the release of **Databricks CLI v0.279.0**, a new era of “Direct Deployment” has arrived, signalling the eventual retirement of the Terraform-based backend for asset bundles.

Databricks is deprecating the Terraform engine and will require the Direct Deployment Engine as the **sole supported path in 2026**. If you’ve struggled with registry connection errors in locked-down environments or found Terraform state management too heavy for simple ETL pipelines, this change is for you.

Declarative Automation Bundles – formerly Databricks Asset Bundles – are the recommended approach for packaging workspace resources like jobs, DLT pipelines, and notebooks. Think of them as **Infrastructure-as-Code (IaC) tailored specifically for the analytics layer.**

A typical `databricks.yml` defines your resources simply:

---

*This article was originally published at <https://aradsouza.medium.com/transitioning-to-the-direct-deployment-engine-for-declarative-automation-bundles-e0e5a45bb9db?source=rss-670f6306e3c0------2>*
