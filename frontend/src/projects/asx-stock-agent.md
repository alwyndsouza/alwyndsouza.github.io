---
id: "asx-stock-agent"
title: "ASX Stock Analysis Agent"
description: "An AI-powered agent that analyses ASX stocks and generates buy/sell/hold signals with risk ratings."
status: development
category: Finance
featured: true
draft: false
tech:
  - Python
  - LangChain
  - GPT-4o
  - yfinance
  - Streamlit
links:
  github: "https://github.com/alwyndsouza"
---

The ASX Stock Analysis Agent is an AI-powered tool that fetches real-time and historical data for Australian Securities Exchange (ASX) listed companies, runs a suite of technical and fundamental screens, and generates clear buy/sell/hold signals with associated risk ratings.

## Problem

Manually researching ASX stocks is time-consuming. There are over 2,000 listed companies, and synthesising price action, financials, and macro context for even a shortlist takes hours. The agent automates this workflow.

## What It Does

- Fetches OHLCV data for any ASX ticker using Yahoo Finance (`yfinance`)
- Computes a set of technical indicators: RSI, MACD, Bollinger Bands, ATR, and volume trends
- Pulls key fundamental metrics: P/E, EV/EBITDA, debt-to-equity, revenue growth
- Passes the combined context to a GPT-4o-powered reasoning agent
- Returns a structured signal: `BUY`, `HOLD`, or `SELL`, with a confidence score and risk level
- Explains the rationale in plain English, citing specific indicators

## Architecture

The system has three main layers:

1. **Data layer** — `yfinance` for price data, ASX announcements API for news, `pandas` for indicator computation
2. **Agent layer** — LangChain `AgentExecutor` with a set of domain tools (technical analysis, fundamental lookup, sector comparison)
3. **UI layer** — a Streamlit dashboard that accepts a ticker symbol and displays the signal, chart, and reasoning

## Example Output

```
Ticker  : BHP.AX
Signal  : BUY
Confidence : 72%
Risk    : MEDIUM

Reasoning:
BHP is forming a higher-low structure on the weekly chart after
a 14% pullback. RSI has reset to 42 from overbought territory.
MACD is showing a bullish crossover on the daily. Fundamentally,
forward P/E of 11.2x is below the 5-year average of 13.4x.
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Python 3.11 |
| AI framework | LangChain + OpenAI GPT-4o |
| Data | yfinance, pandas, numpy, ta-lib |
| UI | Streamlit |
| Deployment | Streamlit Community Cloud |

## Status

Active development. The core signal engine is functional. Upcoming work includes a watchlist feature, portfolio-level risk aggregation, and backtesting mode.
