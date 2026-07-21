"use client";

import { useRef, useState } from "react";

export function FileDropzone({
  file,
  onFileSelected,
}: {
  file: File | null;
  onFileSelected: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) onFileSelected(dropped);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition ${
        isDragOver ? "border-amber-500 bg-amber-50" : "border-neutral-300 bg-white"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <p className="font-medium text-neutral-900">{file.name}</p>
      ) : (
        <>
          <p className="font-medium text-neutral-700">Drop a PDF or image here, or click to browse</p>
          <p className="mt-1 text-sm text-neutral-500">PDF, PNG, JPEG, GIF, or WebP</p>
        </>
      )}
    </div>
  );
}
