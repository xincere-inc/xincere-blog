'use client';

import type { Article, Category } from '@prisma/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { defaultImageUrl } from '@/data/articleData';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article & { category: Category };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link
      href={`/articles/${article.id}`}
      prefetch={false}
      className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer"
    >
      <div className="h-[180px] overflow-hidden">
        <img
          src={article.thumbnailUrl || defaultImageUrl}
          alt={article.title}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block bg-[#E8F0E6] text-primary text-xs px-2 py-1 rounded">
            {article.category.name}
          </span>
          <span className="text-gray-500 text-xs">
            {format(new Date(article.createdAt), 'yyyy年MM月dd日', {
              locale: ja,
            })}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{article.summary}</p>
      </div>
    </Link>
  );
};

export default ArticleCard;
