import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.workInstruction.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const published = await prisma.workInstruction.update({
    where: { id },
    data: { status: "published", publishedAt: new Date() },
  });

  return NextResponse.json(published);
}
