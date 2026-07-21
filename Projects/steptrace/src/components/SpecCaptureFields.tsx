"use client";

import type { CaptureType } from "@/lib/types";

const CAPTURE_TYPE_LABELS: Record<CaptureType, string> = {
  none: "No data capture",
  numeric: "Numeric spec",
  pass_fail: "Pass / fail",
  numeric_pass_fail: "Numeric spec + pass/fail",
};

export function SpecCaptureFields({
  captureType,
  specLabel,
  specValue,
  specUnit,
  onChange,
}: {
  captureType: CaptureType;
  specLabel: string;
  specValue: string;
  specUnit: string;
  onChange: (fields: {
    captureType?: CaptureType;
    specLabel?: string;
    specValue?: string;
    specUnit?: string;
  }) => void;
}) {
  const showSpecFields = captureType === "numeric" || captureType === "numeric_pass_fail";

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Data capture required
      </label>
      <select
        value={captureType}
        onChange={(e) => onChange({ captureType: e.target.value as CaptureType })}
        className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
      >
        {Object.entries(CAPTURE_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {showSpecFields && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-neutral-500">Spec label</label>
            <input
              type="text"
              value={specLabel}
              onChange={(e) => onChange({ specLabel: e.target.value })}
              placeholder="Torque"
              className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500">Spec value</label>
            <input
              type="text"
              value={specValue}
              onChange={(e) => onChange({ specValue: e.target.value })}
              placeholder="35"
              className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500">Unit</label>
            <input
              type="text"
              value={specUnit}
              onChange={(e) => onChange({ specUnit: e.target.value })}
              placeholder="Nm"
              className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
