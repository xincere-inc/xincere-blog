import React from 'react';

interface PickUpArticleProps {
  imageUrl: string;
  authorImageUrl: string;
  authorName: string;
  title: string;
  link?: string;
}

const PickUpArticle: React.FC<PickUpArticleProps> = ({
  imageUrl,
  authorImageUrl,
  authorName,
  title,
  link,
}) => {
  const ArticleContent = (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row cursor-pointer hover:shadow-md transition-all duration-300">
      <div className="w-full sm:w-1/3 h-48 sm:h-auto">
        <img src={imageUrl} alt="記事画像" className="w-full h-full object-cover" />
      </div>
      <div className="w-full sm:w-2/3 p-4">
        <div className="flex items-center mb-2">
          <img src={authorImageUrl} alt="著者" className="w-8 h-8 rounded-full mr-2" />
          <span className="text-sm">{authorName}</span>
        </div>
        <h3 className="font-bold mb-2 line-clamp-2">{title}</h3>
      </div>
    </div>
  );

  return link ? (
    <a href={link} data-readdy="true">
      {ArticleContent}
    </a>
  ) : (
    ArticleContent
  );
};

export default PickUpArticle;
