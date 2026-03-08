---
title: "Building AI Agents for DataOps"
slug: "ai-agents"
date: 2025-02-01
category: AI & DataOps
excerpt: "How to design and deploy lightweight AI agents that monitor data pipelines, surface anomalies, and generate remediation suggestions autonomously."
published: true
tags:
  - AI Agents
  - Python
  - DataOps
  - LLMs
---

Modern data platforms generate enormous amounts of operational signal — failed jobs, schema drift, freshness violations, anomalous metrics. Keeping on top of these manually doesn't scale. AI agents offer a way to monitor, triage, and remediate pipeline issues autonomously.

## What Is a DataOps Agent?

A DataOps agent is a software component that:

- Observes the state of a data platform (jobs, models, metrics, logs)
- Reasons about anomalies or failures using an LLM
- Takes targeted actions — alerting, retrying, opening tickets, or patching queries

> The key insight: an LLM is not the pipeline — it is the operator of the pipeline.

## Architecture Overview

A minimal DataOps agent has four components:

1. **Observer** — polls or receives events from the data platform
2. **Reasoner** — passes context to an LLM with a structured prompt
3. **Planner** — the LLM outputs a structured action plan
4. **Executor** — runs the actions (API calls, SQL patches, notifications)

## Building the Observer

The observer collects signals. For a dbt-based platform, this might mean calling the dbt Cloud API to fetch run results:

```python
import requests

def fetch_failed_runs(account_id: str, token: str) -> list[dict]:
    url = f"https://cloud.getdbt.com/api/v2/accounts/{account_id}/runs/"
    headers = {"Authorization": f"Token {token}"}
    params = {"status": 20, "limit": 10}  # 20 = error
    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()["data"]
```

## Prompting the Reasoner

Pass run metadata to an LLM with a structured prompt that asks for a diagnosis and recommended action:

```python
from openai import OpenAI

client = OpenAI()

def diagnose_failure(run: dict) -> str:
    prompt = f"""
You are a DataOps engineer. A dbt run failed with the following details:

Run ID     : {run['id']}
Job name   : {run['job']['name']}
Error msg  : {run['status_message']}

Diagnose the most likely root cause and suggest a remediation step.
Respond in JSON with keys: cause, severity (low/medium/high), action.
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    return response.choices[0].message.content
```

## Making It Agentic

The above is reactive — it handles one failure at a time. A true agent adds a planning loop:

- The LLM is given a set of **tools** (fetch_run_logs, retry_job, query_lineage, etc.)
- It iterates, calling tools and refining its understanding, until it resolves the issue
- Frameworks like LangChain, LlamaIndex, or a bare OpenAI tool-calling loop work well here

```python
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_openai import ChatOpenAI
from langchain.tools import tool

@tool
def get_run_logs(run_id: str) -> str:
    """Fetch the full log output for a dbt run."""
    return logs

@tool
def retry_dbt_job(job_id: str) -> str:
    """Trigger a new run for a dbt Cloud job."""
    return f"Triggered new run for job {job_id}"

llm = ChatOpenAI(model="gpt-4o", temperature=0)
tools = [get_run_logs, retry_dbt_job]
agent = create_openai_tools_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
```

## Guardrails and Safety

Before deploying a DataOps agent in production, apply these guardrails:

- **Dry-run mode** — log all planned actions before executing them
- **Action allowlist** — restrict which tools the agent can call
- **Human-in-the-loop** — require approval for destructive actions
- **Audit trail** — persist every agent decision to a log table
- **Cost limits** — cap the number of LLM calls per incident

## Key Takeaways

- Start small: a single reactive agent that triages dbt failures delivers immediate value
- Use structured output (JSON mode) to make LLM responses parseable and testable
- Instrument the agent itself — track which actions it takes and their outcomes
- Expand gradually: add tools, broaden scope, and increase autonomy as confidence grows
