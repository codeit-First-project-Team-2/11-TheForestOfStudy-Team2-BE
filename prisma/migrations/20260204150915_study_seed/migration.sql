/*
  Warnings:

  - Added the required column `date` to the `HabitRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HabitRecord" ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT true;
