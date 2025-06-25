import AuthorCard from '@/components/AuthorCard';
import { defaultManImageUrl } from '@/data/authorData';
import type { Author } from '@prisma/client';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

type ArticleHeaderProps = {
  title: string;
  category: string;
  createdDate: string;
  updatedDate?: string;
  author: Author;
};

const ArticleHeader = ({
  title,
  category,
  createdDate,
  updatedDate,
  author,
}: ArticleHeaderProps) => {
  return (
    <div className="mb-8">
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
            <span className="text-gray-500 text-sm ml-4">
              最終更新日：{updatedDate}
            </span>
          )}
        </div>
        <div className="flex space-x-3">
          <a
            href="#"
            className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <FaXTwitter fontSize={24} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <FaFacebook fontSize={24} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <FaLinkedin fontSize={24} />
          </a>
        </div>
      </div>
      <AuthorCard
        name={author.name}
        role={author.title}
        imageUrl={author.avatarUrl || defaultManImageUrl}
        profileUrl={`/author/${author.id}`}
      />
    </div>
  );
};

export default ArticleHeader;
