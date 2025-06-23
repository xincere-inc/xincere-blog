'use client';

import type { Prisma, Article as PrismaArticle } from '@prisma/client';
import React from 'react';
import ContactCTA from './ContactCTA';
import CategoryList from './CategoryList';
import PopularArticles from './PopularArticles';
import { defaultImageUrl } from '@/data/articleData';
import SearchBox from './SearchBox';

type Article = Pick<PrismaArticle, 'id' | 'title' | 'thumbnailUrl' | 'slug'>;

type Category = Pick<
  Prisma.CategoryGetPayload<{
    include: { _count: { select: { articles: true } } };
  }>,
  'id' | 'name' | 'slug'
> & {
  _count: { articles: number };
};

interface SidebarProps {
  categories: (Category & { _count: { articles: number } })[];
  popularArticles: Article[];
  currentSlug?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  popularArticles,
  currentSlug,
}) => {
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
