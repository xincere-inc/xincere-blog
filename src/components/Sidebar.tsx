import React from 'react';
import ContactCTA from './ContactCTA';
import CategoryList from './CategoryList';
import PopularArticles from './PopularArticles';
import { defaultImageUrl } from '@/data/articleData';
import SearchBox from './SearchBox';
import { prisma } from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';

interface SidebarProps {
  currentSlug?: string;
}

const Sidebar = async ({ currentSlug }: SidebarProps) => {
  const [popularArticles, categories] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        analytics: {
          isNot: null,
        },
      },
      orderBy: {
        analytics: {
          viewsCount: 'desc',
        },
      },
      take: 4,
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
    <>
      {/* 検索ボックス */}
      <SearchBox />
      {/* カテゴリー一覧 */}
      <CategoryList categories={categories} currentSlug={currentSlug} />
      {/* 人気記事 */}
      <PopularArticles
        articles={popularArticles}
        defaultImageUrl={defaultImageUrl}
      />
      {/* CTA */}
      <ContactCTA />
    </>
  );
};

export default Sidebar;
