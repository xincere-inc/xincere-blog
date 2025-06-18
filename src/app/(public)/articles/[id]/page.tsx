import ArticleCard from '@/components/ArticleCard'; // ArticleCardをインポート
import AuthorHeader from '@/components/AuthorHeader';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTA from '@/components/ContactCTA'; // ContactCTAをインポート
import articleCardData from '@/data/articleCardData'; // articleCardDataをインポート
import ArticleComments from '@/features/article-comments/ArticleComments';
import Image from 'next/image';
import Link from 'next/link';

const ArticleDetailPage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      <div className="w-full lg:w-2/3">
        {/* パンくずリスト */}
        <Breadcrumb
          items={[
            { label: 'Xincere', href: '#' },
            { label: 'テックブログ', href: '#' },
            {
              label:
                '後発のBtoBメディアがコンテンツSEOで勝ち切るために必要だった10のこと',
            },
          ]}
        />
        {/* 記事ヘッダー */}
        <AuthorHeader />
        {/* 記事本文 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="prose max-w-none">
            <p className="mb-6">
              BtoBメディアでコンテンツSEOを成功させるのは簡単ではありません。特に後発組として市場に参入する場合、すでに強固なポジションを確立している競合との差別化が大きな課題となります。私たちXincereは、そんな厳しい状況の中でコンテンツSEOによる成功を収めることができました。本記事では、その過程で学んだ10の重要なポイントを共有します。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              1. 徹底的な競合分析と差別化戦略の構築
            </h2>
            <p className="mb-6">
              後発のBtoBメディアとして市場に参入する際、まず最初に行ったのは徹底的な競合分析でした。トップ10の競合サイトのコンテンツ戦略、キーワード戦略、バックリンクプロファイルを詳細に分析し、彼らが見落としている市場の隙間を特定しました。
            </p>
            <p className="mb-6">
              重要なのは単なる分析ではなく、そこから独自の差別化ポイントを見出すことです。私たちの場合は、競合が表面的にしか触れていなかった「実装の具体的方法」と「失敗事例からの学び」に焦点を当てることで、より実践的で価値の高いコンテンツを提供する戦略を立てました。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              2. ペルソナの精緻化とカスタマージャーニーの設計
            </h2>
            <p className="mb-6">
              BtoBの意思決定プロセスは複雑で、複数の関係者が関与します。私たちは主要な3つのペルソナ（最終決裁者、導入推進者、実務担当者）それぞれの課題、情報収集行動、意思決定基準を徹底的に調査しました。
            </p>
            <p className="mb-6">
              各ペルソナのカスタマージャーニーを詳細にマッピングし、ジャーニーの各段階で必要とされる情報と、それに対応するコンテンツタイプを特定。これにより、単なるトラフィック獲得だけでなく、リード獲得からコンバージョンまでを見据えた一貫性のあるコンテンツ戦略を構築することができました。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              3. 「専門性・権威性・信頼性」の確立
            </h2>
            <p className="mb-6">
              Googleの評価基準であるE-A-T（Expertise, Authoritativeness,
              Trustworthiness）を意識したコンテンツ制作を行いました。具体的には以下の取り組みを実施しています：
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">業界の専門家による記事執筆と監修</li>
              <li className="mb-2">詳細な著者プロフィールの掲載</li>
              <li className="mb-2">客観的なデータと信頼できる情報源の引用</li>
              <li className="mb-2">自社の実績や事例を積極的に紹介</li>
              <li>業界メディアやニュースサイトからの引用獲得</li>
            </ul>
            <p className="mb-6">
              後発メディアにとって信頼性の構築は特に重要です。私たちは「根拠のある主張」と「透明性の高い情報提供」を徹底することで、読者とGoogleの両方から信頼されるメディアとしての地位を確立しました。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              4. 長期的なキーワード戦略の策定
            </h2>
            <p className="mb-6">
              SEOは短期的な成果を求めるものではありません。私たちは3年間の長期的なキーワード戦略を策定し、段階的にターゲットキーワードの難易度を上げていく計画を立てました。
            </p>
            <p className="mb-6">
              初期段階では比較的競合の少ないロングテールキーワードに焦点を当て、サイトの評価と権威性を高めながら徐々に競争の激しいキーワードへと移行していきました。この「スノーボール戦略」により、無理なリスクを取ることなく着実にオーガニックトラフィックを増加させることができました。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              5. コンテンツの質と量のバランス
            </h2>
            <p className="mb-6">
              「量より質」と言われますが、実際には両方が重要です。私たちは週に2〜3本の高品質な記事を安定して公開する体制を整えました。ここで重要なのは「高品質」の定義です。私たちの場合は以下の基準を設けています：
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">ユーザーの検索意図を完全に満たす網羅性</li>
              <li className="mb-2">競合記事よりも深い専門的な洞察</li>
              <li className="mb-2">実践的で具体的な情報の提供</li>
              <li className="mb-2">読みやすく整理された構成</li>
              <li>オリジナルのデータや図表の活用</li>
            </ul>
            <p className="mb-6">
              また、定期的にコンテンツ監査を実施し、パフォーマンスの低い記事の改善や更新を行うことで、サイト全体の品質を維持・向上させる取り組みも欠かしませんでした。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              6. 内部リンク構造の最適化
            </h2>
            <p className="mb-6">
              内部リンク構造は、SEOにおいて見落とされがちですが非常に重要な要素です。私たちは以下のポイントに注力しました：
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                トピッククラスター戦略の採用（ピラーページと関連コンテンツの体系化）
              </li>
              <li className="mb-2">関連性の高いコンテンツ同士の相互リンク</li>
              <li className="mb-2">重要ページへのリンクジュースの集中</li>
              <li className="mb-2">
                ユーザーの回遊性を高めるナビゲーション設計
              </li>
              <li>適切なアンカーテキストの使用</li>
            </ul>
            <p className="mb-6">
              これにより、サイト内の権威性の分配を最適化し、重要なキーワードでの順位向上を実現しました。また、ユーザーの滞在時間と回遊率の向上にも大きく貢献しています。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              7. ユーザー体験の徹底的な改善
            </h2>
            <p className="mb-6">
              SEOはもはや単なるキーワード最適化ではありません。Googleはユーザー体験を重視しており、私たちもこれを最優先事項としました。具体的には：
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">モバイルファーストのレスポンシブデザイン</li>
              <li className="mb-2">
                ページ読み込み速度の最適化（Core Web Vitalsの改善）
              </li>
              <li className="mb-2">明確で使いやすいナビゲーション</li>
              <li className="mb-2">
                スキャンしやすいコンテンツ構成（見出し、箇条書き、画像の効果的活用）
              </li>
              <li>アクセシビリティへの配慮</li>
            </ul>
            <p className="mb-6">
              特にコアウェブバイタルの改善には多くのリソースを投入し、LCP、FID、CLSのすべての指標で「良好」評価を獲得。これにより、ユーザー満足度の向上とともに、検索順位の安定的な上昇を実現しました。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              8. データ分析と継続的な改善サイクル
            </h2>
            <p className="mb-6">
              SEO成功の鍵は、データに基づく継続的な改善にあります。私たちは以下のKPIを定期的に測定・分析しています：
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                オーガニック検索トラフィック（全体およびセグメント別）
              </li>
              <li className="mb-2">
                ページ読み込み速度の最適化（Core Web Vitalsの改善）
              </li>
              <li className="mb-2">明確で使いやすいナビゲーション</li>
              <li className="mb-2">
                スキャンしやすいコンテンツ構成（見出し、箇条書き、画像の効果的活用）
                2週間ごとのSEOレビュー会議を開催し、データの分析結果に基づいて戦略の微調整を行っています。この「仮説→実行→検証→改善」のサイクルを高速で回すことで、常に最適な戦略を追求しています。
              </li>
            </ul>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              9. ソーシャルメディアとの連携強化
            </h2>
            <p className="mb-6">
              SEOとソーシャルメディアは直接的な関係はないとされていますが、間接的には大きな影響があります。私たちは以下の取り組みを行いました：
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                LinkedIn、Twitter、Facebookでの積極的な記事共有
              </li>
              <li className="mb-2">業界インフルエンサーとの関係構築</li>
              <li className="mb-2">ソーシャルメディア上での議論の活性化</li>
              <li className="mb-2">ソーシャルシェアを促進するコンテンツ設計</li>
              <li>ユーザー生成コンテンツの促進</li>
            </ul>
            <p className="mb-6">
              これにより、直接的なトラフィック増加だけでなく、ブランド認知度の向上、自然なバックリンク獲得、そしてユーザーエンゲージメントの向上を実現しました。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              10. 組織文化としてのSEO意識の浸透
            </h2>
            <p className="mb-6">
              最後に、最も重要なのは「SEOはマーケティング部門だけの仕事」という認識を変えることでした。私たちは以下の取り組みを通じて、組織全体でSEOを意識する文化を構築しました：
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                経営層へのSEO重要性の啓蒙と定期的な成果報告
              </li>
              <li className="mb-2">全社員向けのSEO基礎研修の実施</li>
              <li className="mb-2">
                製品開発・カスタマージャクセスチームとの定期的な情報交換
              </li>
              <li className="mb-2">
                SEO成果に連動したインセンティブ制度の導入
              </li>
              <li>
                部門横断的なコンテンツアイデア発掘ワークショップの定期開催
              </li>
            </ul>
            <p className="mb-6">
              この文化的変革により、営業部門からの顧客の声、製品部門からの専門知識、カスタマーサポートからのよくある質問など、組織全体からSEOに活かせる情報が自然と集まる仕組みが確立されました。
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-200">
              まとめ：継続的な努力と戦略的思考が鍵
            </h2>
            <p className="mb-6">
              後発のBtoBメディアとしてコンテンツSEOで成功するには、短期的な施策ではなく、長期的な視点での戦略的アプローチが不可欠です。私たちの経験から、最も重要なのは「ユーザーファースト」の姿勢と「データドリブン」の意思決定プロセスであると言えます。
            </p>
            <p className="mb-6">
              競合が多く、情報が溢れる現代のビジネス環境において、真に価値あるコンテンツを提供し続けることこそが、持続可能なSEO成功の唯一の道です。そして、それは一朝一夕に実現するものではなく、地道な努力の積み重ねによってのみ達成されるものだということを、常に心に留めておく必要があります。
            </p>
            <p>
              皆さんのBtoBメディア運営やコンテンツSEO戦略の参考になれば幸いです。具体的な質問やご意見があれば、ぜひコメント欄でお聞かせください。
            </p>
          </div>
        </div>
        {/* タグ */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors duration-300">
              #コンテンツSEO
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors duration-300">
              #BtoBマーケティング
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors duration-300">
              #SEO戦略
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors duration-300">
              #コンテンツ制作
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors duration-300">
              #ウェブマーケティング
            </span>
          </div>
        </div>
        {/* 著者情報（モバイル表示用） */}
        <Link
          href="/authors/1"
          className="lg:hidden bg-white rounded-lg shadow-sm p-4 mb-8 block"
        >
          <div className="flex items-center">
            <Image
              src="https://readdy.ai/api/search-image?query=Professional%2520headshot%2520of%2520Asian%2520man%2520in%2520business%2520attire%252C%2520neutral%2520background%252C%2520high%2520quality%2520portrait%2520with%2520soft%2520lighting%2520and%2520shallow%2520depth%2520of%2520field&width=80&height=80&seq=14&orientation=squarish"
              alt="田島光太郎"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <div className="font-bold">田島 光太郎</div>
              <p className="text-sm text-gray-600">
                Xincere
                マーケティング責任者。10年以上のBtoBマーケティング経験を持ち、特にコンテンツマーケティングとSEO戦略に精通。
              </p>
            </div>
          </div>
        </Link>
        {/* 関連記事 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">関連記事</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articleCardData.map((article, index) => (
              <ArticleCard
                key={index}
                imageUrl={article.imageUrl}
                altText={article.altText}
                title={article.title}
              />
            ))}
          </div>
        </div>

        <ArticleComments />
      </div>
      {/* サイドバー */}
      <div className="w-full lg:w-1/3">
        {/* 著者情報（デスクトップ表示用） */}
        <div className="hidden lg:block bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">著者について</h3>
          <Link
            href="/authors/1"
            className="flex flex-col items-center text-center mb-4"
          >
            <Image
              src="https://readdy.ai/api/search-image?query=Professional%2520headshot%2520of%2520Asian%2520man%2520in%2520business%2520attire%252C%2520neutral%2520background%252C%2520high%2520quality%2520portrait%2520with%2520soft%2520lighting%2520and%2520shallow%2520depth%2520of%2520field&width=120&height=120&seq=19&orientation=squarish"
              alt="田島光太郎"
              width={120}
              height={120}
              className="rounded-full"
            />

            <div className="font-bold hover:text-primary transition-colors duration-300">
              田島 光太郎
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Xincere マーケティング責任者
            </div>
          </Link>
          <p className="text-sm text-gray-600 mb-4">
            10年以上のBtoBマーケティング経験を持ち、特にコンテンツマーケティングとSEO戦略に精通。複数の企業でコンテンツ戦略を立案・実行し、オーガニック流入を大幅に増加させた実績を持つ。
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="#"
              className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              <i className="fab fa-twitter text-lg"></i>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              <i className="fab fa-linkedin-in text-lg"></i>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              <i className="fas fa-envelope text-lg"></i>
            </Link>
          </div>
        </div>
        {/* カテゴリー一覧 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">カテゴリー</h3>
          <ul>
            <li>
              <Link
                href="#"
                className="flex justify-between items-center py-2 hover:bg-primary-light px-2 rounded-md transition-colors duration-300 cursor-pointer"
              >
                <span>マーケティング戦略</span>
                <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">
                  15
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex justify-between items-center py-2 hover:bg-primary-light px-2 rounded-md transition-colors duration-300 cursor-pointer"
              >
                <span>コンテンツ戦略</span>
                <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">
                  12
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex justify-between items-center py-2 hover:bg-primary-light px-2 rounded-md transition-colors duration-300 cursor-pointer"
              >
                <span>SNSマーケティング</span>
                <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">
                  8
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex justify-between items-center py-2 hover:bg-primary-light px-2 rounded-md transition-colors duration-300 cursor-pointer"
              >
                <span>SEO対策</span>
                <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">
                  10
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex justify-between items-center py-2 hover:bg-primary-light px-2 rounded-md transition-colors duration-300 cursor-pointer"
              >
                <span>リードジェネレーション</span>
                <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">
                  7
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex justify-between items-center py-2 hover:bg-primary-light px-2 rounded-md transition-colors duration-300 cursor-pointer"
              >
                <span>メール戦略</span>
                <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">
                  6
                </span>
              </Link>
            </li>
          </ul>
        </div>
        {/* 人気記事 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">人気記事</h3>
          <ul className="space-y-4">
            <li className="flex space-x-3 cursor-pointer">
              <div className="w-[100px] h-[70px] overflow-hidden rounded">
                <Image
                  src="https://readdy.ai/api/search-image?query=Marketing%2520ROI%2520dashboard%2520with%2520positive%2520metrics%252C%2520professional%2520marketing%2520team%2520analyzing%2520data%252C%2520modern%2520office%2520with%2520green%2520design%2520elements%252C%2520high%2520quality%2520professional%2520photo&width=100&height=70&seq=20&orientation=landscape"
                  alt="マーケティングROIを2倍にする実践テクニック"
                  width={100}
                  height={70}
                  className="rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-3">
                  マーケティングROIを2倍にする実践テクニック
                </h4>
              </div>
            </li>
            <li className="flex space-x-3 cursor-pointer">
              <div className="w-[100px] h-[70px] overflow-hidden rounded">
                <Image
                  src="https://readdy.ai/api/search-image?query=Social%2520media%2520marketing%2520team%2520reviewing%2520Instagram%2520campaign%2520results%252C%2520professional%2520marketing%2520workspace%2520with%2520analytics%2520displays%252C%2520green%2520accent%2520wall%252C%2520high%2520quality%2520professional%2520photo&width=100&height=70&seq=21&orientation=landscape"
                  alt="Instagram広告完全攻略ガイド2025"
                  width={100}
                  height={70}
                  className="rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-3">
                  Instagram広告完全攻略ガイド2025
                </h4>
              </div>
            </li>
            <li className="flex space-x-3 cursor-pointer">
              <div className="w-[100px] h-[70px] overflow-hidden rounded">
                <Image
                  src="https://readdy.ai/api/search-image?query=Content%2520marketing%2520planning%2520session%2520with%2520editorial%2520calendar%252C%2520professional%2520marketing%2520team%2520collaboration%252C%2520modern%2520office%2520with%2520green%2520plants%252C%2520high%2520quality%2520professional%2520photo&width=100&height=70&seq=22&orientation=landscape"
                  alt="失敗しないコンテンツマーケティング入門"
                  width={100}
                  height={70}
                  className="rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-3">
                  失敗しないコンテンツマーケティング入門
                </h4>
              </div>
            </li>
            <li className="flex space-x-3 cursor-pointer">
              <div className="w-[100px] h-[70px] overflow-hidden rounded">
                <Image
                  src="https://readdy.ai/api/search-image?query=Professional%2520female%2520freelancer%2520working%2520on%2520laptop%2520in%2520modern%2520office%2520space%2520with%2520natural%2520lighting%252C%2520business%2520attire%252C%2520confident%2520pose&width=100&height=70&seq=23&orientation=landscape"
                  alt="フリーランスで独立後「粗利3000万を当たり前に稼ぐ」ために必要な5つのこと"
                  width={100}
                  height={70}
                  className="rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-3">
                  フリーランスで独立後「粗利3000万を当たり前に稼ぐ」ために必要な5つのこと
                </h4>
              </div>
            </li>
          </ul>
        </div>
        {/* CTA */}
        <div className="sticky top-6">
          <ContactCTA /> {/* ContactCTAコンポーネントを使用 */}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
