import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seed/users.seed.ts';
import { seedCategories } from './seed/categories.seed.ts';
import { seedArticles } from './seed/articles.seed.ts';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting seed process...');

    await seedUsers();
    await seedCategories();
    await seedArticles();

    console.log('Seed process completed successfully.');
  } catch (error) {
    console.error('Error during seed process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
