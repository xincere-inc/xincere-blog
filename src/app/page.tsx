"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const iconStyle: React.CSSProperties = { padding: 10, fontSize: 24 };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  // 記事データ
  const articles = [
    {
      id: 1,
      title: "マイクロサービスアーキテクチャで実現した基幹システムの刷新事例",
      excerpt:
        "従来の一枚岩システムをマイクロサービス化することで、開発効率と運用保守性を大幅に向上させた事例を詳しく解説します。",
      category: "システム設計",
      date: "2025-04-05",
      image:
        "https://readdy.ai/api/search-image?query=Software%20development%20team%20working%20on%20microservices%20architecture%20diagram%2C%20modern%20tech%20office%20with%20multiple%20screens%20showing%20system%20design%2C%20professional%20environment%20with%20green%20accents&width=400&height=225&seq=1&orientation=landscape",
    },
    {
      id: 2,
      title: "SNSマーケティングで成功した企業事例",
      excerpt:
        "Instagram、TikTokを活用したブランディング戦略により、若年層の認知度が200%向上した美容ブランドの事例を紹介。",
      category: "SNSマーケティング",
      date: "2025-04-01",
      image:
        "https://readdy.ai/api/search-image?query=Social%20media%20marketing%20team%20reviewing%20content%20strategy%20on%20large%20screens%2C%20creative%20office%20space%20with%20engagement%20metrics%20displayed%2C%20professional%20marketing%20environment%20with%20green%20plants&width=400&height=225&seq=2&orientation=landscape",
    },
    {
      id: 3,
      title: "コンテンツマーケティングの効果的な実践方法",
      excerpt:
        "オーガニック流入を3倍に増やした、SEO対策とコンテンツ制作の具体的な手法について解説します。",
      category: "コンテンツ戦略",
      date: "2025-03-28",
      image:
        "https://readdy.ai/api/search-image?query=Content%20marketing%20planning%20session%20with%20SEO%20analytics%20displayed%2C%20team%20collaborating%20on%20editorial%20calendar%2C%20modern%20marketing%20office%20with%20green%20design%20elements&width=400&height=225&seq=3&orientation=landscape",
    },
    {
      id: 4,
      title: "新サービス「MOLTSアナリティクス」をリリース",
      excerpt:
        "マーケティングROIを可視化する新しい分析ツールをリリースしました。無料トライアルを開始しています。",
      category: "お知らせ",
      date: "2025-03-25",
      image:
        "https://readdy.ai/api/search-image?query=Marketing%20analytics%20dashboard%20with%20ROI%20metrics%2C%20professional%20data%20visualization%20interface%2C%20modern%20software%20launch%20presentation%20with%20green%20brand%20elements&width=400&height=225&seq=4&orientation=landscape",
    },
    {
      id: 5,
      title: "BtoBマーケティングの最新トレンド2025",
      excerpt:
        "リードジェネレーションからナーチャリングまで、最新のBtoBマーケティング手法と成功事例を紹介します。",
      category: "マーケティング戦略",
      date: "2025-03-20",
      image:
        "https://readdy.ai/api/search-image?query=B2B%20marketing%20strategy%20meeting%20with%20lead%20generation%20funnel%20displayed%2C%20professional%20business%20environment%20with%20marketing%20team%20discussion%2C%20modern%20office%20with%20green%20accents&width=400&height=225&seq=5&orientation=landscape",
    },
    {
      id: 6,
      title: "メールマーケティングで実現した開封率40%の施策",
      excerpt:
        "セグメンテーションとパーソナライゼーションを活用し、平均開封率を40%まで向上させた具体的な手法を解説。",
      category: "メール戦略",
      date: "2025-03-15",
      image:
        "https://readdy.ai/api/search-image?query=Email%20marketing%20campaign%20analysis%20on%20computer%20screens%2C%20marketing%20team%20reviewing%20performance%20metrics%2C%20professional%20office%20setting%20with%20green%20design%20elements&width=400&height=225&seq=6&orientation=landscape",
    },
  ];
  // 人気記事
  const popularArticles = [
    {
      id: 1,
      title: "マーケティングROIを2倍にする実践テクニック",
      image:
        "https://readdy.ai/api/search-image?query=Marketing%20ROI%20dashboard%20with%20positive%20metrics%2C%20professional%20marketing%20team%20analyzing%20data%2C%20modern%20office%20with%20green%20design%20elements%2C%20high%20quality%20professional%20photo&width=100&height=70&seq=7&orientation=landscape",
    },
    {
      id: 2,
      title: "Instagram広告完全攻略ガイド2025",
      image:
        "https://readdy.ai/api/search-image?query=Social%20media%20marketing%20team%20reviewing%20Instagram%20campaign%20results%2C%20professional%20marketing%20workspace%20with%20analytics%20displays%2C%20green%20accent%20wall%2C%20high%20quality%20professional%20photo&width=100&height=70&seq=8&orientation=landscape",
    },
    {
      id: 3,
      title: "失敗しないコンテンツマーケティング入門",
      image:
        "https://readdy.ai/api/search-image?query=Content%20marketing%20planning%20session%20with%20editorial%20calendar%2C%20professional%20marketing%20team%20collaboration%2C%20modern%20office%20with%20green%20plants%2C%20high%20quality%20professional%20photo&width=100&height=70&seq=9&orientation=landscape",
    },
  ];
  // カテゴリー一覧
  const categories = [
    { name: "システム設計", count: 12 },
    { name: "クラウド技術", count: 8 },
    { name: "アジャイル開発", count: 10 },
    { name: "モバイル開発", count: 6 },
    { name: "セキュリティ", count: 7 },
    { name: "開発事例", count: 4 },
  ];
  // フィルタリングされた記事
  const filteredArticles = articles.filter((article) => {
    if (activeTab !== "all" && article.category !== activeTab) {
      return false;
    }
    if (
      searchQuery &&
      !article.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm h-[70px] flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="text-[#427C2E] font-bold text-2xl">SINCERE</div>
              <div className="text-gray-600 ml-2 text-sm">Tech Blog</div>
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-800 hover:text-[#427C2E] transition-colors duration-300"
            >
              開発サービス
            </a>
            <a
              href="#"
              className="text-gray-800 hover:text-[#427C2E] transition-colors duration-300"
            >
              導入事例
            </a>
            <a
              href="#"
              className="text-gray-800 hover:text-[#427C2E] transition-colors duration-300"
            >
              技術スタック
            </a>
            <a
              href="#"
              className="bg-[#427C2E] text-white px-4 py-2 rounded-md hover:bg-[#356423] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
            >
              無料相談
            </a>
          </nav>
          <button className="md:hidden text-gray-800 cursor-pointer">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </header>
      {/* メインコンテンツ */}
      <main className="container mx-auto px-4">
        {/* ヒーローセクション */}
        <div className="bg-[#E8F0E6] rounded-lg p-8 mb-12 mt-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              DX時代のシステム開発を
              <br />
              成功に導くテックブログ
            </h1>
            <p className="text-lg mb-8">
              最新技術とプロジェクト実績に基づく知見を発信。
              <br />
              システム開発やDX推進に関する実践的な情報をお届けします。
            </p>
            <div className="flex gap-4">
              <button className="bg-[#427C2E] text-white px-6 py-3 rounded-md hover:bg-[#356423] transition-colors duration-300 flex items-center !rounded-button whitespace-nowrap cursor-pointer">
                <i className="fas fa-download mr-2"></i>
                会社案内ダウンロード
              </button>
              <button className="bg-white text-[#427C2E] px-6 py-3 rounded-md hover:bg-gray-50 transition-colors duration-300 border border-[#427C2E] !rounded-button whitespace-nowrap cursor-pointer">
                コーポレートサイトを見る
              </button>
            </div>
          </div>
        </div>
        {/* ピックアップ記事 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">PICK UP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex cursor-pointer hover:shadow-md transition-all duration-300">
              <div className="w-1/3">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20female%20freelancer%20working%20on%20laptop%20in%20modern%20office%20space%20with%20natural%20lighting%2C%20business%20attire%2C%20confident%20pose&width=200&height=300&seq=10&orientation=portrait"
                  alt="フリーランス記事"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-4">
                <div className="flex items-center mb-2">
                  <img
                    src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Asian%20woman%20in%20business%20attire%2C%20neutral%20background&width=40&height=40&seq=11&orientation=squarish"
                    alt="著者"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm">永田 さおり</span>
                </div>
                <h3 className="font-bold mb-2 line-clamp-2">
                  フリーランスで独立後「粗利3000万を当たり前に稼ぐ」ために必要な5つのこと
                </h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex cursor-pointer hover:shadow-md transition-all duration-300">
              <div className="w-1/3">
                <img
                  src="https://readdy.ai/api/search-image?query=SEO%20analytics%20dashboard%20on%20computer%20screen%20in%20modern%20office%20setting%2C%20professional%20environment&width=200&height=300&seq=12&orientation=portrait"
                  alt="SEO記事"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-4">
                <div className="flex items-center mb-2">
                  <img
                    src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20Asian%20man%20in%20business%20attire%2C%20neutral%20background&width=40&height=40&seq=13&orientation=squarish"
                    alt="著者"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm">田島 光太郎</span>
                </div>
                <a
                  href="https://readdy.ai/home/be8c1c9a-dd36-4a42-bf07-949bb16184d3/178b2350-1f75-4d94-b2e2-d26325a9c972"
                  data-readdy="true"
                >
                  <h3 className="font-bold mb-2 line-clamp-2">
                    後発のBtoBメディアがコンテンツSEOで勝ち切るために必要だった10のこと
                  </h3>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* 記事一覧エリア */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl font-bold mb-8">テックブログ</h1>
            {/* タブナビゲーション */}
            <div className="flex flex-wrap mb-8 border-b">
              <button
                onClick={() => handleTabChange("all")}
                className={`px-6 py-3 text-sm font-medium rounded-t-md transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === "all" ? "bg-[#427C2E] text-white" : "bg-[#E8F0E6] text-gray-700 hover:bg-[#d8e6d2]"}`}
              >
                すべて
              </button>
              <button
                onClick={() => handleTabChange("マーケティング戦略")}
                className={`px-6 py-3 text-sm font-medium rounded-t-md transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === "マーケティング戦略" ? "bg-[#427C2E] text-white" : "bg-[#E8F0E6] text-gray-700 hover:bg-[#d8e6d2]"}`}
              >
                マーケティング戦略
              </button>
              <button
                onClick={() => handleTabChange("SNSマーケティング")}
                className={`px-6 py-3 text-sm font-medium rounded-t-md transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === "SNSマーケティング" ? "bg-[#427C2E] text-white" : "bg-[#E8F0E6] text-gray-700 hover:bg-[#d8e6d2]"}`}
              >
                SNSマーケティング
              </button>
              <button
                onClick={() => handleTabChange("コンテンツ戦略")}
                className={`px-6 py-3 text-sm font-medium rounded-t-md transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === "コンテンツ戦略" ? "bg-[#427C2E] text-white" : "bg-[#E8F0E6] text-gray-700 hover:bg-[#d8e6d2]"}`}
              >
                コンテンツ戦略
              </button>
            </div>
            {/* 記事グリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
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
                      <span className="text-gray-500 text-xs">
                        {article.date}
                      </span>
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
            {/* ページネーション */}
            <div className="flex justify-center mt-10">
              <div className="flex space-x-2">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-md border border-[#E8F0E6] text-gray-600 hover:bg-[#E8F0E6] transition-colors duration-300 cursor-pointer"
                >
                  <i className="fas fa-chevron-left text-sm"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-[#427C2E] text-white cursor-pointer"
                >
                  1
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-md border border-[#E8F0E6] text-gray-600 hover:bg-[#E8F0E6] transition-colors duration-300 cursor-pointer"
                >
                  2
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-md border border-[#E8F0E6] text-gray-600 hover:bg-[#E8F0E6] transition-colors duration-300 cursor-pointer"
                >
                  3
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-md border border-[#E8F0E6] text-gray-600 hover:bg-[#E8F0E6] transition-colors duration-300 cursor-pointer"
                >
                  <i className="fas fa-chevron-right text-sm"></i>
                </a>
              </div>
            </div>
          </div>
          {/* サイドバー */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            {/* 検索ボックス */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="記事を検索"
                  className="w-full pl-10 pr-4 py-2 border border-[#427C2E] rounded-md focus:outline-none focus:ring-2 focus:ring-[#427C2E] focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#427C2E]">
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
                {categories.map((category, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex justify-between items-center py-2 hover:bg-[#E8F0E6] px-2 rounded-md transition-colors duration-300 cursor-pointer"
                    >
                      <span>{category.name}</span>
                      <span className="bg-[#E8F0E6] text-[#427C2E] text-xs px-2 py-1 rounded-full">
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
                      <h4 className="text-sm font-medium line-clamp-3">
                        {article.title}
                      </h4>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* CTA */}
            <div className="bg-[#E8F0E6] p-6 rounded-lg shadow-sm text-center">
              <h3 className="font-bold text-lg mb-3">お問い合わせ</h3>
              <p className="text-sm text-gray-600 mb-4">
                システム開発やDX推進についてのご相談はこちらから
              </p>
              <a
                href="#"
                className="block bg-[#427C2E] text-white px-4 py-3 rounded-md hover:bg-[#356423] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
              >
                無料相談を予約する
              </a>
            </div>
          </div>
        </div>
      </main>
      {/* フッター */}
      <footer className="bg-gray-800 text-white py-10 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">SINCERE Tech Blog</h4>
              <p className="text-gray-300 text-sm">
                最新の技術トレンドやシステム開発事例、効果的な開発手法のノウハウを発信しています。
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">リンク</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    会社概要
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    サービス
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    実績
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    お問い合わせ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">フォロー</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <FontAwesomeIcon style={iconStyle} icon={faGithub} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>© 2025 株式会社シンシア All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;