import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import ArticleGrid from 'src/components/ArticleGrid';
import HeroSection from 'src/components/HeroSection';
import PickUpArticle from 'src/components/PickUpArticle';
import Sidebar from 'src/components/Sidebar';
import H2 from 'src/components/organisms/h2';
import { popularArticles } from 'src/data/articleData';

const HomePage = async () => {
  const [articles, tabCategories, categories] = await Promise.all([
     prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        category: true,
      },
    }),
    prisma.category.findMany({
      take: 6, // Load first 6 categories initially
      skip: 0,
      where: {
        articles: {
          some: {
            status: ArticleStatus.PUBLISHED,
            deletedAt: null,
          },
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
          <PickUpArticle
            imageUrl="https://readdy.ai/api/search-image?query=Professional%20female%20freelancer%20working%20on%20laptop%20in%20modern%20office%20space%20with%20natural%20lighting%2C%20business%20attire%2C%20confident%20pose&width=200&height=300&seq=10&orientation=portrait"
            authorImageUrl="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Asian%20woman%20in%20business%20attire%2C%20neutral%20background&width=40&height=40&seq=11&orientation=squarish"
            authorName="永田 さおり"
            title="フリーランスで独立後「粗利3000万を当たり前に稼ぐ」ために必要な5つのこと"
          />
          <PickUpArticle
            imageUrl="https://readdy.ai/api/search-image?query=SEO%20analytics%20dashboard%20on%20computer%20screen%20in%20modern%20office%20setting%2C%20professional%20environment&width=200&height=300&seq=12&orientation=portrait"
            authorImageUrl="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Asian%20man%20in%20business%20attire%2C%20neutral%20background&width=40&height=40&seq=13&orientation=squarish"
            authorName="田島 光太郎"
            title="後発のBtoBメディアがコンテンツSEOで勝ち切るために必要だった10のこと"
            link="https://readdy.ai/home/be8c1c9a-dd36-4a42-bf07-949bb16184d3/178b2350-1f75-4d94-b2e2-d26325a9c972"
          />
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
          <Sidebar categories={categories} popularArticles={popularArticles} />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
