import { PrismaClient } from "@prisma/client";
import words from "../app/words.json";

const prisma = new PrismaClient();

async function seed() {
  await prisma.words.createMany({
    data: words.map((word) => ({ word, definitions: [] })),
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
