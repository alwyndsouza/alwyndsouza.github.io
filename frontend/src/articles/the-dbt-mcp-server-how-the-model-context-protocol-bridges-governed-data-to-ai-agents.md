---
title: "The dbt MCP Server: How the Model Context Protocol Bridges Governed Data to AI Agents"
slug: "the-dbt-mcp-server-how-the-model-context-protocol-bridges-governed-data-to-ai-agents"
date: 2026-03-15
category: "data"
excerpt: "The Promise and the Problem of “Chat With Your Data”  Every data platform now offers some version of the same pitch: “Ask questions about your data in natural l..."
published: true
tags:
  - data
  - ai-agent
  - mcp-server
  - data-governance
  - dbt
coverImage: "https://cdn-images-1.medium.com/max/2232/1*uJDWEdQ88GIyH_WcfYxtSQ.png"
---

## The Promise and the Problem of “Chat With Your Data”

Every data platform now offers some version of the same pitch: “Ask questions about your data in natural language. No SQL required.”

The promise is compelling. A business user types “How did we perform last quarter?” and gets an accurate, well-formatted answer — no tickets, no waiting, no SQL expertise needed.

The reality, in most implementations, is far less reliable.

When a large language model generates SQL against your warehouse, it’s guessing. It guesses at table names based on column headers it can see. It guesses at join paths based on naming conventions. It guesses at how to aggregate, what filters to apply, what time grain to use, and how to handle nulls. Sometimes the guesses are right. Often they’re subtly wrong. And the failure mode is insidious — **the LLM returns a number that looks plausible but is silently incorrect**.

This isn’t a model intelligence problem. GPT-4, Claude, Gemini — they’re all sophisticated enough to write syntactically correct SQL. The problem is **context**. The LLM doesn’t know your organisation’s metric definitions, your business logic conventions, your join…

---

*This article was originally published at <https://medium.com/towards-data-engineering/the-dbt-mcp-server-how-the-model-context-protocol-bridges-governed-data-to-ai-agents-5ae25b7b6703?source=rss-670f6306e3c0------2>*
