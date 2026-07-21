# StepTrace — Product Requirements Document

**Status: Phase 1 of 4 complete.** See [StepTrace_Project_Scope.md](../StepTrace_Project_Scope.md)
for the full build plan and phase breakdown, and [architecture.md](./architecture.md)
for the technical design of what's built so far.

## Problem

Manufacturing floors still run many procedures off paper or static PDF work
instructions. That makes it hard to capture the data (torque values,
pass/fail results, timing) needed to see first-pass yield, cycle time, and
recurring rework drivers — the data mostly exists in people's hands and
inspection logs, not in a system. Digitizing it usually means someone
re-typing a PDF into a new tool by hand, which is slow enough that it rarely
happens until a customer or auditor forces it.

StepTrace's bet: an AI parsing step removes most of that re-typing cost, so
digitizing a work instruction is closer to "upload and review" than "author
from scratch."

## Personas

1. **Engineer** — authors/maintains the work instruction. Wants to digitize a
   paper procedure quickly and trust the extracted steps are accurate.
2. **Technician** — executes the procedure on the floor. Wants a fast,
   unambiguous, touch-friendly guide that doesn't slow them down.
3. **Ops Lead** — watches quality trends across runs. Wants to see where yield
   is lowest and which steps drive rework, without digging through paper logs.

## User stories

- ✅ **Built** — As an Engineer, I can upload a PDF/image work instruction and
  get a structured, editable list of steps back so I don't have to re-type it.
- ✅ **Built** — As an Engineer, I can correct anything the parser got wrong
  (text, tools/materials, spec values, what data a technician must capture)
  before publishing, so a bad extraction never reaches the floor.
- ✅ **Built** — As an Engineer, I can publish a work instruction, after which
  it's locked from further edits (no versioning/approval workflow — see cut
  lines below).
- ⏳ **Planned (Phase 2)** — As a Technician, I can move through a published
  work instruction one step at a time and can't accidentally skip a required
  measurement.
- ⏳ **Planned (Phase 3)** — As an Ops Lead, I can see first-pass yield,
  per-step cycle time, and which steps generate the most rework, so I know
  where to focus improvement work.

## Success metrics

- ✅ Full ingest loop (upload → parse → review → publish) is demoable in well
  under a minute using the two sample work instructions in `samples/`.
- ✅ Parsed step extraction requires only light editing for a clean,
  single-page work instruction — validated against both samples (a torque
  assembly procedure and a wire-harness routing/inspection procedure).
- ⏳ Full loop including execute + dashboard demoable in under 3 minutes —
  depends on Phases 2-3.
- ⏳ Dashboard surfaces at least one clear "problem step" from seeded run
  data — depends on Phase 3.

## MVP cut lines

See §2 ("MVP scope") and §2 ("Explicitly OUT of scope") of
[StepTrace_Project_Scope.md](../StepTrace_Project_Scope.md) — this PRD
inherits those cut lines rather than restating them.

## Build status (as of Phase 1)

**Built:**

- Next.js 16 (App Router, TypeScript) app scaffold with Tailwind
- SQLite via Prisma, using the `prisma-client` generator with a
  `better-sqlite3` driver adapter (Prisma 7 requires an explicit driver
  adapter for SQLite rather than a bundled engine)
- Claude API parsing (`src/lib/claude.ts`) using a forced tool-use call so
  the response is always valid structured JSON — prompt committed at
  [prompts.md](./prompts.md)
- Engineer flow end to end: upload → parse → review/edit → publish
- Two generated fictional sample work instructions (`samples/`) used to
  validate parsing quality
- A `MOCK_CLAUDE` dev flag (`src/lib/mockParse.ts`) that returns canned,
  realistic steps instead of calling the real API — added so the full flow
  can be tested and demoed without an Anthropic API key. This wasn't in the
  original scope doc; it came out of wanting the ingest loop to be testable
  (by anyone, including reviewers without a key) without weakening the real
  parsing path, which still exists and is what actually ships.

**Not yet built:**

- Technician guided-execution flow with data capture (Phase 2)
- Ops Lead dashboard — first-pass yield, cycle time, defect Pareto (Phase 3)
- Seed data generator for ~30 fictional runs (Phase 3)
- Polish pass, empty/loading states beyond what Phase 1 needed, Vercel
  deploy (Phase 4)
