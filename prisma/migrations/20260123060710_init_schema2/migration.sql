/*
  Warnings:

  - Added the required column `nickname` to the `Study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Study` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Study" ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
