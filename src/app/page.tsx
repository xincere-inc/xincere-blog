import HeroSection from '../components/HeroSection';
import ArticleGrid from '../components/ArticleGrid';
import Sidebar from '../components/Sidebar';
import { popularArticles } from '../data/articleData';
import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';

const HomePage = async () => {
  const [articles, categories] = await Promise.all([
    await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
      },
      include: {
        category: true,
      },
    }),
    await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: ArticleStatus.PUBLISHED } } },
        },
      },
    }),
  ]);

  return (
    <main className="container mx-auto px-4">
      {/* ヒーローセクション */}
      <HeroSection />

      {/* メインコンテンツ */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* 記事一覧エリア */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <ArticleGrid articles={articles} />
        </div>

        {/* サイドバー */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Sidebar categories={categories} popularArticles={popularArticles} />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
