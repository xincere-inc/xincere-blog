import { PrismaClient } from '@prisma/client';
import { fakerJA } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seedAuthors() {
  console.log('Seeding authors...');

  await prisma.author.deleteMany({});

  const authorsData = Array.from({ length: 5 }).map(() => ({
    name: fakerJA.person.fullName(),
    title: fakerJA.person.jobTitle(),
    bio: fakerJA.person.bio(),
    avatarUrl: fakerJA.image.avatar(),
    createdAt: fakerJA.date.past(),
    updatedAt: new Date(),
  }));

  const result = await prisma.author.createMany({ data: authorsData });
  console.log(`Seeded ${result.count} authors successfully.`);
}
