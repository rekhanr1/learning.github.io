# Claude parsing prompt

This is the prompt StepTrace uses to turn an uploaded work-instruction PDF/image
into structured steps (see [`src/lib/claude.ts`](../src/lib/claude.ts)). It's
committed here — and kept in sync with the code — because the prompt is itself
a PM artifact worth showing, not an implementation detail to hide.

## Model

`claude-sonnet-5` (overridable via the `CLAUDE_MODEL` env var). Chosen over a
smaller model because the source documents are visually dense (diagrams,
tables of torque specs) and under-extraction is worse than the extra cost for
a one-time ingest step.

## System prompt

```
You are helping digitize a factory-floor paper work instruction into a
structured, step-by-step digital format.

You will be shown a scanned or photographed work instruction (a PDF or an
image). Read it carefully and extract every discrete work step in the order a
technician would perform them.

For each step, capture:
- title: a short imperative label (e.g. "Torque housing bolts")
- description: the full instruction text for that step, in plain language
- tools: any tools/equipment named for this step (e.g. "torque wrench",
  "3mm hex key") — empty array if none are mentioned
- materials: any parts/materials consumed or installed in this step (e.g.
  "M4x12 bolt", "thread locker") — empty array if none are mentioned
- caution: any warning, caution, or safety note tied to this step, verbatim
  or lightly cleaned up — null if none
- captureType: what data a technician must record when executing this step:
  - "numeric" if the step specifies a measurable spec value to record (a
    torque value, a dimension, a pressure, etc.)
  - "pass_fail" if the step is a visual/functional check with no numeric spec
  - "numeric_pass_fail" if it has both a numeric spec AND a separate pass/fail
    judgment call
  - "none" if the step is purely instructional with nothing to record
- specLabel: short name of the measurable spec, e.g. "Torque" — null if
  captureType is "none" or "pass_fail"
- specValue: the target/spec numeric value as it appears in the document,
  e.g. "35" — null if not applicable
- specUnit: the unit for specValue, e.g. "Nm", "in-lb", "psi" — null if not
  applicable

Do not invent steps, tools, materials, or spec values that are not supported
by the document. If a value is illegible or ambiguous, omit it (use null)
rather than guessing. Preserve the original step order.
```

## Structured output

Rather than parsing free-form text, the request forces a single tool call so
the response is guaranteed-valid JSON:

```json
{
  "name": "record_steps",
  "description": "Record the structured steps extracted from the work instruction document.",
  "input_schema": {
    "type": "object",
    "properties": {
      "steps": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "description": { "type": "string" },
            "tools": { "type": "array", "items": { "type": "string" } },
            "materials": { "type": "array", "items": { "type": "string" } },
            "caution": { "type": ["string", "null"] },
            "captureType": {
              "type": "string",
              "enum": ["none", "numeric", "pass_fail", "numeric_pass_fail"]
            },
            "specLabel": { "type": ["string", "null"] },
            "specValue": { "type": ["string", "null"] },
            "specUnit": { "type": ["string", "null"] }
          },
          "required": [
            "title",
            "description",
            "tools",
            "materials",
            "caution",
            "captureType",
            "specLabel",
            "specValue",
            "specUnit"
          ]
        }
      }
    },
    "required": ["steps"]
  }
}
```

The API call sets `tool_choice: { type: "tool", name: "record_steps" }` to
force Claude to respond via this tool rather than free text.

## Iterations / notes

- v1 (this version): single-shot extraction with a forced tool call. Works
  well for single-page, single-procedure instructions like the two samples in
  `samples/`. Multi-procedure or multi-page documents with dense tables may
  need a page-by-page pass in a future iteration — noted as a known
  limitation, not built for the MVP.
