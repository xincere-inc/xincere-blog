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
    {
      name: 'フロントエンド',
      slug: 'frontend',
      description: 'React、Vue、Angularなどのフロントエンド技術と実践',
    },
    {
      name: 'バックエンド',
      slug: 'backend',
      description: 'Node.js、Django、Railsなどのサーバーサイド技術',
    },
    {
      name: 'データベース',
      slug: 'database',
      description: 'SQL、NoSQL、データ設計、パフォーマンスチューニング',
    },
    {
      name: 'DevOps',
      slug: 'devops',
      description: 'CI/CD、インフラ自動化、監視と運用のベストプラクティス',
    },
    {
      name: '機械学習',
      slug: 'machine-learning',
      description: 'AI、深層学習、データサイエンスの最新トレンドと技術',
    },
    {
      name: 'テスト',
      slug: 'testing',
      description: 'ユニットテスト、統合テスト、E2Eテストの手法とツール',
    },
    {
      name: 'パフォーマンス',
      slug: 'performance',
      description: 'アプリケーションの高速化、最適化技術と計測方法',
    },
    {
      name: 'UI/UX',
      slug: 'ui-ux',
      description: 'ユーザーインターフェース設計、ユーザー体験の改善',
    },
    {
      name: '技術トレンド',
      slug: 'technology-trends',
      description: '最新技術、業界動向、将来予測についての分析',
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
