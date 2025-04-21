import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedCategories() {
  console.log('Seeding categories...');

  await prisma.category.deleteMany({});

  const categories = [
    {
      name: 'システム設計',
      slug: 'system-design',
      description: 'アーキテクチャ設計、パターン、設計原則についての解説記事',
    },
    {
      name: 'クラウド技術',
      slug: 'cloud-technology',
      description: 'AWS、Azure、GCPなどのクラウドサービスに関する技術情報',
    },
    {
      name: 'アジャイル開発',
      slug: 'agile-development',
      description: 'スクラム、カンバン、XPなどのアジャイル手法の実践例と知見',
    },
    {
      name: 'モバイル開発',
      slug: 'mobile-development',
      description: 'iOS、Android、クロスプラットフォーム開発の技術とトレンド',
    },
    {
      name: 'セキュリティ',
      slug: 'security',
      description:
        'セキュリティ対策、脆弱性対応、セキュアコーディングに関する情報',
    },
    {
      name: '開発事例',
      slug: 'development-cases',
      description: '実際のプロジェクト事例、成功例、失敗から学んだこと',
    },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  const categoriesCount = await prisma.category.count({});
  console.log(`Seeded ${categoriesCount} categories successfully.`);
}
