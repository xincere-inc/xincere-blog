import ContactCTA from '@/components/ContactCTA';
import React from 'react';
import {
  popularArticles,
} from '@/data/marketingStrategyData';
import Pagination from '@/components/Pagination';
import { prisma } from '@/lib/prisma';
import { Image } from 'antd';
import { defaultImageUrl } from '@/data/articleData';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CategoryList from '@/components/CategoryList';

type CategoryPageProps = {
  params: Promise<{ slug: string }>
  searchParams: { page?: string };
}

const CategoriesIndex = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug } = await params;
  const currentPage = Number(searchParams.page) || 1;
  const articlesPerPage = 9;

  // ページネーション計算
  const skip = (currentPage - 1) * articlesPerPage;

  const [articles, category, categories] = await Promise.all([
    // slugに基づいて記事を取得
    prisma.article.findMany({
      where: {
        category: {
          slug: slug
        },
        // status: 'PUBLISHED',
        deletedAt: null,
      },
      include: { 
        author: true,
        category: true
      },
      skip,
      take: articlesPerPage,
      orderBy: {
        createdAt: 'desc' // 最新記事から表示
      }
    }),
    prisma.category.findUnique({
      where: {
        slug: slug
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: { articles: true }
        }
      }
    }),
    prisma.category.findMany({
      where: {
        deletedAt: null,
        articles: {
          some: {
            // status: 'PUBLISHED',
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { articles: true }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  ]);

  // カテゴリーが存在しない場合のエラーハンドリング
  if (!category) {
    redirect('/')
  }

  const totalArticlesCount = category._count.articles;


  return (
    <div>
      {/* ヘッダー */}

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <a
            href="/"
            className="hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            Xincere
          </a>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">{category.name}</span>
        </div>

        {/* カテゴリーヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
          <p className="text-gray-600 mb-4">
            {category.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">記事数:</span>
            <span className="bg-[#E8F0E6] text-primary px-2 py-1 rounded-full">
              {totalArticlesCount}
            </span>
          </div>
          <a
            href="/"
            className="inline-block mt-4 text-primary hover:underline cursor-pointer"
          >
            <i className="fas fa-arrow-left"></i>トップページに戻る
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 記事一覧 */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  href={`/articles/${article.id}`} 
                  key={article.id}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer h-full">
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={article.thumbnailUrl || defaultImageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover object-top"
                        preview={false}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block bg-[#E8F0E6] text-primary text-xs px-3 py-1 rounded-full">
                          {article.category.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {article.createdAt.toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-user-circle mr-2"></i>
                        <span>{article.author.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ページネーション */}
            <Pagination
              totalItems={totalArticlesCount}
              itemsPerPage={articlesPerPage}
              currentPage={currentPage}
            />
          </div>

          {/* サイドバー */}
          <div className="w-full lg:w-1/3">
            {/* 検索ボックス */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="記事を検索"
                  className="w-full pl-10 pr-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div>

            {/* カテゴリー一覧 */}
            <CategoryList categories={categories} currentSlug={slug} />

            {/* 人気記事 */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">人気記事</h3>
              <ul className="space-y-4">
                {popularArticles.map((article) => (
                  <li
                    key={article.id}
                    className="flex space-x-3 cursor-pointer"
                  >
                    <div className="w-[100px] h-[70px] overflow-hidden rounded">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-3 hover:text-primary transition-colors duration-300">
                        {article.title}
                      </h4>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="sticky top-6">
              <ContactCTA /> {/* ContactCTAコンポーネントを使用 */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesIndex;
