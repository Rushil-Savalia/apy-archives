# APY Archives

A Next.js site that tracks and visualizes the **historical APY** of top high-yield
savings accounts over time. Data is scraped from publicly available sources.

![APY Archives](https://img.shields.io/badge/Next.js-14-black) ![Recharts](https://img.shields.io/badge/Recharts-3-22b5bf)

## Features

- Interactive line chart of APY over time (Recharts, stepped lines on a time axis)
- Defaults to the **last 5 years**; SoFi, Marcus, and Capital One pre-selected
- Toggle any of the tracked banks on/off (with Select all / Remove all)
- Table of current APY per bank
- Light/dark mode toggle (respects system preference, persists choice)

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling (class-based dark mode)
- **Recharts** (SVG) for the time-series chart
- **Puppeteer** (dev only) for the data scraper

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## Data

The app reads [`data/apy_history.csv`](data/apy_history.csv):

```
Date,Bank Name,Account Name,APY (%)
2016-04-18,"Marcus by Goldman Sachs","Online Savings Account",1.05
...
```

Each row is a **rate-change event** (the date an APY took effect). The loader in
[`lib/apyData.ts`](lib/apyData.ts) groups rows by bank for the UI.

### Updating the data

The scraper drives your **installed Google Chrome** (DepositAccounts is behind a
Cloudflare challenge, so a real browser is required). A visible window opens and
remembers its session in `scripts/.chrome-profile/` — solve the Cloudflare check
once if prompted.

```bash
npm run scrape          # refresh data/apy_history.csv for the configured banks
```

To add a bank, first look up its account name + id:

```bash
npm run discover -- "https://www.depositaccounts.com/banks/<bank-slug>.html"
```

then add a `{ bankName, bankUrl, accountName }` entry to `TARGETS` in
[`scripts/scrapeHistory.js`](scripts/scrapeHistory.js) and re-run `npm run scrape`.

> The scraper and the other helpers in `scripts/` are **development tools** — they
> are not part of the deployed app, which only reads the committed CSV.

## Deployment

Deploys to [Vercel](https://vercel.com) with zero configuration (Next.js preset).
No environment variables are required. See the project notes for the step-by-step
walkthrough.
