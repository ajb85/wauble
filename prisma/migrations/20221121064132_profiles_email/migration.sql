/*
  Warnings:

  - You are about to drop the column `username` on the `Profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profiles_username_key";

-- AlterTable
ALTER TABLE "Profiles" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Words" ALTER COLUMN "definition" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_email_key" ON "Profiles"("email");
