# From paper to data: prototyping a factory-floor workflow tool with AI in 2 weeks

**Status: Phase 1 to Phase 4 `[TBD]`
depend on Phases 2-4 (technician execution, dashboard, polish/deploy) and
should be filled in as those land — see [PRD.md](./PRD.md) for the current
build status. This is meant to become a 2-3 page exported doc/PDF once
complete, per the project's Phase 5 plan.

## Business problem: Inconsistent and wasted time on factory floors affecting product quality

Paper and static PDF work instructions are common on factory floors, and the data that would show
first-pass yield, cycle time, and rework reasons (torque values, pass/fail
results, timing) are time consuming additional tasks that break the work floor resulting in slow and lost time. Accurate recording of information is critical for consistent data being available for the lifetime of the product.

## Discovery & PRD

Full PRD: [PRD.md](./PRD.md). Short version: three personas (Engineer,
Technician, Ops Lead), three flows (ingest, execute, analyze), and an
explicit cut list (no auth, no multi-site/revision workflow, no PLM/MES
integration) written down before any code, so scope discipline was a
decision made early on. 

## Build log with Claude AI

**What Claude Code accelerated:** the Next.js/Prisma/Tailwind scaffold, the
forced-tool-use JSON schema for Claude's own document parsing, API route
boilerplate, and generating two realistic fictional work-instruction PDFs to
test against — all of that went from zero to a working, type-checked,
lint-clean app in a single focused session rather than the multi-day setup
grind that stack normally costs.

**Trade offs — 1.Added mock mode:** the original plan was just "upload → real
Claude API call → structured steps." Partway through, it became clear that
required an Anthropic API key just to click through the app at all — bad for
anyone reviewing the repo without one, and slow/flaky to rely on for repeated
UI testing during the build itself. The fix was `MOCK_CLAUDE`, a dev-only
flag that swaps in canned-but-realistic steps (matched to whichever sample
PDF was uploaded) instead of calling the API, while leaving the real parsing
path untouched and still the thing that actually ships.

**2.Build in Phases:** the data model has no work-instruction versioning/approval table,which will be a feature at scale. It's
explicitly out of scope per the PRD cut lines, and adding it now would have
meant designing a revision/approval workflow speculatively, before Phase 2-3
even establish what execution and reporting actually need from the schema. No significant validation at Phase 1 (see below for functional details)

**3.Future phases:** Phase 2 and Phase 3 will enable Techinician and Ops Lead workflows. Phase 2/3 trade-offs will be added once the technician flow and dashboard are built; e.g. how required-data-capture validation was enforced, or how the
Pareto/yield calculations were scoped.


## Results 

What's available today (Phase 1): the ingest loop (upload → Claude parse →
review/edit → publish) is demoable in well under a minute against either
sample document, with parsed output that needs only light editing rather
than a full rewrite.

## Metrics 

The following will be tracked and available in the Ops Dashboard once Phase 3 (dashboard + seed data) is built
First-pass yield %, Average cycle time per step, and defect Pareto

This will include an ~30-run seeded dataset as a mockup to understand: which step was the chronic failure, which was the slow one, and what that looks like on the dashboard.]`

## What is needed for Production/Scale

Revision control and full workflow would move into a Product Lifecycle Management system rather than living in StepTrace itself; execution data would be integrated into an Manufacturing Execution System/Supply Chain system/ analytics stack. StepTrace here is the UX layer — a fast way to
get a paper procedure into a structured, capturable format — not a replacement for either system. Auth, multi-site support, compliance checks and e-signatures
would need to exist before this could run a real floor.


