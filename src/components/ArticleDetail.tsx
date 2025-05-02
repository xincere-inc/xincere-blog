'use client';

import Breadcrumb from '@/components/Breadcrumb';
import AuthorCard from '@/components/AuthorCard';
import ContactCTA from '@/components/ContactCTA';
import ArticleCard from '@/components/ArticleIndexCard';

const ArticleDetail = ({
  breadcrumbItems,
  articleHeader,
  articleContent,
  relatedArticles,
  comments,
}: {
  breadcrumbItems: { label: string; href?: string }[];
  articleHeader: {
    title: string;
    category: string;
    date: string;
    author: {
      name: string;
      role: string;
      description: string;
      imageUrl: string;
      profileUrl: string;
    };
  };
  articleContent: { body: string; tags: string[] };
  relatedArticles: { imageUrl: string; altText: string; title: string }[];
  comments: { name: string; date: string; text: string; isAuthor?: boolean }[];
}) => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{articleHeader.title}</h1>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="inline-block bg-primary-light text-primary text-xs px-3 py-1 rounded-full">
                  {articleHeader.category}
                </span>
                <span className="text-gray-500 text-sm ml-4">
                  {articleHeader.date}
                </span>
              </div>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <AuthorCard {...articleHeader.author} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: articleContent.body }}
            />
          </div>
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {articleContent.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">関連記事</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((article, index) => (
                <ArticleCard key={index} {...article} />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">コメント</h3>
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-bold">
                      {comment.name}{' '}
                      {comment.isAuthor && (
                        <span className="text-primary text-sm">（著者）</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{comment.date}</div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <div className="sticky top-6">
            <ContactCTA />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArticleDetail;
