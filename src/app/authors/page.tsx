/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
const App: React.FC = () => {
  // 著者データ
  const [authors, setAuthors] = useState([
    {
      id: 1,
      name: '村上 春樹',
      profileImage:
        'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20middle-aged%20Japanese%20male%20author%20with%20glasses%2C%20wearing%20a%20casual%20outfit%2C%20neutral%20expression%2C%20minimalist%20background%2C%20high%20quality%20studio%20lighting%2C%20professional%20photography&width=200&height=200&seq=1&orientation=squarish',
      introduction:
        '日本を代表する現代作家。シュールレアリズムと現実が交錯する独特の文体で知られる。',
      genre: ['現代文学', 'シュールレアリズム'],
      publishedEra: '1980年代〜現在',
      hasAwards: true,
      popularity: 95,
    },
    {
      id: 2,
      name: '川端 康成',
      profileImage:
        'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20an%20elderly%20Japanese%20male%20author%20with%20traditional%20Japanese%20clothing%2C%20serious%20expression%2C%20minimalist%20background%2C%20high%20quality%20studio%20lighting%2C%20professional%20photography%2C%20Nobel%20Prize%20winner&width=200&height=200&seq=5&orientation=squarish',
      introduction:
        'ノーベル文学賞を受賞した日本人作家。繊細な美意識と日本的な情緒を表現した作品で国際的に評価される。',
      representativeWorks: [
        {
          title: '雪国',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20Snow%20Country%20novel%2C%20traditional%20Japanese%20aesthetic%2C%20minimalist%20design%2C%20snow%20landscape%2C%20elegant%20typography%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=6&orientation=portrait',
        },
        {
          title: '伊豆の踊子',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20The%20Izu%20Dancer%20novel%2C%20traditional%20Japanese%20aesthetic%2C%20minimalist%20design%2C%20dancing%20figure%20silhouette%2C%20elegant%20typography%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=7&orientation=portrait',
        },
        {
          title: '千羽鶴',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20Thousand%20Cranes%20novel%2C%20traditional%20Japanese%20aesthetic%2C%20minimalist%20design%2C%20tea%20ceremony%20elements%2C%20elegant%20typography%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=8&orientation=portrait',
        },
      ],
      genre: ['純文学', '日本文学'],
      publishedEra: '1920年代〜1970年代',
      hasAwards: true,
      popularity: 88,
    },
    {
      id: 3,
      name: '吉本 ばなな',
      profileImage:
        'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20Japanese%20female%20author%20with%20short%20hair%2C%20casual%20modern%20outfit%2C%20friendly%20expression%2C%20minimalist%20background%2C%20high%20quality%20studio%20lighting%2C%20professional%20photography&width=200&height=200&seq=9&orientation=squarish',
      introduction:
        '現代日本文学の代表的な女性作家。若者の感性と心理を独自の視点で描き、国内外で人気を博す。',
      representativeWorks: [
        {
          title: 'キッチン',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20Kitchen%20novel%2C%20contemporary%20Japanese%20style%2C%20minimalist%20design%2C%20kitchen%20elements%2C%20soft%20colors%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=10&orientation=portrait',
        },
        {
          title: 'TUGUMI',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20TUGUMI%20novel%2C%20contemporary%20Japanese%20style%2C%20minimalist%20design%2C%20seaside%20elements%2C%20soft%20colors%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=11&orientation=portrait',
        },
        {
          title: 'アムリタ',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20Amrita%20novel%2C%20contemporary%20Japanese%20style%2C%20minimalist%20design%2C%20mystical%20elements%2C%20soft%20colors%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=12&orientation=portrait',
        },
      ],
      genre: ['現代文学', 'フェミニズム'],
      publishedEra: '1980年代〜現在',
      hasAwards: true,
      popularity: 82,
    },
    {
      id: 4,
      name: '太宰 治',
      profileImage:
        'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20Japanese%20male%20author%20from%201940s%20era%2C%20serious%20melancholic%20expression%2C%20formal%20suit%2C%20vintage%20style%2C%20minimalist%20background%2C%20high%20quality%20studio%20lighting%2C%20professional%20photography&width=200&height=200&seq=13&orientation=squarish',
      introduction:
        '戦前・戦後の日本文学を代表する作家。自伝的要素を含む作品と独特の文体で知られる。',
      representativeWorks: [
        {
          title: '人間失格',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20No%20Longer%20Human%20novel%2C%20dark%20moody%20atmosphere%2C%20minimalist%20Japanese%20design%2C%20portrait%20silhouette%2C%20elegant%20typography%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=14&orientation=portrait',
        },
        {
          title: '斜陽',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20The%20Setting%20Sun%20novel%2C%20sunset%20imagery%2C%20minimalist%20Japanese%20design%2C%20elegant%20typography%2C%20melancholic%20mood%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=15&orientation=portrait',
        },
        {
          title: '走れメロス',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20Run%20Melos%20novel%2C%20classical%20Greek%20inspired%2C%20minimalist%20Japanese%20design%2C%20running%20figure%20silhouette%2C%20elegant%20typography%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=16&orientation=portrait',
        },
      ],
      genre: ['純文学', '私小説'],
      publishedEra: '1930年代〜1940年代',
      hasAwards: false,
      popularity: 90,
    },
    {
      id: 5,
      name: '江戸川 乱歩',
      profileImage:
        'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20Japanese%20male%20mystery%20author%20from%201930s%20era%2C%20wearing%20glasses%20and%20formal%20suit%2C%20serious%20expression%2C%20vintage%20style%2C%20minimalist%20background%2C%20high%20quality%20studio%20lighting%2C%20professional%20photography&width=200&height=200&seq=17&orientation=squarish',
      introduction:
        '日本推理小説の父と称される作家。奇想天外なストーリーと緻密なプロットで日本のミステリーの基礎を築いた。',
      representativeWorks: [
        {
          title: '陰獣',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20The%20Beast%20in%20the%20Shadows%20novel%2C%20noir%20style%2C%20dark%20mysterious%20atmosphere%2C%20shadow%20silhouette%2C%20vintage%20Japanese%20design%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=18&orientation=portrait',
        },
        {
          title: '二銭銅貨',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20The%20Two-Sen%20Copper%20Coin%20novel%2C%20vintage%20Japanese%20mystery%20style%2C%20coin%20imagery%2C%20detective%20elements%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=19&orientation=portrait',
        },
        {
          title: '人間椅子',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20The%20Human%20Chair%20novel%2C%20eerie%20atmosphere%2C%20antique%20chair%20silhouette%2C%20vintage%20Japanese%20mystery%20style%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=20&orientation=portrait',
        },
      ],
      genre: ['推理小説', 'ホラー'],
      publishedEra: '1920年代〜1960年代',
      hasAwards: true,
      popularity: 85,
    },
    {
      id: 6,
      name: '夏目 漱石',
      profileImage:
        'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20Japanese%20male%20author%20from%20Meiji%20era%2C%20traditional%20formal%20clothing%2C%20serious%20expression%2C%20vintage%20style%2C%20minimalist%20background%2C%20high%20quality%20studio%20lighting%2C%20professional%20photography&width=200&height=200&seq=21&orientation=squarish',
      introduction:
        '明治時代を代表する文豪。近代日本文学の礎を築き、多くの名作を残した。',
      representativeWorks: [
        {
          title: '吾輩は猫である',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20I%20Am%20a%20Cat%20novel%2C%20cat%20silhouette%2C%20vintage%20Japanese%20style%2C%20Meiji%20era%20aesthetic%2C%20elegant%20typography%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=22&orientation=portrait',
        },
        {
          title: '坊っちゃん',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20Botchan%20novel%2C%20school%20setting%2C%20vintage%20Japanese%20style%2C%20Meiji%20era%20aesthetic%2C%20elegant%20typography%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=23&orientation=portrait',
        },
        {
          title: 'こころ',
          image:
            'https://readdy.ai/api/search-image?query=Book%20cover%20design%20for%20Kokoro%20novel%2C%20emotional%20depth%2C%20vintage%20Japanese%20style%2C%20Meiji%20era%20aesthetic%2C%20elegant%20typography%2C%20professional%20book%20cover%20design%20with%20Japanese%20aesthetic&width=120&height=180&seq=24&orientation=portrait',
        },
      ],
      genre: ['純文学', '近代文学'],
      publishedEra: '1900年代〜1910年代',
      hasAwards: false,
      popularity: 92,
    },
  ]);
  // 検索とフィルター用の状態
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState(authors);
  const [genreFilter, setGenreFilter] = useState('すべて');
  const [eraFilter, setEraFilter] = useState('すべて');
  const [awardFilter, setAwardFilter] = useState('すべて');
  const [sortOrder, setSortOrder] = useState('人気順');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // ジャンルの一覧を取得
  const allGenres = [
    'すべて',
    ...new Set(authors.flatMap((author) => author.genre)),
  ];
  // 出版年代の一覧を取得
  const allEras = [
    'すべて',
    ...new Set(authors.map((author) => author.publishedEra)),
  ];
  // 検索とフィルター適用
  useEffect(() => {
    let result = [...authors];
    // 検索語による絞り込み
    if (searchTerm) {
      result = result.filter(
        (author) =>
          author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          author.representativeWorks.some((work) =>
            work.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    // ジャンルによる絞り込み
    if (genreFilter !== 'すべて') {
      result = result.filter((author) => author.genre.includes(genreFilter));
    }
    // 出版年代による絞り込み
    if (eraFilter !== 'すべて') {
      result = result.filter((author) => author.publishedEra === eraFilter);
    }
    // 受賞歴による絞り込み
    if (awardFilter !== 'すべて') {
      const hasAward = awardFilter === 'あり';
      result = result.filter((author) => author.hasAwards === hasAward);
    }
    // ソート順の適用
    if (sortOrder === '人気順') {
      result.sort((a, b) => b.popularity - a.popularity);
    } else if (sortOrder === '名前順') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredAuthors(result);
  }, [authors, searchTerm, genreFilter, eraFilter, awardFilter, sortOrder]);
  return (
    <div className="mt-16">
      <h1 className="text-3xl font-bold mb-4">著者一覧</h1>
      {/* 著者カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredAuthors.map((author) => (
          <div
            key={author.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                {/* 著者プロフィール画像 */}
                <div className="w-20 h-20 rounded-full overflow-hidden mr-4 flex-shrink-0 border-2 border-gray-200">
                  <img
                    src={author.profileImage}
                    alt={author.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* 著者名と簡単な紹介 */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {author.name}
                  </h2>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {author.genre.map((g, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                    {author.hasAwards && (
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                        受賞歴あり
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* 著者紹介文 */}
              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {author.introduction}
              </p>

              {/* 詳細ボタン */}
              <button className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 !rounded-button whitespace-nowrap cursor-pointer">
                <span>詳細を見る</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* 検索結果がない場合 */}
      {filteredAuthors.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            検索結果がありません
          </h3>
          <p className="text-gray-500">
            検索条件を変更して、もう一度お試しください。
          </p>
        </div>
      )}
    </div>
  );
};
export default App;
