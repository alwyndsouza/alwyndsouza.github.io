---
id: "dbt-conversation-ai-local"
title: "dbt Conversation AI Local"
description: "A locally-running AI agent powered by Ollama and the dbt MCP server — answering questions about your semantic layer without sending data to the cloud."
status: production
category: "ai"
featured: true
draft: false
order: 2
tech:
  - Python
  - dbt
  - Ollama
  - MCP
  - MetricFlow
  - Streamlit
  - DuckDB
links:
  github: "https://github.com/alwyndsouza/dbt-conversation-ai-local"
---

Query your dbt semantic layer in plain English — entirely on your own machine. No API keys, no cloud dependencies.

The agent wires together **dbt + MetricFlow** (6 semantic models, 30+ metrics), **dbt-mcp** (12 callable tools via MCP), and **Streamlit + Ollama** into a tool-calling chat interface. Ask a question, and the LLM picks the right tool, runs it, and returns the answer.

## Interfaces

| Interface | Port | Purpose |
|---|---|---|
| Chat UI | 8501 | Natural language queries |
| Plotly Dashboard | 8502 | KPI charts and visualisations |
| Rill Dashboard | 9009 | Drag-and-drop BI with live filtering |

## Quick Start

**Requirements:** Python 3.12+, `uv`, Ollama

```bash
uv sync
ollama pull llama3.2
uv run dbt build
uv run streamlit run streamlit_app.py
```
