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

  const sampleTitle =
    'マイクロサービスアーキテクチャで実現した基幹システムの刷新事例';
  const sampleSummary =
    '従来の一枚岩システムをマイクロサービス化することで、開発効率と運用保守性を大幅に向上させた事例を詳しく解説します。';
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
  const articles = categories.flatMap((category) => {
    return Array.from({ length: 10 }).map(() => {
      return {
        authorId: author.id,
        categoryId: category.id,
        title: sampleTitle,
        slug: faker.helpers.slugify(
          `${faker.lorem.words(3)}-${faker.string.uuid()}`
        ),
        summary: sampleSummary,
        content: htmlContent,
        markdownContent: markdownContent,
        thumbnailUrl: sampleThumbnailUrl,
        status: faker.helpers.arrayElement(Object.values(ArticleStatus)),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  });

  const result = await prisma.article.createMany({
    data: articles,
    skipDuplicates: true,
  });

  console.log(
    `✅ Seeded ${result.count} articles across ${categories.length} categories.`
  );
}
