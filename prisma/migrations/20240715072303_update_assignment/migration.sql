/*
  Warnings:

  - The primary key for the `TaskAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TaskAssignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[text]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskAssignment" (
    "taskId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("taskId", "personId"),
    CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TaskAssignment_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TaskAssignment" ("assignedAt", "personId", "taskId") SELECT "assignedAt", "personId", "taskId" FROM "TaskAssignment";
DROP TABLE "TaskAssignment";
ALTER TABLE "new_TaskAssignment" RENAME TO "TaskAssignment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Status_text_key" ON "Status"("text");
