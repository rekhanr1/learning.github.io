"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "@/components/FileDropzone";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch("/api/work-instructions/parse", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse document.");
      }
      router.push(`/engineer/${data.id}/review`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        Upload Work Instruction
      </h1>
      <p className="mt-1 text-neutral-600">
        Claude will read the document and extract structured steps for you to review.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bracket Torque Assembly"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-amber-500 focus:outline-none"
            disabled={isSubmitting}
          />
        </div>

        <FileDropzone file={file} onFileSelected={setFile} />

        {error && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={!file || !title.trim() || isSubmitting}
          className="rounded-md bg-neutral-900 px-4 py-3 font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Parsing with Claude… this can take up to a minute" : "Upload & Parse"}
        </button>
      </form>
    </div>
  );
}
