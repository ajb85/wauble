/*
  Warnings:

  - You are about to drop the column `success` on the `Games` table. All the data in the column will be lost.
  - Added the required column `score` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Games" DROP COLUMN "success",
ADD COLUMN     "score" INTEGER NOT NULL;
