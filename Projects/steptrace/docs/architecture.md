# Architecture

## Overview (Phase 1: ingest flow)

```
┌─────────────┐     upload PDF/image      ┌───────────────────────┐
│   Engineer   │ ────────────────────────▶ │ POST /api/work-       │
│  (browser)   │                           │ instructions/parse    │
└─────────────┘                           └───────────┬───────────┘
                                                        │ base64 document/image block
                                                        ▼
                                            ┌───────────────────────┐
                                            │   Claude API           │
                                            │  (forced tool_use →    │
                                            │   record_steps JSON)   │
                                            └───────────┬───────────┘
                                                        │ parsed steps
                                                        ▼
                                  ┌─────────────────────────────────────┐
                                  │  SQLite (via Prisma)                │
                                  │  WorkInstruction ──< Step            │
                                  └─────────────────────────────────────┘
                                                        │
                     edit steps (PUT) / publish (POST)  │  read (GET)
                                                        ▼
                                            ┌───────────────────────┐
                                            │  Review/Edit page      │
                                            │  (Engineer)            │
                                            └───────────────────────┘
```

## Stack

- **Next.js 16 (App Router, TypeScript)** — single app, server components for
  data-fetching pages, route handlers for mutations
- **SQLite via Prisma** (`prisma-client` generator + `@prisma/adapter-better-sqlite3`
  driver adapter — Prisma 7's SQLite client requires an explicit driver
  adapter rather than a bundled engine binary)
- **Claude API** (`@anthropic-ai/sdk`) for document parsing — see
  [prompts.md](./prompts.md) for the exact prompt and schema
- **Tailwind CSS** for styling

## Data model

`WorkInstruction` (one per uploaded document) has many `Step` rows. A work
instruction is `draft` until published; publishing just flips `status` and
stamps `publishedAt` — there's no multi-version/approval workflow (explicitly
out of scope, see the project scope doc).

Each `Step` carries what the technician-execution flow (Phase 2) will need to
capture: `captureType` (`none` / `numeric` / `pass_fail` /
`numeric_pass_fail`), plus `specLabel`/`specValue`/`specUnit` for numeric
specs like torque. These fields are populated directly from what Claude
extracts — they aren't a forward-looking addition.

## File storage

Uploaded source files are written to `public/uploads/{workInstructionId}/{filename}`
and served statically. This is acceptable for a local/demo project with no
proprietary content; it would need to move to a private object store (S3,
etc.) with access control for anything beyond a demo.

## Known limitations (Phase 1)

- Parsing is single-shot (one API call, forced tool use). Dense multi-page
  documents may need a page-by-page pass in a future iteration.
- No auth — the three personas are just separate routes/nav items, per scope.
- Editing steps replaces the entire step list on save rather than diffing
  individual step changes — simple and correct for MVP scale.
