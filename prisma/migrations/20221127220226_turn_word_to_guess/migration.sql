/*
  Warnings:

  - You are about to drop the column `word` on the `Turns` table. All the data in the column will be lost.
  - Added the required column `guess` to the `Turns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Turns" DROP COLUMN "word",
ADD COLUMN     "guess" TEXT NOT NULL;
