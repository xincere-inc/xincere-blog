'use client';

import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import ArticleGrid from '../components/ArticleGrid';
import Sidebar from '../components/Sidebar';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleTabChange = (tab: string) => setActiveTab(tab);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  // 記事データ、人気記事、カテゴリー一覧
  const articles = [
    {
      id: 1,
      title: 'マイクロサービスアーキテクチャで実現した基幹システムの刷新事例',
      excerpt:
        '従来の一枚岩システムをマイクロサービス化することで、開発効率と運用保守性を大幅に向上させた事例を詳しく解説します。',
      category: 'システム設計',
      date: '2025-04-05',
      image:
        'https://readdy.ai/api/search-image?query=Software%20development%20team%20working%20on%20microservices%20architecture%20diagram%2C%20modern%20tech%20office%20with%20multiple%20screens%20showing%20system%20design%2C%20professional%20environment%20with%20green%20accents&width=400&height=225&seq=1&orientation=landscape',
    },
    {
      id: 2,
      title: 'SNSマーケティングで成功した企業事例',
      excerpt:
        'Instagram、TikTokを活用したブランディング戦略により、若年層の認知度が200%向上した美容ブランドの事例を紹介。',
      category: 'SNSマーケティング',
      date: '2025-04-01',
      image:
        'https://readdy.ai/api/search-image?query=Social%20media%20marketing%20team%20reviewing%20content%20strategy%20on%20large%20screens%2C%20creative%20office%20space%20with%20engagement%20metrics%20displayed%2C%20professional%20marketing%20environment%20with%20green%20plants&width=400&height=225&seq=2&orientation=landscape',
    },
    {
      id: 3,
      title: 'コンテンツマーケティングの効果的な実践方法',
      excerpt:
        'オーガニック流入を3倍に増やした、SEO対策とコンテンツ制作の具体的な手法について解説します。',
      category: 'コンテンツ戦略',
      date: '2025-03-28',
      image:
        'https://readdy.ai/api/search-image?query=Content%20marketing%20planning%20session%20with%20SEO%20analytics%20displayed%2C%20team%20collaborating%20on%20editorial%20calendar%2C%20modern%20marketing%20office%20with%20green%20design%20elements&width=400&height=225&seq=3&orientation=landscape',
    },
    {
      id: 4,
      title: '新サービス「MOLTSアナリティクス」をリリース',
      excerpt:
        'マーケティングROIを可視化する新しい分析ツールをリリースしました。無料トライアルを開始しています。',
      category: 'お知らせ',
      date: '2025-03-25',
      image:
        'https://readdy.ai/api/search-image?query=Marketing%20analytics%20dashboard%20with%20ROI%20metrics%2C%20professional%20data%20visualization%20interface%2C%20modern%20software%20launch%20presentation%20with%20green%20brand%20elements&width=400&height=225&seq=4&orientation=landscape',
    },
    {
      id: 5,
      title: 'BtoBマーケティングの最新トレンド2025',
      excerpt:
        'リードジェネレーションからナーチャリングまで、最新のBtoBマーケティング手法と成功事例を紹介します。',
      category: 'マーケティング戦略',
      date: '2025-03-20',
      image:
        'https://readdy.ai/api/search-image?query=B2B%20marketing%20strategy%20meeting%20with%20lead%20generation%20funnel%20displayed%2C%20professional%20business%20environment%20with%20marketing%20team%20discussion%2C%20modern%20office%20with%20green%20accents&width=400&height=225&seq=5&orientation=landscape',
    },
    {
      id: 6,
      title: 'メールマーケティングで実現した開封率40%の施策',
      excerpt:
        'セグメンテーションとパーソナライゼーションを活用し、平均開封率を40%まで向上させた具体的な手法を解説。',
      category: 'メール戦略',
      date: '2025-03-15',
      image:
        'https://readdy.ai/api/search-image?query=Email%20marketing%20campaign%20analysis%20on%20computer%20screens%2C%20marketing%20team%20reviewing%20performance%20metrics%2C%20professional%20office%20setting%20with%20green%20design%20elements&width=400&height=225&seq=6&orientation=landscape',
    },
  ];
  const popularArticles = [
    {
      id: 1,
      title: 'マーケティングROIを2倍にする実践テクニック',
      image:
        'https://readdy.ai/api/search-image?query=Marketing%20ROI%20dashboard%20with%20positive%20metrics%2C%20professional%20marketing%20team%20analyzing%20data%2C%20modern%20office%20with%20green%20design%20elements%2C%20high%20quality%20professional%20photo&width=100&height=70&seq=7&orientation=landscape',
    },
    {
      id: 2,
      title: 'Instagram広告完全攻略ガイド2025',
      image:
        'https://readdy.ai/api/search-image?query=Social%20media%20marketing%20team%20reviewing%20Instagram%20campaign%20results%2C%20professional%20marketing%20workspace%20with%20analytics%20displays%2C%20green%20accent%20wall%2C%20high%20quality%20professional%20photo&width=100&height=70&seq=8&orientation=landscape',
    },
    {
      id: 3,
      title: '失敗しないコンテンツマーケティング入門',
      image:
        'https://readdy.ai/api/search-image?query=Content%20marketing%20planning%20session%20with%20editorial%20calendar%2C%20professional%20marketing%20team%20collaboration%2C%20modern%20office%20with%20green%20plants%2C%20high%20quality%20professional%20photo&width=100&height=70&seq=9&orientation=landscape',
    },
  ];
  const categories = [
    { name: 'システム設計', count: 12 },
    { name: 'クラウド技術', count: 8 },
    { name: 'アジャイル開発', count: 10 },
    { name: 'モバイル開発', count: 6 },
    { name: 'セキュリティ', count: 7 },
    { name: '開発事例', count: 4 },
  ];

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
