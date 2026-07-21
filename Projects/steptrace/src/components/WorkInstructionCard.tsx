import Link from "next/link";

export interface WorkInstructionSummary {
  id: string;
  title: string;
  status: string;
  version: string;
  createdAt: string;
  _count: { steps: number };
}

export function WorkInstructionCard({ wi }: { wi: WorkInstructionSummary }) {
  const isPublished = wi.status === "published";

  return (
    <Link
      href={`/engineer/${wi.id}/review`}
      className="flex items-center justify-between rounded-lg border border-neutral-300 bg-white p-5 shadow-sm transition hover:border-amber-500 hover:shadow-md"
    >
      <div>
        <h3 className="font-semibold text-neutral-900">{wi.title}</h3>
        <p className="mt-1 text-sm text-neutral-500">
          v{wi.version} &middot; {wi._count.steps} steps &middot;{" "}
          {new Date(wi.createdAt).toLocaleDateString()}
        </p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
          isPublished
            ? "bg-emerald-100 text-emerald-800"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        {wi.status}
      </span>
    </Link>
  );
}
