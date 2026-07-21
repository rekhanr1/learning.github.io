-- CreateTable
CREATE TABLE "WorkInstruction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "sourceFileName" TEXT NOT NULL,
    "sourceFileType" TEXT NOT NULL,
    "sourceFilePath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workInstructionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tools" JSONB NOT NULL,
    "materials" JSONB NOT NULL,
    "caution" TEXT,
    "captureType" TEXT NOT NULL DEFAULT 'none',
    "specLabel" TEXT,
    "specValue" TEXT,
    "specUnit" TEXT,
    CONSTRAINT "Step_workInstructionId_fkey" FOREIGN KEY ("workInstructionId") REFERENCES "WorkInstruction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
