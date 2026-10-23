# CashHelix

**One engine, six lenses on every Indian's money.**

CashHelix is a financial well-being web app that turns scattered money data into one daily decision: **what is safe to spend today.** Built by Team **ELEVATEX** for the CodeYGen HacktoberFest hackathon (FinTech 2: *From disconnected financial data to personalized financial well-being*).

## Problem

Money sits across bank accounts, UPI wallets, cards, loans and insurance, and no app shows the full picture. People can't tell how healthy their finances are or plan ahead, and it hits irregular earners hardest.

## Solution

| Step | What it does | PS challenge |
|---|---|---|
| **Connect** | All accounts in one view, via a consent-first Account Aggregator (AA) flow | Fragmented data |
| **Understand** | Raw data becomes a health score and clear insights | No actionable insights |
| **Act** | Safe to Spend, What-If simulator and Goal GPS guide the next move | Hard to plan and reach goals |

## Features

- **Safe to Spend Today**: expected income minus bills due in 7 days minus a lean-week set-aside. One number, not a dashboard.
- **What-If simulator**: test a purchase (e.g. a Rs 40,000 phone on EMI) and see the 6-month impact on bills and goals.
- **Goal GPS**: reverse-calculates the monthly saving needed per goal and recalculates if a month is missed.
- **Six personas on one engine**: Gig Worker, Student, Shopkeeper, Family, Senior Citizen, SHG Women.
- **Insight tabs**: Financial Health Score, Hidden Charges, Insurance Gaps, Festival Planner.
- **Voice assistant**: ask in English, Hindi or Tamil and get a spoken answer, with a typed fallback.
- **Consent-first design**: mock "Connect via Account Aggregator" flow.

## How it works

```
Browser  ->  React UI  ->  Insight Engine  ->  Mock Data
                |
         Web Speech API (voice in, spoken reply)
```

1. **Consent**: connect accounts via Account Aggregator
2. **Unify**: accounts, wallets, loans and insurance in one view
3. **Analyse**: health score, hidden charges, gaps, Safe to Spend
4. **Act**: What-If, Goal GPS and voice answers

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Web Speech API (voice)
- Rule-based insight engine on mock persona data

## Getting started

Requires Node.js 18+.

```bash
git clone https://github.com/ishanniselva-collab/CashHelixxxx.git
cd CashHelixxxx
npm install
cp .env.example .env   # add your keys if needed
npm run dev
```

The app runs at http://localhost:3000.

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the build
npm run lint      # TypeScript type check
```

## Prototype scope

This is a hackathon prototype. Data is **mock**, and the Account Aggregator consent flow is **simulated**. Nothing is connected to real bank accounts.

## Roadmap

- Live Account Aggregator integration
- Regional-language voice with more languages
- Pilot with delivery partners and students
- Bank and NBFC partnerships for credit-readiness

## Team ELEVATEX

- Ishanni
- Praneetha Vanamala
