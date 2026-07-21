"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { randomKey } from "@/lib/randomKey";
import { StepEditorCard, type EditableStep } from "@/components/StepEditorCard";
import { PublishButton } from "@/components/PublishButton";
import type { CaptureType, ParsedStep } from "@/lib/types";

interface StepData {
  id: string;
  title: string;
  description: string;
  tools: string[];
  materials: string[];
  caution: string | null;
  captureType: CaptureType;
  specLabel: string | null;
  specValue: string | null;
  specUnit: string | null;
}

interface WorkInstructionData {
  id: string;
  title: string;
  status: string;
  version: string;
  sourceFileName: string;
  sourceFilePath: string;
  sourceFileType: string;
  steps: StepData[];
}

function toEditable(step: StepData): EditableStep {
  return {
    key: step.id,
    title: step.title,
    description: step.description,
    tools: step.tools.join(", "),
    materials: step.materials.join(", "),
    caution: step.caution ?? "",
    captureType: step.captureType,
    specLabel: step.specLabel ?? "",
    specValue: step.specValue ?? "",
    specUnit: step.specUnit ?? "",
  };
}

function toParsedStep(step: EditableStep): ParsedStep {
  return {
    title: step.title,
    description: step.description,
    tools: step.tools.split(",").map((t) => t.trim()).filter(Boolean),
    materials: step.materials.split(",").map((m) => m.trim()).filter(Boolean),
    caution: step.caution.trim() || null,
    captureType: step.captureType,
    specLabel: step.specLabel.trim() || null,
    specValue: step.specValue.trim() || null,
    specUnit: step.specUnit.trim() || null,
  };
}

function blankStep(): EditableStep {
  return {
    key: randomKey(),
    title: "New step",
    description: "",
    tools: "",
    materials: "",
    caution: "",
    captureType: "none",
    specLabel: "",
    specValue: "",
    specUnit: "",
  };
}

export function ReviewEditor({ workInstruction }: { workInstruction: WorkInstructionData }) {
  const router = useRouter();
  const isPublished = workInstruction.status === "published";

  const [steps, setSteps] = useState<EditableStep[]>(
    workInstruction.steps.map(toEditable)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  function updateStep(key: string, fields: Partial<EditableStep>) {
    setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, ...fields } : s)));
  }

  function moveStep(index: number, direction: -1 | 1) {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function deleteStep(key: string) {
    setSteps((prev) => prev.filter((s) => s.key !== key));
  }

  function addStep() {
    setSteps((prev) => [...prev, blankStep()]);
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/work-instructions/${workInstruction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps: steps.map(toParsedStep) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save changes.");
      }
      setSaveMessage("Saved.");
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {workInstruction.title}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Source: {workInstruction.sourceFileName} &middot;{" "}
            <a
              href={workInstruction.sourceFilePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:underline"
            >
              view original
            </a>
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isPublished ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {workInstruction.status}
        </span>
      </div>

      {isPublished && (
        <p className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          This work instruction is published as v{workInstruction.version}. Editing is disabled.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {steps.map((step, index) => (
          <StepEditorCard
            key={step.key}
            step={step}
            index={index}
            total={steps.length}
            onChange={(fields) => updateStep(step.key, fields)}
            onMoveUp={() => moveStep(index, -1)}
            onMoveDown={() => moveStep(index, 1)}
            onDelete={() => deleteStep(step.key)}
          />
        ))}
      </div>

      {!isPublished && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addStep}
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            + Add step
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
          <PublishButton
            workInstructionId={workInstruction.id}
            disabled={steps.length === 0}
            onPublished={() => router.refresh()}
          />
          {saveMessage && <span className="text-sm text-emerald-700">{saveMessage}</span>}
          {saveError && <span className="text-sm text-red-700">{saveError}</span>}
        </div>
      )}
    </div>
  );
}
