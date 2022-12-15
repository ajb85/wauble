-- CreateTable
CREATE TABLE "ColorThemes" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::TEXT,
    "name" TEXT NOT NULL,
    "colors" JSONB NOT NULL,
    "user_id" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ColorThemes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ColorThemes" ADD CONSTRAINT "ColorThemes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
