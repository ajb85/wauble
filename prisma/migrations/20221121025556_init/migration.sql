/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userId_fkey";

-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "Password";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Profiles" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Words" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::TEXT,
    "word" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::TEXT,
    "word_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "success" BOOLEAN,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turns" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::TEXT,
    "word" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_username_key" ON "Profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Words_word_key" ON "Words"("word");

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turns" ADD CONSTRAINT "Turns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turns" ADD CONSTRAINT "Turns_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
