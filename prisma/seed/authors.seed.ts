import { PrismaClient } from '@prisma/client';
import { fakerJA } from '@faker-js/faker';

const prisma = new PrismaClient();

// ビジネスプロフィールのtitleとbioの組み合わせ
const profiles = [
  {
    title: 'Xincere マーケティング責任者',
    bio: '10年以上のBtoBマーケティング経験を持ち、特にコンテンツマーケティングとSEO戦略に精通。',
  },
  {
    title: 'Xincere プロダクトマネージャー',
    bio: 'SaaSプロダクトの企画・開発からグロースまで一貫して担当。ユーザー視点を重視したプロダクト設計とデータドリブンな意思決定が強み。',
  },
  {
    title: 'Xincere テクニカルリード',
    bio: 'Webアプリケーション開発歴15年。大規模システムの設計・運用や、チームビルディング、技術選定の実績多数。',
  },
  {
    title: 'Xincere カスタマーサクセスマネージャー',
    bio: '顧客の課題解決を第一に、導入支援から運用定着まで幅広くサポート。BtoB領域でのカスタマーサクセス経験が豊富。',
  },
  {
    title: 'Xincere セールスディレクター',
    bio: 'IT業界での法人営業歴12年。新規開拓からアカウントマネジメントまで幅広く担当し、数多くの大手企業との取引実績を持つ。',
  },
];

export async function seedAuthors() {
  console.log('Seeding authors...');

  await prisma.author.deleteMany({});

  const authorsData = Array.from({ length: 5 }).map(() => {
    const profile = profiles[Math.floor(Math.random() * profiles.length)];
    return {
      name: fakerJA.person.fullName(),
      title: profile.title,
      bio: profile.bio,
      avatarUrl: fakerJA.image.avatar(),
      createdAt: fakerJA.date.past(),
      updatedAt: new Date(),
    };
  });

  const result = await prisma.author.createMany({ data: authorsData });
  console.log(`Seeded ${result.count} authors successfully.`);
}
