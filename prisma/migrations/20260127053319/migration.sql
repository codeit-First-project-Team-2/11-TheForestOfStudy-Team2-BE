/*
  Warnings:

  - Added the required column `studyId` to the `Emoji` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyId` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habitId` to the `HabitRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `HabitRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `background` to the `Study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `introduction` to the `Study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Study` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emoji" ADD COLUMN     "studyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "studyId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HabitRecord" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "habitId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Study" ADD COLUMN     "background" TEXT NOT NULL,
ADD COLUMN     "introduction" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "totalPoint" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitRecord" ADD CONSTRAINT "HabitRecord_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emoji" ADD CONSTRAINT "Emoji_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;
