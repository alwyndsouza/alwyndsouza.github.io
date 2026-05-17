---
title: "dbt Cloud Setup Guide with Databricks"
slug: "dbt-cloud-setup-guide-with-databricks"
date: 2025-03-07
category: "data-engineering"
excerpt: "In this article, we will walk through the steps required to set up dbt (data build tool) Cloud using Databricks as your data warehouse. This setup allows you to..."
published: true
tags:
  - data-engineering
  - dbt
  - analytics
coverImage: "https://cdn-images-1.medium.com/max/800/1*a83fwkT0fphFSn8YRreVZg.png"
---
### Introduction

In this article, we will walk through the steps required to set up dbt (data build tool) Cloud using Databricks as your data warehouse. This setup allows you to leverage the power of Databricks for data transformations while managing your projects and workflows in dbt Cloud.

### Prerequisites

Before starting, ensure you have:

* A Databricks account
* A GitHub account
* Access to dbt Cloud
* Necessary permissions for OAuth and SSO configurations

### Step-by-Step Guide

### 1. Connect Databricks with OAuth

First, establish a connection between your Databricks workspace and dbt Cloud using OAuth.

1. Log in to your Databricks account.
2. Navigate to `Admin Console` > `User Settings`.
3. Under `Access Tokens`, generate a new token and copy it.
4. In another tab, log in to your dbt Cloud account.
5. Go to `Account Settings` > `Integrations`.
6. Select `Databricks` and click on `Connect`.
7. Paste the token generated from Databricks into the required field in dbt Cloud.

### 2. Configure Single Sign-On (SSO)

Next, configure Single Sign-On (SSO) for seamless access management for your team of developers.

1. In your identity provider’s admin console (e.g., Okta), create a new SAML application for dbt Cloud.
2. Obtain the SAML metadata URL or XML file from your identity provider.
3. In another tab, go back to `Account Settings` > `SSO` in dbt Cloud.
4. Upload the SAML metadata or paste the URL.
5. Complete the SSO configuration by following the prompts.

### 3. Integrate GitHub with dbt Cloud

To manage your dbt projects, integrate GitHub with dbt Cloud.

1. In your dbt Cloud account, go to `Account Settings` > `Integrations`.
2. Select `GitHub` and click on `Connect`.
3. Authorize dbt Cloud to access your GitHub repositories.
4. Choose the repository where your dbt project is stored.

### 4. Set Up Your dbt Project

Now, set up your dbt project in dbt Cloud.

1. In dbt Cloud, go to `Projects` and click on `New Project`.
2. Select your GitHub repository and branch.
3. Configure your project settings, including the target schema and database.
4. Save your project settings.

### 5. Run and Schedule Jobs

Finally, run and schedule your dbt jobs in dbt Cloud.

1. In your dbt Cloud project, go to `Jobs` and click on `New Job`.
2. Configure the job settings, including the commands to run and the schedule.
3. Save and activate the job.

---

*This article was originally published at <https://medium.com/@aradsouza/dbt-cloud-setup-guide-with-databricks-592b23a98007>*
