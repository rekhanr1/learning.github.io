# StepTrace — slide deck outline (draft)

**Status: outline only, written after Phase 1.** This is the content plan for
the 8-10 slide deck called for in Phase 5. It should be turned into an actual
`.pptx` once Phases 2-4 exist to screenshot and report metrics from —
building the real deck now would mean shipping placeholder screenshots.
`[TBD]` marks anything blocked on a later phase.

---

### 1. Title
- StepTrace — Enable quality with fully digitized ecosystem that removes manual inefficiencies and accelerates output
- AI-powered digital work instructions with built-in quality metrics
- Subtitle: built with Claude Code and Claude AI
- 

### 2. The problem
- Manual processes disrupts the end to end process on a factory floor, creates gaps that affect the overall quality —
  - The data gap: torque values, pass/fail results, and timing mostly live on
  paper/in people's hands, not in a system
- Digitizing usually means someone re-typing a procedure by hand — slow
  enough that it rarely happens

### 3. Personas
- Engineer (author/maintain), Technician (execute), Ops Lead (analyze)
- One line each on what they need and don't have today

### 4. Demo — Ingest (Engineer)
- Screenshot: upload → parsed steps → review/edit → publish
- Built and demoable today (Phase 1)

### 5. Demo — Execute (Technician)
- `[TBD — Phase 2]` screenshot of the guided step-by-step execution view
  with data capture

### 6. Demo — Analyze (Ops Lead)
- `[TBD — Phase 3]` screenshot of the FPY / cycle-time / Pareto dashboard

### 7. Metrics that matter
- First-pass yield %, average cycle time per step, defect Pareto — why each
  one is the metric an Ops Lead actually acts on
- `[TBD — Phase 3]` real numbers from the ~30-run seeded dataset once it
  exists

### 8. How AI changed the build economics
- Hours actually spent vs. a rough traditional estimate for the same scope
- `[TBD]` — fill in real hours once Phases 2-4 are done; Phase 1 alone: scaffold
  + Prisma/SQLite setup + Claude parsing + ingest UI in a single focused
  session
- One concrete example of what Claude Code accelerated (see case-study.md's
  build log) and one example of a judgment call it didn't make for you (the
  mock-mode trade-off)

### 9. Deliberately descoped / next steps
- Out of scope: auth, multi-site, revision/approval workflow, e-signatures,
  real-time collab, mobile, offline, PLM/MES integration
- Future work: Integration with PLM/MES, compliance and scale non functional requirements. MES owns
  execution-data analytics at scale — StepTrace is the UX layer

