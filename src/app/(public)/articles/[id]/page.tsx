import ArticleCard from '@/components/ArticleCard';
import ArticleComments from '@/features/article-comments/ArticleComments';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import BreadcrumbsContainer from '@/components/BreadcrumbsContainer';
import ArticleHeader from '@/components/ArticleHeader';
import { formatDateJP } from '@/lib/utils/date';
import Sidebar from '@/components/Sidebar';
import { ArticleStatus } from '@prisma/client';
import { defaultManImageUrl } from '@/data/authorData';
import SocialLinks from '@/components/SocialLinks';

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

  const [article, categories, popularArticles] = await Promise.all([
    prisma.article.findUnique({
      where: { id: Number(id) },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.category.findMany({
      where: {
        deletedAt: null,
        articles: {
          some: {
            status: ArticleStatus.PUBLISHED,
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            articles: {
              where: {
                deletedAt: null,
                status: ArticleStatus.PUBLISHED,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
    prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  if (!article) {
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
      categoryId: article.categoryId,
      id: { not: article.id },
      status: ArticleStatus.PUBLISHED,
      deletedAt: null,
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      <div className="w-full lg:w-2/3">
        {/* パンくずリスト */}
        <BreadcrumbsContainer title={article.title} />
        {/* 記事ヘッダー */}
        <ArticleHeader
          title={article.title}
          category={article.category.name}
          createdDate={formatDateJP(article.createdAt)}
          updatedDate={formatDateJP(article.updatedAt)}
          author={article.author}
        />
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
            {article.tags.map(({ tag }) => (
              <Link
                href={`/tags/${tag.id}`}
                key={tag.id}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors duration-300"
              >
                #{tag.name}
              </Link>
            ))}
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
            href={`/authors/${article.author.id}`}
            className="flex flex-col items-center text-center mb-4"
          >
            <Image
              src={article.author.avatarUrl || defaultManImageUrl}
              alt={article.author.name}
              width={120}
              height={120}
              className="rounded-full mb-2"
            />

            <div className="font-bold hover:text-primary transition-colors duration-300 mb-2">
              {article.author.name}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              {article.author.title}
            </div>
          </Link>
          <p className="text-sm text-gray-600 mb-4">{article.author.bio}</p>
          <SocialLinks
            twitterUrl="#"
            facebookUrl="#"
            linkedinUrl="#"
            emailUrl="#"
            className="justify-center"
          />
        </div>
        <Sidebar categories={categories} popularArticles={popularArticles} />
      </div>
    </div>
  );
};

export default ArticleDetailPage;
