import HeroSection from '../components/HeroSection';
import ArticleGrid from '../components/ArticleGrid';
import Sidebar from '../components/Sidebar';
import { articles, popularArticles, categories } from '../data/articleData'; // データをインポート

const HomePage = () => {
  // フィルタリングされた記事
  const filteredArticles = articles;

  return (
    <main className="container mx-auto px-4">
      {/* ヒーローセクション */}
      <HeroSection />

      {/* メインコンテンツ */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* 記事一覧エリア */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <ArticleGrid articles={filteredArticles} />
        </div>

        {/* サイドバー */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Sidebar categories={categories} popularArticles={popularArticles} />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
