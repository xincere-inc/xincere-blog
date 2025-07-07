import BreadcrumbsContainer from '@/components/BreadcrumbsContainer';
import Pagination from '@/components/Pagination';
import SocialLinks from '@/components/SocialLinks';
import { defaultImageUrl } from '@/data/articleData';
import { defaultManImageUrl } from '@/data/authorData';
import { prisma } from '@/lib/prisma';
import { formatDateJP } from '@/lib/utils/date';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

type AuthorDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

const AuthorDetail = async ({ params, searchParams }: AuthorDetailProps) => {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const articlesPerPage = 6;

  // ページネーション計算
  const skip = (currentPage - 1) * articlesPerPage;

  const author = await prisma.author.findUnique({
    where: { id: id },
    include: {
      articles: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          summary: true,
          thumbnailUrl: true,
          createdAt: true,
          category: {
            select: { name: true },
          },
        },
        skip,
        take: articlesPerPage,
      },
      _count: {
        select: {
          articles: {
            where: { deletedAt: null },
          },
        },
      },
    },
  });

  if (!author) {
    // Author not found, redirect to 404 or home
    return redirect('/404');
  }

  const totalArticlesCount = author._count.articles;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <BreadcrumbsContainer title={author?.name} />

        {/* プロフィールセクション */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 flex items-center justify-center">
              <Image
                src={author.avatarUrl || defaultManImageUrl}
                alt={author.name}
                width={192}
                height={192}
                className="w-48 h-48 rounded-full object-cover object-top"
              />
            </div>
            {/* プロフィール情報 */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {author.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{author.title}</p>

              <div className="flex justify-center md:justify-start space-x-4 mb-6">
                <SocialLinks twitterUrl="#" facebookUrl="#" linkedinUrl="#" />
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">{author.bio}</p>
            </div>
          </div>
        </div>

        {/* 執筆記事セクション */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            著者の記事一覧
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {author.articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.thumbnailUrl || defaultImageUrl}
                    alt="記事サムネイル"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {article.category.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      2025年5月{formatDateJP(article.createdAt)}日
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2"></h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  <Link
                    href={`/articles/${article.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                  >
                    続きを読む <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Pagination
              totalItems={totalArticlesCount}
              itemsPerPage={articlesPerPage}
              currentPage={currentPage}
            />
          </div>
        </div>

        {/* CTAセクション */}
        <div
          id="contact"
          className="bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow-lg p-8 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            マーケティングでお困りですか？
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            BtoBマーケティングの課題解決をサポートします。無料相談やお役立ち資料をご活用ください。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contacts"
              className="bg-white text-primary px-8 py-3 rounded-button text-lg font-medium hover:bg-gray-100 transition duration-300 cursor-pointer whitespace-nowrap"
            >
              無料相談を予約する <i className="fas fa-calendar-alt ml-2"></i>
            </Link>
            <a
              href="#"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-button text-lg font-medium hover:bg-white/10 transition duration-300 cursor-pointer whitespace-nowrap"
            >
              資料をダウンロード <i className="fas fa-download ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetail;
