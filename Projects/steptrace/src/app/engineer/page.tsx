import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WorkInstructionCard } from "@/components/WorkInstructionCard";

export const dynamic = "force-dynamic";

export default async function EngineerPage() {
  const workInstructions = await prisma.workInstruction.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { steps: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Work Instructions
        </h1>
        <Link
          href="/engineer/upload"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Upload New
        </Link>
      </div>

      {workInstructions.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
          <p>No work instructions yet.</p>
          <Link href="/engineer/upload" className="mt-2 inline-block font-medium text-amber-600">
            Upload your first one &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {workInstructions.map((wi) => (
            <WorkInstructionCard
              key={wi.id}
              wi={{ ...wi, createdAt: wi.createdAt.toISOString() }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
