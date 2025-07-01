import React from 'react';
import Pagination from '@/components/Pagination';
import { prisma } from '@/lib/prisma';
import { Image } from 'antd';
import { defaultImageUrl } from '@/data/articleData';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArticleStatus } from '@prisma/client';
import Sidebar from '@/components/Sidebar';
import BreadcrumbsContainer from '@/components/BreadcrumbsContainer';
import { formatDateJP } from '@/lib/utils/date';

type CategoryArticlesPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const CategoryArticles = async ({
  params,
  searchParams,
}: CategoryArticlesPageProps) => {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const articlesPerPage = 9;

  // ページネーション計算
  const skip = (currentPage - 1) * articlesPerPage;

  const [articles, category] = await Promise.all([
    // slugに基づいて記事を取得
    prisma.article.findMany({
      where: {
        category: {
          slug: slug,
        },
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        author: true,
        category: true,
      },
      skip,
      take: articlesPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findUnique({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            articles: {
              where: {
                deletedAt: null,
                status: ArticleStatus.PUBLISHED,
              },
            },
          },
        },
      },
    }),
    prisma.category.findMany({
      where: {
        deletedAt: null,
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
        _count: {
          select: {
            articles: {
              where: {
                deletedAt: null,
                status: ArticleStatus.PUBLISHED,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  ]);

  // カテゴリーが存在しない場合のエラーハンドリング
  if (!category) {
    redirect('/');
  }

  const totalArticlesCount = category._count.articles;

  return (
    <div>
      {/* ヘッダー */}

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <BreadcrumbsContainer title={category.name} />
        {/* カテゴリーヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
          <p className="text-gray-600 mb-4">{category.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">記事数:</span>
            <span className="bg-[#E8F0E6] text-primary px-2 py-1 rounded-full">
              {totalArticlesCount}
            </span>
          </div>
          <Link
            href="/"
            className="inline-block mt-4 text-primary hover:underline cursor-pointer"
          >
            トップページに戻る
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 記事一覧 */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
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
                          {formatDateJP(article.createdAt)}
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
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Sidebar currentSlug={slug} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryArticles;
