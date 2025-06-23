'use client';

import type { Prisma, Article as PrismaArticle } from '@prisma/client';
import React, { useState } from 'react';
import ContactCTA from './ContactCTA';
import CategoryList from './CategoryList';
import PopularArticles from './PopularArticles';
import { defaultImageUrl } from '@/data/articleData';

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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  return (
    <>
      {/* 検索ボックス */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="記事を検索"
            className="w-full pl-10 pr-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>
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
