'use client';

import type { Category } from '@prisma/client';
import React, { useState } from 'react';
import ContactCTA from './ContactCTA';
import CategoryList from './CategoryList';

interface Article {
  id: number;
  title: string;
  image: string;
}

interface SidebarProps {
  categories: (Category & { _count: { articles: number } })[];
  popularArticles: Article[];
}

const Sidebar: React.FC<SidebarProps> = ({ categories, popularArticles }) => {
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
      <CategoryList categories={categories} />
      {/* 人気記事 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-bold text-lg mb-4 border-b pb-2">人気記事</h3>
        <ul className="space-y-4">
          {popularArticles.map((article) => (
            <li key={article.id} className="flex space-x-3 cursor-pointer">
              <div className="w-[100px] h-[70px] overflow-hidden rounded">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-3">
                  {article.title}
                </h4>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* CTA */}
      <ContactCTA />
    </>
  );
};

export default Sidebar;
