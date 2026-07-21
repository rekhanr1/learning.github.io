import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseWorkInstruction } from "@/lib/claude";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const title = formData.get("title");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}. Upload a PDF, PNG, JPEG, GIF, or WebP.` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let parsedSteps;
  try {
    parsedSteps = await parseWorkInstruction(buffer, file.type, file.name);
  } catch (error) {
    console.error("Claude parsing failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to parse document: ${message}` },
      { status: 502 }
    );
  }

  const id = randomUUID();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uploadDir = path.join(process.cwd(), "public", "uploads", id);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeFileName), buffer);

  const workInstruction = await prisma.workInstruction.create({
    data: {
      id,
      title,
      sourceFileName: file.name,
      sourceFileType: file.type === "application/pdf" ? "pdf" : "image",
      sourceFilePath: `/uploads/${id}/${safeFileName}`,
      steps: {
        create: parsedSteps.map((step, index) => ({
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
        })),
      },
    },
  });

  return NextResponse.json({ id: workInstruction.id }, { status: 201 });
}
