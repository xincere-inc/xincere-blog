import ArticleCard from '@/components/ArticleCard'; // ArticleCardをインポート
import AuthorHeader from '@/components/AuthorHeader';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTA from '@/components/ContactCTA'; // ContactCTAをインポート
import ArticleComments from '@/features/article-comments/ArticleComments';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({ select: { id: true } });
  return articles.map((a) => ({
    params: { id: a.id.toString() },
  }));
}

type ArticleDetailPageProps = {
  params: Promise<{ id: string }>;
};

const ArticleDetailPage = async ({ params }: ArticleDetailPageProps) => {
  const { id } = await params;

  const currentArticle = await prisma.article.findUnique({
    where: { id: Number(id) },
  });

  if (!currentArticle) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-600">
          The requested article does not exist or has been deleted.
        </p>
        <Link
          href="/"
          className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: currentArticle.categoryId,
      id: { not: Number(id) },
      deletedAt: null,
    },
    take: 4,
    orderBy: {
      updatedAt: 'desc',
    },
  });

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
            {article && (
              <ReactMarkdown>{article.markdownContent}</ReactMarkdown>
            )}
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
            {relatedArticles.map((article) => (
              <ArticleCard
                id={article.id}
                key={article.id}
                imageUrl={article.thumbnailUrl ?? ''}
                altText={article.title}
                title={article.title}
              />
            ))}
          </div>
        </div>
        {/*          コメントセクション */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ArticleComments />
        </div>
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
