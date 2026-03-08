---
title: "Discovering PII Data in Databricks with discoverx"
slug: "discovering-pii-data-in-databricks-with-discoverx"
date: 2025-08-11
category: "security"
excerpt: "discoverx, a project from Databricks Labs, is a powerful \"Swiss-Army-knife\" toolkit designed to automate administrative tasks across your Databricks Lakehouse...."
published: true
tags:
  - security
  - privacy
  - compliance
coverImage: ""
---
`discoverx`, a project from Databricks Labs, is a powerful "Swiss-Army-knife" toolkit designed to automate administrative tasks across your Databricks Lakehouse. It simplifies complex operations that would otherwise require manual inspection or extensive custom coding. One of its most valuable use cases is the automated detection of Personally Identifiable Information (PII), which is essential for data governance and compliance.

### What is `discoverx`?

`discoverx` is a Python library that allows you to perform operations on a large number of tables with a single command. It works by applying SQL templates or predefined functions concurrently to tables that match a specified pattern. This makes it an ideal tool for tasks like table maintenance (e.g., `VACUUM` and `OPTIMIZE`), data governance, and, as we'll explore, PII detection.

It’s important to note that `discoverx` is a Databricks Labs project, meaning it's provided for exploration and is not officially supported with Databricks Service Level Agreements (SLAs).

### How to Use `discoverx` for PII Detection

The library includes functionality for semantic classification, which can be leveraged for PII detection. The process generally involves these steps:

1. **Installation:** You first need to install the `discoverx` library in your Databricks notebook using the `%pip` command.
2. Python

```
%pip install dbl-discoverx
```

**Initialization:** Once installed, you can import the `DX` class and create an instance to start your operations.

```
from discoverx import DX dx = DX()
```

**PII Scanning:** `discoverx` integrates with other tools like **Presidio** to perform PII detection. It can scan your entire lakehouse, or a specific subset of tables, to identify columns and values that match known PII patterns. It uses predefined rules for semantic classes like `email`, `phone number`, and `IP address`.

**Actionable Results:** The output of the scan is a DataFrame that provides a clear overview of where PII was found. You can then use this information to:

**Tag Data:** Apply metadata tags to PII columns within Databricks Unity Catalog for easier tracking and governance.

**Secure Data:** Implement access controls, masking, or encryption on the identified tables to protect the sensitive information.

**Audit and Report:** Use the scan results to build dashboards and reports to monitor your PII landscape and demonstrate compliance.

### Benefits of `discoverx` for PII Discovery

* **Scalability:** `discoverx` is designed for the Databricks Lakehouse, allowing you to scan and manage PII across hundreds or thousands of tables in a scalable, efficient manner.
* **Automation:** It automates a tedious and error-prone manual process, ensuring that PII detection is a consistent and repeatable part of your data pipeline.
* **Integration:** By integrating with tools like Presidio, it provides a robust and intelligent way to classify and manage sensitive data.

Using `discoverx` for PII discovery can significantly streamline your data governance efforts on Databricks, enabling you to maintain a secure and compliant data environment.

### Example on using discoverx

