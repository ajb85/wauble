/*
  Warnings:

  - You are about to drop the column `definition` on the `Words` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Words" DROP COLUMN "definition",
ADD COLUMN     "definitions" JSONB;
