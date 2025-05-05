'use client';

import React from 'react';

const App: React.FC = () => {

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="text-sm text-gray-500 mb-8">
          <ol className="flex flex-wrap items-center">
            <li className="flex items-center">
              <a href="#" className="hover:text-gray-700 cursor-pointer">
                ホーム
              </a>
              <i className="fas fa-chevron-right text-xs mx-2"></i>
            </li>
            <li className="flex items-center">
              <a href="#" className="hover:text-gray-700 cursor-pointer">
                ブログ
              </a>
              <i className="fas fa-chevron-right text-xs mx-2"></i>
            </li>
            <li className="flex items-center">
              <a href="#" className="hover:text-gray-700 cursor-pointer">
                著者一覧
              </a>
              <i className="fas fa-chevron-right text-xs mx-2"></i>
            </li>
            <li className="text-gray-700">田島 光太郎</li>
          </ol>
        </nav>

        {/* プロフィールセクション */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20Asian%20businessman%20in%20a%20blue%20suit%20with%20a%20light%20gray%20background%2C%20professional%20portrait%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality&width=200&height=200&seq=1&orientation=squarish"
                alt="田島 光太郎"
                className="w-48 h-48 rounded-full object-cover object-top"
              />
            </div>

            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                田島 光太郎
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Xincere マーケティング責任者
              </p>

              <div className="flex justify-center md:justify-start space-x-4 mb-6">
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-500 cursor-pointer"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-700 cursor-pointer"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a
                  href="mailto:contact@example.com"
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="fas fa-envelope text-xl"></i>
                </a>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                10年以上のBtoBマーケティング経験を持ち、特にコンテンツマーケティングとSEO戦略に精通。複数の企業でコンテンツ戦略を立案・実行し、オーガニック流入を大幅に増加させた実績を持つ。
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  コンテンツマーケティング
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  SEO
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  BtoBマーケティング
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  リードジェネレーション
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 実績セクション */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">主な実績</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="text-blue-600 mb-4">
                <i className="fas fa-chart-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                オーガニックトラフィック200%増
              </h3>
              <p className="text-gray-600">
                製造業向けSaaSのコンテンツ戦略を立案・実行し、12ヶ月で自然検索からの流入を3倍に増加させました。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="text-blue-600 mb-4">
                <i className="fas fa-users text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">リード獲得数150%増</h3>
              <p className="text-gray-600">
                ホワイトペーパーやウェビナーを活用したコンテンツマーケティングにより、質の高いリード獲得数を大幅に向上させました。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="text-blue-600 mb-4">
                <i className="fas fa-trophy text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">業界賞受賞</h3>
              <p className="text-gray-600">
                2024年マーケティングエクセレンス賞を受賞。革新的なBtoBコンテンツ戦略が評価されました。
              </p>
            </div>
          </div>
        </div>

        {/* 執筆記事セクション */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            著者の記事一覧
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={`https://readdy.ai/api/search-image?query=business%20marketing%20concept%20with%20data%20visualization%2C%20digital%20marketing%20strategy%2C%20professional%20business%20image%20with%20blue%20accent%2C%20modern%20clean%20design&width=400&height=240&seq=${item}&orientation=landscape`}
                    alt="記事サムネイル"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      コンテンツマーケティング
                    </span>
                    <span className="text-gray-500 text-sm">
                      2025年5月{item}日
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    BtoBマーケティングで成果を出すためのコンテンツ戦略の立て方
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    効果的なBtoBマーケティングでは、ターゲット顧客の課題を理解し、各購買段階に合わせたコンテンツを提供することが重要です。本記事では具体的な戦略立案のステップを解説します。
                  </p>

                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                  >
                    続きを読む <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="#"
              className="inline-block bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-button hover:bg-blue-50 transition duration-300 cursor-pointer whitespace-nowrap"
            >
              記事をもっと見る <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>

        {/* CTAセクション */}
        <div
          id="contact"
          className="bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow-lg p-8 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            マーケティングでお困りですか？
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            田島がBtoBマーケティングの課題解決をサポートします。無料相談やお役立ち資料をご活用ください。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="bg-white text-primary px-8 py-3 rounded-button text-lg font-medium hover:bg-gray-100 transition duration-300 cursor-pointer whitespace-nowrap"
            >
              無料相談を予約する <i className="fas fa-calendar-alt ml-2"></i>
            </a>
            <a
              href="#"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-button text-lg font-medium hover:bg-white/10 transition duration-300 cursor-pointer whitespace-nowrap"
            >
              資料をダウンロード <i className="fas fa-download ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
