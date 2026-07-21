import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ParsedStep } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const workInstruction = await prisma.workInstruction.findUnique({
    where: { id },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  if (!workInstruction) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(workInstruction);
}

interface UpdateBody {
  title?: string;
  steps: ParsedStep[];
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as UpdateBody;

  const existing = await prisma.workInstruction.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (!Array.isArray(body.steps)) {
    return NextResponse.json({ error: "steps must be an array." }, { status: 400 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (body.title && body.title.trim().length > 0) {
      await tx.workInstruction.update({
        where: { id },
        data: { title: body.title },
      });
    }

    await tx.step.deleteMany({ where: { workInstructionId: id } });

    for (const [index, step] of body.steps.entries()) {
      await tx.step.create({
        data: {
          workInstructionId: id,
          order: index,
          title: step.title,
          description: step.description,
          tools: step.tools,
          materials: step.materials,
          caution: step.caution,
          captureType: step.captureType,
          specLabel: step.specLabel,
          specValue: step.specValue,
          specUnit: step.specUnit,
        },
      });
    }

    return tx.workInstruction.findUnique({
      where: { id },
      include: { steps: { orderBy: { order: "asc" } } },
    });
  });

  return NextResponse.json(updated);
}
