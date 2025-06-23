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

  // タイトルとサマリーを3種類用意
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
  const articles = categories.flatMap((category) => {
    return Array.from({ length: 50 }).map(() => {
      // ランダムにタイトルとサマリーを選択
      const idx = faker.number.int({ min: 0, max: 2 });
      return {
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
    `Seeded ${result.count} articles across ${categories.length} categories.`
  );
}
