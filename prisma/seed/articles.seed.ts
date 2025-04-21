import { PrismaClient, ArticleStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seedArticles() {
  console.log('Seeding articles...');

  await prisma.article.deleteMany({});

  const adminUser = await prisma.user.findFirst({
    where: {
      role: 'admin',
    },
  });
  const user = await prisma.user.findFirst({
    where: {
      role: 'user',
    },
  });

  if (!user || !adminUser) {
    console.error('ユーザーが見つかりません。');
    return;
  }
  const categories = await prisma.category.findMany({});

  const sampleTitle =
    'マイクロサービスアーキテクチャで実現した基幹システムの刷新事例';
  const sampleSummary =
    '従来の一枚岩システムをマイクロサービス化することで、開発効率と運用保守性を大幅に向上させた事例を詳しく解説します。';
  const sampleThumbnailUrl =
    'https://readdy.ai/api/search-image?query=Software%20development%20team%20working%20on%20microservices%20architecture%20diagram%2C%20modern%20tech%20office%20with%20multiple%20screens%20showing%20system%20design%2C%20professional%20environment%20with%20green%20accents&width=400&height=225&seq=1&orientation=landscape';

  const userArticles = Array.from({ length: 5 }).map(() => {
    return {
      authorId: user.id,
      categoryId: faker.helpers.arrayElement(categories).id,
      title: sampleTitle,
      slug: faker.helpers.slugify(faker.lorem.sentence()),
      summary: sampleSummary,
      content: faker.lorem.paragraphs(5),
      thumbnailUrl: sampleThumbnailUrl,
      status: faker.helpers.arrayElement(Object.values(ArticleStatus)),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const adminArticles = Array.from({ length: 5 }).map(() => {
    return {
      authorId: adminUser.id,
      categoryId: faker.helpers.arrayElement(categories).id,
      title: sampleTitle,
      slug: faker.helpers.slugify(faker.lorem.sentence()),
      summary: sampleSummary,
      content: faker.lorem.paragraphs(5),
      thumbnailUrl: sampleThumbnailUrl,
      status: faker.helpers.arrayElement(Object.values(ArticleStatus)),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const articles = [...userArticles, ...adminArticles];
  const result = await prisma.article.createMany({
    data: articles,
  });

  console.log(`Seeded ${result.count} articles successfully.`);
}
