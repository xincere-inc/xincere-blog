'use client';

import ApiArticle from '@/api/ApiArticle';
import ApiCategory from '@/api/ApiCategory';
import { ApiArticle as ApiArticleType } from '@/types/article';
import { ArticleStatus, Category } from '@prisma/client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ArticleIndexCard from './ArticleIndexCard';

interface ArticleGridProps {
  initialCategories: Category[];
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [articles, setArticles] = useState<ApiArticleType[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 9;

  const tabs = ['all', ...categories.map((cat) => cat.name)];
  const totalPages = Math.ceil(totalArticles / itemsPerPage);

  const loadMoreCategories = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const {
        data: { categories: newCategories },
        status,
      } = await ApiCategory.getCategories(categories.length, 5);

      if (status === 200) {
        if (!newCategories || newCategories.length === 0) {
          setShowRightScroll(false);
        } else {
          const categoryData = newCategories.map((cat) => ({
            id: cat.id!,
            name: cat.name ?? '',
            slug: cat.slug ?? '',
            description: cat.description ?? null,
            createdAt: cat.createdAt ? new Date(cat.createdAt) : new Date(),
            updatedAt: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
            deletedAt: cat.deletedAt ? new Date(cat.deletedAt) : null,
          }));

          setCategories((prev) => [...prev, ...categoryData]);
        }
      } else {
        toast.error('Failed to get categories data.', {
          position: 'bottom-right',
        });
      }
    } catch (error) {
      console.error('Failed to load more categories', error);
    } finally {
      setLoading(false);
    }
  }, [loading, categories.length]);

  const loadArticles = useCallback(async (category: string, page: number) => {
    setLoading(true);
    try {
      const skip = (page - 1) * itemsPerPage;

      const {
        data: { articles: newArticles, total },
        status,
      } = await ApiArticle.getArticles(skip, itemsPerPage, category);

      if (status === 200) {
        const mappedArticles: ApiArticleType[] =
          newArticles?.map((article) => ({
            id: article.id ?? 0,
            title: article.title ?? '',
            slug: article.slug ?? '',
            summary: article.summary ?? '',
            thumbnailUrl: article.thumbnailUrl ?? null,
            status: article.status as ArticleStatus,
            author: {
              id: article.author?.id ?? '',
              name: article.author?.name ?? '',
            },
            category: {
              id: article.category?.id ?? 0,
              name: article.category?.name ?? '',
              slug: article.category?.slug ?? '',
            },
            createdAt: article.createdAt
              ? new Date(article.createdAt)
              : new Date(),
            updatedAt: article.updatedAt
              ? new Date(article.updatedAt)
              : new Date(),
            deletedAt: article.deletedAt ? new Date(article.deletedAt) : null,
          })) ?? [];
        setArticles(mappedArticles || []);
        setTotalArticles(total ?? 0);
      } else {
        toast.error('Failed to load articles.', {
          position: 'bottom-right',
        });
      }
    } catch (error) {
      console.error('Failed to load articles', error);
      toast.error('An error occurred while fetching articles.', {
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    loadArticles(tab, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadArticles(activeTab, page);
  };

  const scrollTabs = async (direction: 'left' | 'right') => {
    const container = tabContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -150 : 150;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    const nearingRightEdge =
      direction === 'right' &&
      container.scrollLeft + container.clientWidth + scrollAmount >=
        container.scrollWidth - 50;

    if (nearingRightEdge) {
      await loadMoreCategories();
      setTimeout(() => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        updateScrollButtonsVisibility();
      }, 100);
    } else {
      setTimeout(updateScrollButtonsVisibility, 300);
    }
  };

  const updateScrollButtonsVisibility = () => {
    const container = tabContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    setShowLeftScroll(scrollLeft > 10);
    setShowRightScroll(scrollLeft < maxScrollLeft - 10);
  };

  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollButtonsVisibility);
    updateScrollButtonsVisibility();

    return () => {
      container.removeEventListener('scroll', updateScrollButtonsVisibility);
    };
  }, []);

  useEffect(() => {
    loadArticles('all', 1);
  }, []);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === 1
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === i
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === totalPages
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">テックブログ</h1>

      <div className="relative">
        {showLeftScroll && (
          <button
            onClick={() => scrollTabs('left')}
            aria-label="Scroll tabs left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-green-700 hover:bg-primary"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div
          ref={tabContainerRef}
          className="scrollbar-hide overflow-x-auto flex flex-nowrap gap-2 mb-6 sm:mb-8 border-b"
        >
          {tabs.map((tab, index) => (
            <button
              key={`${tab}-${index}`}
              onClick={() => handleTabChange(tab)}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-t-md transition-colors duration-300 whitespace-nowrap
                ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-[#E8F0E6] text-gray-700 hover:bg-primary-light'
                }`}
            >
              {tab === 'all' ? 'すべて' : tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTabs('right')}
          disabled={loading}
          aria-label="Load more categories"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-green-800 rounded-full hover:bg-primary"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {articles.map((article) => (
          <ArticleIndexCard key={article.id} article={article} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default ArticleGrid;
