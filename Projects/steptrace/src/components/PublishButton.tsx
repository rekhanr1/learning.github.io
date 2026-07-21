"use client";

import { useState } from "react";

export function PublishButton({
  workInstructionId,
  disabled,
  onPublished,
}: {
  workInstructionId: string;
  disabled?: boolean;
  onPublished: () => void;
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    setIsPublishing(true);
    setError(null);
    try {
      const res = await fetch(`/api/work-instructions/${workInstructionId}/publish`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to publish.");
      }
      onPublished();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePublish}
        disabled={disabled || isPublishing}
        className="rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPublishing ? "Publishing…" : "Publish v1.0"}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
