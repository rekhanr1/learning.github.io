# StepTrace — AI-Powered Digital Work Instructions with Built-In Quality Metrics

**Demo project of common manual workflow that can be digitized in manufacturing process**
**Builder:** Rekha Nair · **Tools:** Claude Code (build) + Claude Cowork (research, PRD, case study, deck) · **Brainstorming:** Claude AI

---

## 1. The one-line pitch

StepTrace takes a paper-style work instruction (PDF/image), uses AI to parse it into structured digital steps, guides a technician through execution with data capture (torque values, pass/fail, timestamps), and sends the results into a quality dashboard showing first-pass yield, cycle time per step, and top rework drivers.

## 2. MVP scope (build this, nothing more)

### Core user flows
1. **Ingest (Engineer persona):** upload a work-instruction PDF or image → Claude API parses it into structured JSON (steps, tools, materials, torque/spec values, cautions) → engineer reviews/edits the parsed steps → publishes version 1.0.
2. **Execute (Technician persona):** step-by-step guided view — one step per screen, big touch-friendly buttons, required data capture per step (numeric entry for torque, pass/fail toggle, optional defect note), automatic per-step timing, can't skip required captures.
3. **Analyze (Ops lead persona):** dashboard — first-pass yield %, average cycle time per step (bar chart), defect Pareto (which steps generate the most failures/rework), run history table.

### Explicitly OUT of scope (list these in the README)
- Auth/user management (hardcode 3 personas)
- Multi-site, revision workflows/approvals, e-signatures
- Real-time collaboration, mobile app, offline mode
- Integration with PLM/MES (mention in "future work" — shows you know Windchill/MES exist)

### Seed data
Generate ~30 fictional completed runs with realistic variance (a couple of chronic-failure steps, one slow step) so the dashboard tells a story on first load.

## 3. Recommended architecture (optimize for demo-ability)

- **Single Next.js app** (React + API routes) — one repo, one deploy
- **SQLite** via Prisma (or even a JSON file store) — zero infra
- **Claude API** for the PDF/image → structured steps parsing (use structured JSON output; include the prompt in the repo — the prompt is itself a PM artifact)
- **Recharts** for the dashboard
- **Deploy:** Vercel free tier (live URL in the README) — a clickable link beats a local demo
- Keep it to ~8–12 components; resist backend sprawl

## 4. Build plan (2 weeks part-time, ~25–30 hours)

**Phase 0 — Research & PRD (Cowork, 2–3 hrs)**
Have Cowork research digital work instruction tools (VKS, Tulip, Dozuki) and MES basics, then draft a 2-page PRD: problem, personas, user stories, success metrics, MVP cut lines. Save as `docs/PRD.md`. *This document is exhibit A in interviews.*

**Phase 1 — Scaffold & parsing (Claude Code, 4–6 hrs)**
Feed this scope doc + your PRD to Claude Code. Scaffold the app, build the upload → Claude parse → review/edit → publish flow. Write 2 sample fictional work instructions as PDFs (Claude can generate them).

**Phase 2 — Technician execution flow (Claude Code, 4–6 hrs)**
Guided step UI, data capture validation, per-step timers, run completion.

**Phase 3 — Dashboard + seed data (Claude Code, 4–5 hrs)**
Seed generator script, FPY/cycle-time/Pareto charts, run history.

**Phase 4 — Polish & publish (Claude Code, 3–4 hrs)**
Empty states, loading states, a clean look (simple, industrial, high-contrast — technician-friendly). Deploy to Vercel. Record a 2–3 min Loom walkthrough.

**Phase 5 — Case study & deck (Cowork, 3–4 hrs)**
See §8.

## 57. GitHub repo structure & README outline

```
steptrace/
├── README.md            ← the product story, not just setup steps
├── docs/
│   ├── PRD.md
│   ├── architecture.md  (with a simple diagram)
│   └── prompts.md       ← the Claude parsing prompt + iterations
├── prisma/  src/  scripts/seed.ts
└── samples/             ← 2 fictional work-instruction PDFs
```

**README sections:** hero screenshot + live demo link · problem (2 paras, grounded in your Boeing floor observations — patterns only, nothing proprietary) · what it does (3 personas, GIFs) · metrics the dashboard surfaces and why they matter (FPY, cycle time, Pareto) · how it was built (Claude Code + Cowork workflow, hours spent — be specific: "built in ~28 hours over 2 weeks") · deliberately descoped items · future work (PLM/MES integration, revision control, andon alerts).

## 8. The closing document/presentation (Cowork)

Build **both** from the same material:

1. **Case study (2–3 page doc or PDF):** "From paper to data: prototyping a factory-floor workflow tool with AI in 2 weeks." Structure: the problem I saw on the floor → discovery & PRD → build log with AI (what Claude Code accelerated, where human PM judgment was required — include one real trade-off you made) → results & metrics → what I'd do next at production scale. This doubles as a writing sample.
2. **Slide deck (8–10 slides, pptx):** title · the problem (photo-free, pattern-level floor story) · personas · demo screenshots (3 slides) · metrics dashboard · how AI changed the build economics (hours vs. traditional estimate) · descoped/next steps · "what this means for Blue Origin's ET team." Keep it presentable in 5 minutes — interviewers may literally ask you to walk through it.

## 9. How to use it in the application & interviews

- Add to resume "Current Technical Projects": *"StepTrace — AI-powered digital work instruction prototype (Next.js, Claude API): parses paper instructions into guided technician workflows with first-pass-yield and cycle-time analytics. Built solo in 2 weeks with Claude Code. [github.com/…]"*
- Put the GitHub link in your cover letter's AI paragraph.
- Interview answer to "how do you use AI to prototype?": open the repo, show the PRD, show the live app, show the prompt file. Ninety seconds, no hand-waving.
- Anticipate the follow-up: "how would this scale / integrate with our systems?" — your answer: revision control and effectivity live in PLM (Windchill), execution data flows to MES/analytics; StepTrace is the UX layer. That one sentence shows you did the config-management homework too.

## 10. Definition of done checklist

- [ ] Live URL loads with seeded dashboard telling a visible story
- [ ] Full loop demo-able in under 3 minutes: upload → parse → execute → dashboard updates
- [ ] README with screenshots, live link, build-hours honesty
- [ ] PRD + prompts committed
- [ ] Case study doc exported (PDF)
- [ ] 8–10 slide deck exported (pptx)
- [ ] 2–3 min recorded walkthrough
- [ ] Zero proprietary content — final sweep before making repo public
