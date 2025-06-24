import React from 'react';
import Pagination from '@/components/Pagination';
import { prisma } from '@/lib/prisma';
import { Image } from 'antd';
import { defaultImageUrl } from '@/data/articleData';
import Link from 'next/link';
import { ArticleStatus, Prisma } from '@prisma/client';
import Sidebar from '@/components/Sidebar';
import BreadcrumbsContainer from '@/components/BreadcrumbsContainer';

type ArticlesPageProps = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

const ArticlesIndex = async ({ searchParams }: ArticlesPageProps) => {
  const { page, q } = await searchParams;
  const currentPage = Number(page) || 1;
  const articlesPerPage = 9;
  const searchQuery = q || '';

  // ページネーション計算
  const skip = (currentPage - 1) * articlesPerPage;

  // 検索条件の設定
  const searchFilter = searchQuery
    ? {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            summary: {
              contains: searchQuery,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : {};

  const [articles, totalArticlesCount, categories] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        ...searchFilter,
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
    prisma.article.count({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        ...searchFilter,
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

  // TODO: 閲覧数やいいね数を実装後に置き換える
  const popularArticles = articles.slice(0, 4);

  const pageTitle = searchQuery ? `"${searchQuery}"の検索結果` : '記事一覧';

  return (
    <div>
      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <BreadcrumbsContainer />

        {/* ページヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? `「${searchQuery}」を含む記事が${totalArticlesCount}件見つかりました。`
              : 'すべての記事を表示しています。'}
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
          <div className="w-full lg:w-2/3 xl:w-3/4">
            {articles.length > 0 ? (
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
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">
                  {searchQuery
                    ? `「${searchQuery}」に一致する記事が見つかりませんでした。`
                    : '記事がありません。'}
                </p>
              </div>
            )}

            {/* ページネーション */}
            {totalArticlesCount > 0 && (
              <Pagination
                totalItems={totalArticlesCount}
                itemsPerPage={articlesPerPage}
                currentPage={currentPage}
              />
            )}
          </div>

          {/* サイドバー */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Sidebar
              categories={categories}
              popularArticles={popularArticles}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticlesIndex;
