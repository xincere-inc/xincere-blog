import React from 'react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

interface ArticleGridProps {
  articles: Article[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  activeTab,
  onTabChange,
}) => {
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
            onClick={() => onTabChange(tab)}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-t-md transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'bg-[#427C2E] text-white'
                : 'bg-[#E8F0E6] text-gray-700 hover:bg-[#d8e6d2]'
            }`}
          >
            {tab === 'all' ? 'すべて' : tab}
          </button>
        ))}
      </div>
      {/* 記事グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer"
          >
            <div className="h-[180px] overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block bg-[#E8F0E6] text-[#427C2E] text-xs px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-gray-500 text-xs">{article.date}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {article.excerpt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ArticleGrid;
