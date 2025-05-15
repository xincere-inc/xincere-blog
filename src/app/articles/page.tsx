'use client';

import { Article, ArticleStatus } from '@prisma/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const mockArticles: Partial<Article>[] = [
  {
    id: 1,
    title: 'Mastering Next.js in 2025',
    slug: 'mastering-nextjs-2025',
    authorId: '1',
    categoryId: 1,
    status: ArticleStatus.PUBLISHED,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: 'Healthy Living Tips',
    slug: 'healthy-living-tips',
    authorId: '2',
    categoryId: 2,
    status: ArticleStatus.DRAFT,
    createdAt: new Date(),
  },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Partial<Article>[]>([]);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'ALL'>(
    'ALL'
  );

  useEffect(() => {
    // Replace with Prisma query: prisma.article.findMany({ include: { author: true, category: true } })
    setArticles(mockArticles);
  }, []);

  const filteredArticles = articles.filter(
    (article) => statusFilter === 'ALL' || article.status === statusFilter
  );

  const handleDelete = async (id: number) => {
    // Replace with Prisma query: prisma.article.delete({ where: { id } })
    setArticles(articles.filter((article) => article.id !== id));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Articles</h1>
          <Link
            href="/articles/edit/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + New Article
          </Link>
        </div>
        <div className="mb-6">
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ArticleStatus | 'ALL')
            }
            className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All</option>
            <option value={ArticleStatus.DRAFT}>Draft</option>
            <option value={ArticleStatus.PUBLISHED}>Published</option>
            <option value={ArticleStatus.ARCHIVED}>Archived</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-50 text-gray-700">
                <th className="p-4 text-left font-semibold">Title</th>
                <th className="p-4 text-left font-semibold">Author</th>
                <th className="p-4 text-left font-semibold">Category</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article, index) => (
                <tr
                  key={article.id}
                  className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-100 transition`}
                >
                  <td className="p-4">{article.title}</td>
                  <td className="p-4">{article.authorId}</td>
                  <td className="p-4">{article.categoryId}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.status === ArticleStatus.PUBLISHED
                          ? 'bg-green-100 text-green-800'
                          : article.status === ArticleStatus.DRAFT
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2 justify-center">
                      <Link
                        href={`/articles/edit/${article.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id!)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
