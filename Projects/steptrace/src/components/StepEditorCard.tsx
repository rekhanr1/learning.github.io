"use client";

import type { CaptureType } from "@/lib/types";
import { SpecCaptureFields } from "./SpecCaptureFields";

export interface EditableStep {
  key: string;
  title: string;
  description: string;
  tools: string;
  materials: string;
  caution: string;
  captureType: CaptureType;
  specLabel: string;
  specValue: string;
  specUnit: string;
}

export function StepEditorCard({
  step,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  step: EditableStep;
  index: number;
  total: number;
  onChange: (fields: Partial<EditableStep>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
            {index + 1}
          </span>
          <input
            type="text"
            value={step.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="text-lg font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
          />
        </div>
        <div className="flex shrink-0 gap-1 text-sm">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded px-2 py-1 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
            aria-label="Move step up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded px-2 py-1 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
            aria-label="Move step down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded px-2 py-1 text-red-600 hover:bg-red-50"
            aria-label="Delete step"
          >
            Delete
          </button>
        </div>
      </div>

      <textarea
        value={step.description}
        onChange={(e) => onChange({ description: e.target.value })}
        rows={2}
        className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-neutral-500">Tools (comma-separated)</label>
          <input
            type="text"
            value={step.tools}
            onChange={(e) => onChange({ tools: e.target.value })}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-500">Materials (comma-separated)</label>
          <input
            type="text"
            value={step.materials}
            onChange={(e) => onChange({ materials: e.target.value })}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-neutral-500">Caution / safety note</label>
        <input
          type="text"
          value={step.caution}
          onChange={(e) => onChange({ caution: e.target.value })}
          className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div className="mt-3">
        <SpecCaptureFields
          captureType={step.captureType}
          specLabel={step.specLabel}
          specValue={step.specValue}
          specUnit={step.specUnit}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
