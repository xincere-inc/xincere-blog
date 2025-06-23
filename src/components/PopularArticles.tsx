import Link from 'next/link';
import React from 'react';
import type { Article } from '@prisma/client';
import { Image } from 'antd';

type PopularArticle = Pick<Article, 'id' | 'title' | 'thumbnailUrl' | 'slug'>;

interface PopularArticlesProps {
  articles: PopularArticle[];
  defaultImageUrl: string;
  className?: string;
}

const PopularArticles = ({
  articles,
  defaultImageUrl,
  className = '',
}: PopularArticlesProps) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm mb-6 ${className}`}>
      <h3 className="font-bold text-lg mb-4 border-b pb-2">人気記事</h3>
      <ul className="space-y-4">
        {articles.length > 0 && articles.map((article) => (
          <li key={article.id} className="flex space-x-3">
            <Link
              href={`/articles/${article.id}`}
              className="flex space-x-3 w-full hover:opacity-90"
            >
              <div className="w-[100px] h-[70px] overflow-hidden rounded">
                <Image
                  src={article.thumbnailUrl || defaultImageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover object-top"
                  preview={false}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-3 hover:text-primary transition-colors duration-300">
                  {article.title}
                </h4>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularArticles;
