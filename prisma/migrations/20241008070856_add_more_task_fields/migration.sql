/*
  Warnings:

  - Added the required column `hoursEstimated` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "hoursEstimated" INTEGER NOT NULL,
ADD COLUMN     "priority" VARCHAR(20) NOT NULL;
