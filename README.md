# Fleet Profitability Intelligence

A small, responsive fleet-management dashboard demo built with Next.js App Router, React, TypeScript, Tailwind CSS, Lucide icons, and Vitest. It helps an operator compare vehicle revenue and operating costs, inspect an individual vehicle, and review explainable rule-based insights.

## Requirements

- Node.js 20.9 or newer (Node 22 LTS is recommended)
- npm

## Run locally

From this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify the project

```bash
npm test
npx tsc --noEmit
npm run build
```

## Features

- Fleet summary metrics calculated from the shared mock dataset.
- Eight fictional vehicles with revenue, maintenance, insurance, cleaning, and other costs.
- Vehicle table with search, status filters, sorting by revenue/net profit/margin, and row selection.
- Selected vehicle detail panel with expense categories, utilization, and suggested investigation steps.
- Rule-based fleet insights generated locally when the user clicks **Generate insights**.
- CSV export of the currently filtered table.
- Responsive layout, keyboard-accessible table selection, labelled controls, status text plus color, and useful empty search state.

## Data and calculation assumptions

- All records are fictional and represent one illustrative reporting period. No live fleet connection exists.
- Currency is USD; values are demo numbers, not real company financial data.
- Operating costs = maintenance + insurance + cleaning + other costs.
- Net profit = rental revenue − operating costs.
- Profit margin = net profit / revenue × 100, only when revenue is greater than zero; otherwise the UI shows `N/A`.
- Utilization = rental days / available days × 100, only when available days is greater than zero; otherwise the UI shows `N/A`.
- Status: **Loss** if net profit is below zero; **Review** if profit is non-negative and margin is below 20% or unavailable; otherwise **Profitable**.
- The 20% review threshold is illustrative, not a universal industry benchmark.
- Invalid numeric expense values are treated as zero by the calculation function. Demo records themselves use valid values.
- Insights are deterministic rules based on the visible calculations. No LLM, AI provider, API key, or network call is involved.

## Project structure

```text
app/
  globals.css        Responsive dashboard styles
  layout.tsx         Root layout and page metadata
  page.tsx           Dashboard interactions and composition
components/
  FleetInsights.tsx  Rule-based insight display
  MetricCard.tsx     Reusable summary metric card
  StatusBadge.tsx    Accessible text-and-color status badge
  VehicleDetails.tsx Selected vehicle financial breakdown
lib/
  formatters.ts      Currency and percentage formatting
  insights.ts        Explainable insight rules
  mock-data.ts       Fictional vehicle dataset and type
  profitability.ts   Central financial calculations/status logic
tests/
  profitability.test.ts Unit tests for calculations and insight edge cases
```

## Deliberately out of scope

No authentication, backend, database, live telematics, GPS, fuel-card/rental/accounting integrations, real-time updates, payments, booking workflows, external AI, multi-currency accounting, taxes, depreciation, financing, cash-flow modeling, or deployment infrastructure. These are excluded to keep this demo focused and straightforward to run.
