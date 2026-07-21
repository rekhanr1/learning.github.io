import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const workInstructions = await prisma.workInstruction.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { steps: true } } },
  });

  return NextResponse.json(workInstructions);
}
