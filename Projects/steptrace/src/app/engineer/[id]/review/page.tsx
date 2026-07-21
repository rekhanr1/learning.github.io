import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReviewEditor } from "./ReviewEditor";

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const workInstruction = await prisma.workInstruction.findUnique({
    where: { id },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  if (!workInstruction) {
    notFound();
  }

  return (
    <ReviewEditor
      workInstruction={{
        id: workInstruction.id,
        title: workInstruction.title,
        status: workInstruction.status,
        version: workInstruction.version,
        sourceFileName: workInstruction.sourceFileName,
        sourceFilePath: workInstruction.sourceFilePath,
        sourceFileType: workInstruction.sourceFileType,
        steps: workInstruction.steps.map((step) => ({
          id: step.id,
          title: step.title,
          description: step.description,
          tools: (step.tools as string[]) ?? [],
          materials: (step.materials as string[]) ?? [],
          caution: step.caution,
          captureType: step.captureType as
            | "none"
            | "numeric"
            | "pass_fail"
            | "numeric_pass_fail",
          specLabel: step.specLabel,
          specValue: step.specValue,
          specUnit: step.specUnit,
        })),
      }}
    />
  );
}
