'use client';

import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import ArticleGrid from '../components/ArticleGrid';
import Sidebar from '../components/Sidebar';
import { articles, popularArticles, categories } from '../data/articleData'; // データをインポート

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleTabChange = (tab: string) => setActiveTab(tab);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  // フィルタリングされた記事
  const filteredArticles = articles.filter((article) => {
    if (activeTab !== 'all' && article.category !== activeTab) return false;
    if (
      searchQuery &&
      !article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <>
      <main className="container mx-auto px-4">
        {/* ヒーローセクション */}
        <HeroSection />

        {/* メインコンテンツ */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* 記事一覧エリア */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <ArticleGrid
              articles={filteredArticles}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {/* サイドバー */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Sidebar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              categories={categories}
              popularArticles={popularArticles}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
