import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedTags() {
  console.log('Seeding tags...');

  await prisma.tag.deleteMany({});

  const tags = [
    { name: 'コンテンツSEO' },
    { name: 'BtoBマーケティング' },
    { name: 'SEO戦略' },
    { name: 'コンテンツ制作' },
    { name: 'ウェブマーケティング' },
  ];

  for (const tag of tags) {
    await prisma.tag.create({
      data: {
        name: tag.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  const tagsCount = await prisma.tag.count({});
  console.log(`Seeded ${tagsCount} tags successfully.`);
}
