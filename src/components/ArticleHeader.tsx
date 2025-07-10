import AuthorCard from '@/components/AuthorCard';
import { defaultManImageUrl } from '@/data/authorData';
import type { Author } from '@prisma/client';
import ArticleViewCounter from './ArticleViewCounter';

type ArticleHeaderProps = {
  title: string;
  category: string;
  createdDate: string;
  updatedDate?: string;
  author: Author;
  articleId: string;
};

const ArticleHeader = ({
  title,
  category,
  createdDate,
  updatedDate,
  author,
  articleId,
}: ArticleHeaderProps) => {
  return (
    <div className="mb-2">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="inline-block bg-primary-light text-primary text-xs px-3 py-1 rounded-full">
            {category}
          </span>
          <span className="text-gray-500 text-sm ml-4">
            公開日：{createdDate}
          </span>
          {updatedDate && createdDate !== updatedDate && (
            <>
              <span className="text-gray-500 text-sm ml-4">
                最終更新日：{updatedDate}
              </span>
            </>
          )}
          <ArticleViewCounter articleId={articleId} />
        </div>
      </div>
      <AuthorCard
        name={author.name}
        role={author.title}
        imageUrl={author.avatarUrl || defaultManImageUrl}
        profileUrl={`/authors/${author.id}`}
      />
    </div>
  );
};

export default ArticleHeader;
