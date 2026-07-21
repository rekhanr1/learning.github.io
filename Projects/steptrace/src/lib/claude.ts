import Anthropic from "@anthropic-ai/sdk";
import type { ParsedStep } from "./types";
import { mockParseWorkInstruction } from "./mockParse";

const SYSTEM_PROMPT = `You are helping digitize a factory-floor paper work instruction into a
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
rather than guessing. Preserve the original step order.`;

const RECORD_STEPS_TOOL: Anthropic.Tool = {
  name: "record_steps",
  description:
    "Record the structured steps extracted from the work instruction document.",
  input_schema: {
    type: "object",
    properties: {
      steps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            tools: { type: "array", items: { type: "string" } },
            materials: { type: "array", items: { type: "string" } },
            caution: { type: ["string", "null"] },
            captureType: {
              type: "string",
              enum: ["none", "numeric", "pass_fail", "numeric_pass_fail"],
            },
            specLabel: { type: ["string", "null"] },
            specValue: { type: ["string", "null"] },
            specUnit: { type: ["string", "null"] },
          },
          required: [
            "title",
            "description",
            "tools",
            "materials",
            "caution",
            "captureType",
            "specLabel",
            "specValue",
            "specUnit",
          ],
        },
      },
    },
    required: ["steps"],
  },
};

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to .env.local before parsing a document."
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

export async function parseWorkInstruction(
  fileBuffer: Buffer,
  mimeType: string,
  fileName: string = ""
): Promise<ParsedStep[]> {
  if (process.env.MOCK_CLAUDE === "true") {
    // Lets the ingest flow be exercised end-to-end without an Anthropic API
    // key by returning canned steps instead of calling Claude.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockParseWorkInstruction(fileName);
  }

  const isPdf = mimeType === "application/pdf";
  const base64Data = fileBuffer.toString("base64");

  const documentBlock: Anthropic.Messages.ContentBlockParam = isPdf
    ? {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: base64Data,
        },
      }
    : {
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType as ImageMediaType,
          data: base64Data,
        },
      };

  const message = await getClient().messages.create({
    model: process.env.CLAUDE_MODEL || "claude-sonnet-5",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    tools: [RECORD_STEPS_TOOL],
    tool_choice: { type: "tool", name: "record_steps" },
    messages: [
      {
        role: "user",
        content: [
          documentBlock,
          {
            type: "text",
            text: "Extract the structured steps from this work instruction.",
          },
        ],
      },
    ],
  });

  const toolUseBlock = message.content.find(
    (block): block is Anthropic.Messages.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUseBlock) {
    throw new Error("Claude did not return a structured tool_use response.");
  }

  const input = toolUseBlock.input as { steps: ParsedStep[] };
  return input.steps;
}
