'use client';

import ContactCTA from '@/components/ContactCTA';
import React, { useState } from 'react';
import {
  articles,
  popularArticles,
  categories,
} from '@/data/marketingStrategyData';

const CategoriesIndex: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // ページネーション計算
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  // ページ変更ハンドラー
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // カテゴリーURLを取得する関数
  const getCategoryUrl = (categoryName: string) => {
    const urlMap: { [key: string]: string } = {
      コンテンツ戦略: '/categories/content-strategy',
      マーケティング戦略: '/categories/marketing-strategy',
      SNSマーケティング: '/categories/sns-marketing',
      SEO対策: '/categories/seo',
      リードジェネレーション: '/categories/lead-generation',
      メール戦略: '/categories/email-strategy',
    };
    return urlMap[categoryName] || '/categories';
  };

  return (
    <div>
      {/* ヘッダー */}

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <a
            href="/"
            className="hover:text-xincereGreen transition-colors duration-300 cursor-pointer"
          >
            Xincere
          </a>
          <span className="mx-2">&gt;</span>
          <a
            href="/blog"
            className="hover:text-xincereGreen transition-colors duration-300 cursor-pointer"
          >
            テックブログ
          </a>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">マーケティング戦略</span>
        </div>

        {/* カテゴリーヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">マーケティング戦略</h1>
          <p className="text-gray-600 mb-4">
            効果的なマーケティング戦略の立案から実行、分析までを網羅するカテゴリーです。BtoB企業のマーケティング担当者向けに、実践的な知識とノウハウを提供します。
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">記事数:</span>
            <span className="bg-[#E8F0E6] text-xincereGreen px-2 py-1 rounded-full">
              {articles.length}
            </span>
          </div>
          <a
            href="/"
            className="inline-block mt-4 text-xincereGreen hover:underline cursor-pointer"
          >
            <i className="fas fa-arrow-left mr-2"></i>元のページに戻る
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 記事一覧 */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block bg-[#E8F0E6] text-xincereGreen text-xs px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {article.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-xincereGreen transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-user-circle mr-2"></i>
                      <span>{article.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ページネーション */}
            <div className="flex justify-center mt-10">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 cursor-pointer'} !rounded-button whitespace-nowrap`}
                >
                  <i className="fas fa-chevron-left mr-1"></i> 前へ
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`w-10 h-10 rounded-md ${currentPage === number ? 'bg-xincereGreen text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} cursor-pointer !rounded-button whitespace-nowrap`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    handlePageChange(
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 cursor-pointer'} !rounded-button whitespace-nowrap`}
                >
                  次へ <i className="fas fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="w-full lg:w-1/3">
            {/* 検索ボックス */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="記事を検索"
                  className="w-full pl-10 pr-4 py-2 border border-xincereGreen rounded-md focus:outline-none focus:ring-2 focus:ring-xincereGreen focus:border-transparent text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xincereGreen">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div>

            {/* カテゴリー一覧 */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">
                カテゴリー
              </h3>
              <ul>
                {categories.map((category) => (
                  <li key={category.name}>
                    <a
                      href={getCategoryUrl(category.name)}
                      className={`flex justify-between items-center py-2 px-2 rounded-md transition-colors duration-300 cursor-pointer ${category.active ? 'bg-[#E8F0E6]' : 'hover:bg-[#E8F0E6]'}`}
                    >
                      <span
                        className={
                          category.active ? 'text-xincereGreen font-medium' : ''
                        }
                      >
                        {category.name}
                      </span>
                      <span className="bg-[#E8F0E6] text-xincereGreen text-xs px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

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
                      <h4 className="text-sm font-medium line-clamp-3 hover:text-xincereGreen transition-colors duration-300">
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
