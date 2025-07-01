import { defaultImageUrl } from '@/data/articleData';
import { defaultManImageUrl } from '@/data/authorData';
import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import ArticleGrid from 'src/components/ArticleGrid';
import HeroSection from 'src/components/HeroSection';
import PickUpArticle from 'src/components/PickUpArticle';
import Sidebar from 'src/components/Sidebar';
import H2 from 'src/components/organisms/h2';

const HomePage = async () => {
  const [articles, pickupArticles, tabCategories] = await Promise.all([
    prisma.article.findMany({
      take: 9,
      skip: 0,
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    // TODO: ピックアップ記事の取得方法を確認する、ひとまず最新の２件を取得する
    prisma.article.findMany({
      take: 2,
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany({
      where: {
        articles: {
          some: {
            status: ArticleStatus.PUBLISHED,
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        _count: {
          select: {
            articles: {
              where: {
                status: ArticleStatus.PUBLISHED,
                deletedAt: null,
              },
            },
          },
        },
      },
    }),
  ]);

  return (
    <main className="container mx-auto px-4">
      {/* ヒーローセクション */}
      <HeroSection />

      {/* ピックアップ記事 */}
      <div className="mb-12">
        <H2 title="PICK UP" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {pickupArticles.map((article) => (
            <PickUpArticle
              key={article.id}
              imageUrl={article.thumbnailUrl || defaultImageUrl}
              authorImageUrl={article.author.avatarUrl || defaultManImageUrl}
              authorName={article.author.name}
              title={article.title}
              link={`/articles/${article.id}`}
            />
          ))}
        </div>
      </div>
      {/* メインコンテンツ */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* 記事一覧エリア */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <ArticleGrid initialCategories={tabCategories} articles={articles} />
        </div>

        {/* サイドバー */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
