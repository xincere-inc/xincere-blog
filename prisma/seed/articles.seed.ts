import { faker } from '@faker-js/faker';
import { ArticleStatus, PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

export async function seedArticles() {
  console.log('Seeding articles...');

  await prisma.article.deleteMany({});

  const author = await prisma.author.findFirst();
  if (!author) throw new Error('No author found. Please seed authors first.');

  const categories = await prisma.category.findMany();
  if (categories.length === 0)
    throw new Error('No categories found. Please seed categories first.');

  const tags = await prisma.tag.findMany();
  if (tags.length === 0)
    throw new Error('No tags found. Please seed tags first.');

  const sampleTitles = [
    'マイクロサービスアーキテクチャで実現した基幹システムの刷新事例',
    '生成AIを活用した業務効率化の最前線',
    'クラウドネイティブ時代のセキュリティ対策とは',
  ];
  const sampleSummaries = [
    '従来の一枚岩システムをマイクロサービス化することで、開発効率と運用保守性を大幅に向上させた事例を詳しく解説します。',
    '生成AIを活用した最新の業務効率化事例や導入のポイントを紹介します。',
    'クラウドネイティブ環境におけるセキュリティの課題と対策について解説します。',
  ];
  const sampleThumbnailUrl =
    'https://readdy.ai/api/search-image?query=SEO%20analytics%20dashboard%20on%20computer%20screen%20in%20modern%20office%20setting%2C%20professional%20environment&width=200&height=300&seq=12&orientation=portrait';

  const htmlContent = readFileSync(
    new URL('./articleContent.html', import.meta.url),
    'utf-8'
  );

  const markdownContent = readFileSync(
    new URL('./articleContent.md', import.meta.url),
    'utf-8'
  );

  let createdCount = 0;

  for (const category of categories) {
    for (let i = 0; i < 30; i++) {
      const idx = faker.number.int({ min: 0, max: 2 });
      const chosenTags = faker.helpers.arrayElements(tags, 2);
      const isPickup = faker.datatype.boolean();

      await prisma.article.create({
        data: {
          authorId: author.id,
          categoryId: category.id,
          title: sampleTitles[idx],
          slug: faker.helpers.slugify(
            `${faker.lorem.words(3)}-${faker.string.uuid()}`
          ),
          summary: sampleSummaries[idx],
          content: htmlContent,
          markdownContent: markdownContent,
          thumbnailUrl: sampleThumbnailUrl,
          status: faker.helpers.arrayElement(Object.values(ArticleStatus)),
          isPickup,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: {
            create: chosenTags.map((tag) => ({
              tag: { connect: { id: tag.id } },
            })),
          },
        },
      });
      createdCount++;
    }
  }

  console.log(
    `Seeded ${createdCount} articles across ${categories.length} categories.`
  );
}
