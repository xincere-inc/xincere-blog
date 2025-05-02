'use client';

import type { Article, Category } from '@prisma/client';
import React, { useState } from 'react';
import ArticleIndexCard from './ArticleIndexCard'; // 新しいコンポーネントをインポート

interface ArticleGridProps {
  articles: (Article & { category: Category })[];
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
  console.log('articles', articles);
  const [activeTab, setActiveTab] = useState<string>('all');
  const handleTabChange = (tab: string) => setActiveTab(tab);

  const tabs = [
    'all',
    'マーケティング戦略',
    'SNSマーケティング',
    'コンテンツ戦略',
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">テックブログ</h1>
      {/* タブナビゲーション */}
      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-t-md transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-[#E8F0E6 text-gray-700 hover:bg-primary-light'
            }`}
          >
            {tab === 'all' ? 'すべて' : tab}
          </button>
        ))}
      </div>
      {/* 記事グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {articles.map((article) => (
          <ArticleIndexCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
};

export default ArticleGrid;