```
# Databricks notebook source
# MAGIC %md
# MAGIC # Lakehouse PII Scanner
# MAGIC This notebook is designed to scan the lakehouse and discover columns that hold Personally Identifiable Information (PII). 
# MAGIC It systematically examines the content, identifies potential PII, and classifies the findings for further analysis. 
# MAGIC
# MAGIC ### Rules and Score
# MAGIC We define rules using regex and scan through all the columns to identify the occurrence and create a score. 
# MAGIC Scores are defined between 0 to 1. If the score is 1, the rule perfectly matches. Any score greater than 0.9 is a good score.
# MAGIC
# MAGIC ### How It Works
# MAGIC 1. **Data Collection**: The scanner collects metadata and samples from the lakehouse.
# MAGIC 2. **Regex Matching**: It applies predefined regex patterns to identify potential PII.
# MAGIC 3. **Scoring**: Each match is scored based on its confidence level.
# MAGIC
# MAGIC ### Benefits
# MAGIC - **Automated Detection**: Reduces manual effort in identifying PII.
# MAGIC - **Accuracy**: High precision in detecting PII with regex rules.
# MAGIC - **Compliance**: Helps in maintaining data privacy and compliance.

# COMMAND ----------

# DBTITLE 1,Get job input through Widgets
# Create text widgets for user input
dbutils.widgets.dropdown(
 "environment",
 "prod",
 ["prod","dev","preprod"],
)
dbutils.widgets.text("catalogs", "shared")
dbutils.widgets.text("schemas", "*")
dbutils.widgets.text("tables", "*")

# Retrieve the values entered by the user in the widgets
catalogs = dbutils.widgets.get("catalogs")
schemas = dbutils.widgets.get("schemas")
tables = dbutils.widgets.get("tables")
environment = dbutils.widgets.get("environment")

# Get the Databricks workspace URL from the Spark configuration
workspace_url = spark.conf.get("spark.databricks.workspaceUrl")
display(workspace_url)


# Display all widget values
display({"catalogs": catalogs, "schemas": schemas, "tables": tables, "environment": environment})

# Construct the table reference string
from_table_statement = ".".join([catalogs, schemas, tables])

# Display the constructed table reference string
display(from_table_statement)

# COMMAND ----------

# DBTITLE 1,Define Regex Rules for Validation
from discoverx.rules import RegexRule

# Define a rule for phone numbers
phone_number_rule = {
 "name": "phone_number",
 "description": "Australian phone number",
 "definition": r"^61\d{9}$",
 "match_example": ["61123456789"],
 "nomatch_example": ["123456789"],
}

# Create a RegexRule object for Australian phone numbers
phone_number_rule = RegexRule(**phone_number_rule)

# Define a rule for postcodes
postcode_rule = {
 "name": "postcode",
 "description": "Australian postcode",
 "definition": r"^\d{4}$",
 "match_example": ["2000", "3000"],
 "nomatch_example": ["123", "12345"],
}

# Create a RegexRule object for postcodes
postcode_rule = RegexRule(**postcode_rule)

# Define a rule for IMEI
imei_rule = {
 "name": "imei",
 "description": "International Mobile Equipment Identity",
 "definition": r"^\d{15}$",
 "match_example": ["490154203237518"],
 "nomatch_example": ["49015420323751", "4901542032375189", "abc123456789012"],
}

# Create a RegexRule object for IMEI
imei_rule = RegexRule(**imei_rule)

# Define a rule for Australian Medicare card
medicare_card_rule = {
 "name": "medicare",
 "description": "Australian Medicare card",
 "definition": r"^\d{4}\s\d{5}\s\d{1}$",
 "match_example": ["1234 56789 1"],
 "nomatch_example": ["1234567891", "1234 5678 91", "abc 56789 1"],
}

# Create a RegexRule object for Australian Medicare card
medicare_card_rule = RegexRule(**medicare_card_rule)

# Define a rule for IMSI
imsi_rule = {
 "name": "imsi",
 "description": "International Mobile Subscriber Identity",
 "definition": r"^\d{15}$",
 "match_example": ["310150123456789"],
 "nomatch_example": ["31015012345678", "3101501234567890", "abc123456789012"],
}

# Create a RegexRule object for IMSI
imsi_rule = RegexRule(**imsi_rule)

# Define a rule for Australian passport number
passport_number_rule = {
 "name": "passport_number",
 "description": "Australian passport number",
 "definition": r"^[A-Z]{2}\d{7}$",
 "match_example": ["AB1234567"],
 "nomatch_example": ["1234567", "ABC1234567", "AB123456"],
}

# Create a RegexRule object for Australian passport number
passport_number_rule = RegexRule(**passport_number_rule)

# Define a rule for Australian mobile number starting with 04
mobile_number_rule = {
 "name": "mobile_number",
 "description": "Australian mobile number starting with 04",
 "definition": r"^04\d{8}$",
 "match_example": ["0478111628"],
 "nomatch_example": ["1478111628", "048111628", "abc0478111628"],
}

# Create a RegexRule object for Australian mobile number starting with 04
mobile_number_rule = RegexRule(**mobile_number_rule)

# Define a rule for Australian landline number
landline_number_rule = {
 "name": "landline_number",
 "description": "Australian landline number",
 "definition": r"^02\s?\d{4}\s?\d{4}$",
 "match_example": ["0244444444", "02 4444 4444"],
 "nomatch_example": ["024444444", "02 444 4444", "abc0244444444"],
}

# Create a RegexRule object for Australian landline number
landline_number_rule = RegexRule(**landline_number_rule)

# COMMAND ----------

# DBTITLE 1,Review DX module documentation
#help(DX)

# COMMAND ----------

# DBTITLE 1,Define and Display Custom DX Rules
from discoverx import DX

# Initialize the DX object with custom rules
custom_rules = [
 phone_number_rule,
 postcode_rule,
 imei_rule,
 #imsi_rule,
 passport_number_rule,
 mobile_number_rule,
 landline_number_rule
]

#display(custom_rules)
dx = DX(custom_rules=custom_rules)

# Display the defined rules
dx.display_rules()

# COMMAND ----------

# DBTITLE 1,Scan Tables Using All Rules
# Scan the specified tables using all defined rules
dx.scan(from_tables=from_table_statement, rules="*")

# COMMAND ----------

# DBTITLE 1,Save Results to Table
# Create schema pii_scan if it doesn't exist
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {environment}.pii_scan")

# Save the DiscoverX results to the table pii_scan.pii_scan_results
spark.sql(f"DROP TABLE IF EXISTS {environment}.pii_scan.pii_scan_results")

dx.save(f"{environment}.pii_scan.pii_scan_results")

spark.sql(f"""
DELETE FROM {environment}.pii_scan.pii_scan_results
WHERE class_name NOT IN (
 'email',
 'phone_number',
 'mobile_number',
 'passport_number',
 'credit_card_number',
 'postcode',
 'imei',
 'landline_number'
) or score < 0.8
""")
```

---

*This article was originally published at <https://medium.com/@aradsouza/discovering-pii-data-in-databricks-with-discoverx-8a1f525b1fb1>*
