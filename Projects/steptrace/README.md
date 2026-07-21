# StepTrace

AI-powered digital work instructions with built-in quality metrics — a demo
project showing how a paper-style factory work instruction can be digitized:
upload a PDF/image, have Claude parse it into structured steps, review/edit,
publish, and (in later phases) guide a technician through execution and
surface first-pass yield / cycle time / defect Pareto on a dashboard.

Full product scope: [StepTrace_Project_Scope.md](./StepTrace_Project_Scope.md).
Build log/prompt iterations: [docs/prompts.md](./docs/prompts.md).

## Status: Phase 1 of 4 — Ingest flow

**What works today:** Engineer persona — upload a work instruction (PDF or
image) → Claude parses it into structured steps → review/edit those steps →
publish as v1.0.

**Not built yet (later phases):** Technician guided-execution flow with data
capture, and the Ops Lead quality dashboard. Nav links for those personas are
present but intentionally disabled.

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npx prisma migrate dev       # creates dev.db (already run once for this repo)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), pick **Engineer**, and
upload one of the sample work instructions in [`samples/`](./samples/).

You need an Anthropic API key (console.anthropic.com) in `.env.local` for the
parse step to work — nothing else in the app calls out to a paid API. To try
the app without one, set `MOCK_CLAUDE=true` in `.env.local` — it swaps in
canned-but-realistic steps matched to whichever sample PDF you upload instead
of calling the real API.

## How it's built

- **Next.js 16 (App Router, TypeScript)** — one app, one deploy
- **SQLite via Prisma** (`prisma-client` generator + a `better-sqlite3` driver
  adapter, per Prisma 7's driver-adapter model) — zero external infra
- **Claude API** (`@anthropic-ai/sdk`) for PDF/image → structured JSON
  parsing, using a forced tool call so the response is always valid JSON. The
  exact prompt is committed at [`docs/prompts.md`](./docs/prompts.md).
- **Tailwind CSS**

See [`docs/architecture.md`](./docs/architecture.md) for the data model and a
flow diagram.

## Explicitly out of scope

- Auth/user management (three hardcoded personas, no login)
- Multi-site support, revision workflows/approvals, e-signatures
- Real-time collaboration, mobile app, offline mode
- Integration with PLM/MES (Windchill, etc.) — see "Future work" below

## Future work

At production scale, revision control and effectivity would live in a PLM
system (e.g. Windchill), and execution data would flow into an MES/analytics
stack — StepTrace here is the UX layer, not a replacement for either.

## Repo structure

```
steptrace/
├── docs/
│   ├── PRD.md            problem/personas/user stories/success metrics
│   ├── architecture.md   data model + flow diagram
│   ├── prompts.md        the Claude parsing prompt + schema
│   ├── case-study.md     Phase 5 draft — build log, trade-offs, results (WIP)
│   └── deck-outline.md   Phase 5 draft — slide-by-slide content plan (WIP)
├── prisma/schema.prisma
├── samples/               two fictional work-instruction PDFs
└── src/
    ├── app/               pages + API routes
    ├── components/
    └── lib/               Prisma client, Claude parsing, shared types
```
