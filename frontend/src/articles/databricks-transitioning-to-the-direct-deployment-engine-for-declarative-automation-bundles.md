---
title: "Databricks transitioning to the Direct Deployment Engine for Declarative Automation Bundles"
slug: "databricks-transitioning-to-the-direct-deployment-engine-for-declarative-automation-bundles"
date: 2026-03-22
category: "software-engineering"
excerpt: "A “Software Engineering” mindset for data, without the infrastructure tax.The landscape of Databricks automation is shifting. With the release of Databricks CLI..."
published: true
tags:
  - software-engineering
  - devops
  - databricks
  - data-engineering
  - databricks-asset-bundles
coverImage: "https://cdn-images-1.medium.com/max/1024/1*1vVtx7puXhu5vjjZR8yAOA.png"
---

> A “Software Engineering” mindset for data, without the infrastructure tax.

The landscape of Databricks automation is shifting. With the release of **Databricks CLI v0.279.0**, a new era of “Direct Deployment” has arrived, signalling the eventual retirement of the Terraform-based backend for asset bundles.

Databricks is deprecating the Terraform engine and will require the Direct Deployment Engine as the **sole supported path in 2026**. If you’ve struggled with registry connection errors in locked-down environments or found Terraform state management too heavy for simple ETL pipelines, this change is for you.

![](https://cdn-images-1.medium.com/max/1024/1*1vVtx7puXhu5vjjZR8yAOA.png)

self contained bundle

### What are Declarative Automation Bundles (DABs)?

Declarative Automation Bundles – formerly Databricks Asset Bundles – are the recommended approach for packaging workspace resources like jobs, DLT pipelines, and notebooks. Think of them as **Infrastructure-as-Code (IaC) tailored specifically for the analytics layer.**

A typical databricks.yml defines your resources simply:

```
bundle:
  name: my_etl_pipeline
resources:
  jobs:
    daily_ingest:
      name: "Daily Ingestion Job"
      tasks:
        - task_key: ingest
          notebook_task:
            notebook_path: ./notebooks/ingest.py
targets:
  dev:
    workspace:
      host: https://my-dev-workspace.databricks.com
```

While the model is elegant, the underlying mechanism — Terraform — historically introduced significant friction for enterprise engineering teams.

### The Terraform Dependency: Where It Broke Down

Until now, DABs acted as a wrapper for Terraform. Every bundle deploy trigger initiated a heavy sequence: downloading the Terraform binary, fetching the provider from registry.terraform.io, and generating internal state files.

For teams in **regulated sectors like telecom, finance, or healthcare,** this architecture created three primary headaches:

* **The Air-Gap Problem:** CI/CD agents in restricted zones often lack outbound internet access, leading to the dreaded Could not retrieve provider error.
* **The Skills Gap:** Data engineers shouldn’t need to be Terraform experts to deploy a notebook. Managing provider mirrors and complex state files adds unnecessary overhead.
* **The Version Lag:** Supporting new Databricks features meant waiting for the Terraform provider to update before those resources could be automated.

### The Direct Deployment Engine: Architecture and Advantages

The **Direct Deployment Engine** eliminates the middleman. Instead of generating Terraform config and shelling out to terraform apply, the CLI now performs direct CRUD operations against Databricks REST APIs using the native Go SDK.

The result is a **self-contained binary**. No Terraform download. No provider registry. No proxy issues.

### Adopting Direct Deployment

### Option 1: New Bundles (Never Deployed Before)

For fresh projects, opt-in by setting an environment variable or updating your configuration:

**Via Environment Variable:**

```
export DATABRICKS_BUNDLE_ENGINE=direct 
databricks bundle deploy -t dev
```

**Via** **databricks.yml:**

```
bundle:
  name: my_pipeline
  engine: direct  # Sets the default for all targets
```

### Option 2: Migrating Existing Bundles

If you already have bundles deployed via Terraform, you must migrate your state file. The Direct Engine uses a new JSON schema (resources.json) rather than terraform.tfstate.

**Sync:** Ensure your current environment is fully synced.

databricks bundle deploy -t my\_target.

**Migrate:** Convert the state file:

databricks bundle deployment migrate -t my\_target.

**Verify:** Confirm zero planned changes.

databricks bundle plan -t my\_target.

* **Finalise:** Deploy to lock in the new state.

> ***Note:*** *The migration command still needs to read the old Terraform state, so run this step in an environment with internet access before moving the bundle to a locked-down zone*

### Where Terraform Still Belongs

This is not a deprecation of Terraform itself. Terraform remains the best tool for **platform infrastructure** — the foundation that sits beneath your workloads:

* **Compute and Networking:** VPCs, subnets, and security groups.
* **Workspace Provisioning:** Creating the workspace and Unity Catalog metastores.
* **Identity:** Service principals, IAM roles, and group memberships.

**The emerging best practice is clear:** use Terraform for infrastructure provisioning and use DABs (with the direct engine) for analytics asset deployment. These are complementary layers, not competing tools.

> The transition from Terraform to direct deployment is a signal of where Databricks is headed: a streamlined developer experience that removes friction between your code and your workspace. For data engineering teams, the action items are clear: **Evaluate the direct engine on non-production targets now** to ensure your pipelines are future-proofed for 2026.

### References

* <https://docs.databricks.com/aws/en/dev-tools/bundles/direct>
* <https://github.com/databricks/cli/releases/tag/v0.295.0>

*Found this useful? Follow me on Medium* [*(aradsouza)*](https://medium.com/@aradsouza) *or LinkedIn* <https://www.linkedin.com/in/alwynanildsouza/>

*for more practitioner-voice content on dbt, data mesh, and the modern data stack.*

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=e0e5a45bb9db)

---

[Databricks transitioning to the Direct Deployment Engine for Declarative Automation Bundles](https://medium.com/towards-data-engineering/transitioning-to-the-direct-deployment-engine-for-declarative-automation-bundles-e0e5a45bb9db) was originally published in [Towards Data Engineering](https://medium.com/towards-data-engineering) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---

*This article was originally published at <https://medium.com/towards-data-engineering/transitioning-to-the-direct-deployment-engine-for-declarative-automation-bundles-e0e5a45bb9db?source=rss-670f6306e3c0------2>*
