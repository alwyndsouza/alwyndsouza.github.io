---
title: "Use dbt retry to run from point of failure"
slug: "use-dbt-retry-to-run-from-point-of-failure"
date: 2025-03-18
category: "data-engineering"
excerpt: "The dbt retry command is a powerful tool in the dbt (data build tool) ecosystem, designed to re-execute the last dbt command from the point of failure. This com..."
published: true
tags:
  - data-engineering
  - dbt
  - analytics
coverImage: "https://cdn-images-1.medium.com/max/800/1*w22vSecaHPNYEmvYnI0kGg.png"
---
The `dbt retry` command is a powerful tool in the dbt (data build tool) ecosystem, designed to re-execute the last dbt command from the point of failure. This command is particularly useful for large projects where re-running the entire project after a failure would be inefficient.

#### What is dbt retry ?

The dbt retry command re-executes the last dbt command from the node where it failed. If the previously executed dbt command was successful, `dbt retry` will finish with no operation.

Below are list of dbt commands that can be used with the dbt retry command.

* build
* compile
* clone
* docs generate
* seed
* snapshot
* test
* run

`dbt retry` references [run\_results.json](https://docs.getdbt.com/reference/artifacts/run-results-json "https://docs.getdbt.com/reference/artifacts/run-results-json") to determine where to start.

#### When to Use dbt retry?

* After a Failure: If a dbt command fails due to an error in one of the models, you can use `dbt retry` to re-run only the failed parts of the project.
* Efficiency: Instead of re-running the entire project, `dbt retry` saves time by focusing only on the failed nodes.
* Debugging: It helps in debugging by allowing you to fix errors and re-run the specific parts that failed.

#### Example Scenario

Imagine you have a dbt project with several models, and you run the `dbt run` command. During execution, one of the models fails due to a syntax error. Here's how you can use `dbt retry`:

**Initial Run:**

```
dbt run
```

Output

```
1 of 5 START sql view model main.stg_customers [RUN]
2 of 5 START sql view model main.stg_orders [RUN]
3 of 5 ERROR creating sql table model main.customers [ERROR in 0.03s]
```

**Fix the Error:** Correct the syntax error in the `main.customers` model and run retry

```
dbt retry
```

Output

```
1 of 1 START sql table model main.customers [RUN]
1 of 1 OK created sql table model main.customers [OK in 0.04s]
```

### How to add a retry step in Airflow DAG

To enhance the dbt build command process, follow these steps:

1. **Implement a Retry Mechanism**: Add a retry task specifically for the dbt build command.
2. **Address Failures**: If the dbt build fails, identify and resolve the issue related to the model that encountered the failure.
3. **Mark the Task as Successful**: Once the issue is fixed, mark the dbt build task as successful.
4. **Proceed with the Retry**: Initiate the next task, which involves retrying the dbt refresh from the point of failure.

![](https://cdn-images-1.medium.com/max/800/1*XnUhLRQVYAjJzurs0lHPuw.png)

Sample Airflow DAG

**Sample DAG Code**

```
"""
Example DAG demonstrating dbt command orchestration in Airflow
"""

from datetime import timedelta

from airflow import DAG # type: ignore[attr-defined]
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago

# Default arguments for DAG
default_args = {
 "owner": "airflow",
 "depends_on_past": False,
 "email_on_failure": False,
 "email_on_retry": False,
 "retries": 1,
 "retry_delay": timedelta(minutes=5),
}

# Base command for dbt
DBT_DIR = "/opt/airflow/dbt"
DBT_CMD = f"cd {DBT_DIR} && dbt"

with DAG(
 "example_dbt_dag",
 default_args=default_args,
 description="An example DAG for running dbt commands",
 schedule_interval=timedelta(days=1),
 start_date=days_ago(1),
 catchup=False,
 tags=["example", "dbt"],
) as dag:
 # Debug information about environment
 debug_env = BashOperator(
 task_id="debug_env",
 bash_command=f"pwd && ls -la {DBT_DIR}",
 )

 # Run dbt debug to validate configuration
 dbt_debug = BashOperator(
 task_id="dbt_debug",
 bash_command=f"{DBT_CMD} debug",
 )

 # Run dbt dependencies to install packages
 #dbt_deps = BashOperator(
 # task_id="dbt_deps",
 # bash_command=f"{DBT_CMD} deps",
 #)

 # Run dbt tests on source data
 dbt_source_test = BashOperator(
 task_id="dbt_source_test",
 bash_command=f"{DBT_CMD} test --select source:*",
 )

 # Run dbt to build models
 dbt_build = BashOperator(
 task_id="dbt_build",
 bash_command=f"{DBT_CMD} build",
 )

 # retry dbt to build models
 dbt_retry = BashOperator(
 task_id="dbt_retry",
 bash_command=f"{DBT_CMD} retry",
 )

 # Generate and serve docs
 dbt_docs = BashOperator(
 task_id="dbt_docs",
 bash_command=f"{DBT_CMD} docs generate",
 )

 # Define the order of operations
 (
 debug_env
 >> dbt_debug
 >> dbt_source_test
 >> dbt_build
 >> dbt_retry
 >> dbt_docs
 )
```

#### Best Practices

* State Management: Ensure that the state files (`run_results.json`) are correctly managed and stored. You can specify the state directory using the `--state` option.
* Selective Retry: Use selectors to retry specific parts of your project if needed.
* Continuous Integration: Integrate `dbt retry` into your CI/CD pipelines to handle failures automatically.

### References

<https://docs.getdbt.com/reference/commands/retry>

<https://learn.getdbt.com/learn/video/dbt-retry>

---

*This article was originally published at <https://medium.com/@aradsouza/use-the-dbt-retry-to-run-from-point-of-failure-756190475cd9>*
