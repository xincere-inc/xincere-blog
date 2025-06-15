'use client';

import ApiCategory from '@/api/ApiCategory';
import type { Article, Category } from '@prisma/client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ArticleIndexCard from './ArticleIndexCard';

interface ArticleGridProps {
  articles: (Article & { category: Category })[];
  initialCategories: Category[];
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  initialCategories,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(initialCategories.length);
  const [hasMore, setHasMore] = useState(true);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const tabContainerRef = useRef<HTMLDivElement>(null);

  const tabs = ['all', ...categories.map((cat) => cat.name)];

  const filteredArticles =
    activeTab === 'all'
      ? articles
      : articles.filter((article) => article.category.name === activeTab);

  const loadMoreCategories = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const {
        data: { categories },
        status,
      } = await ApiCategory.getCategories(skip, 5);

      if (status === 200) {
        if (!categories || categories.length === 0) {
          setHasMore(false);
        } else {
          const categoryData = categories.map((cat) => ({
            id: cat.id!,
            name: cat.name ?? '',
            slug: cat.slug ?? '',
            description: cat.description ?? null,
            createdAt: cat.createdAt ? new Date(cat.createdAt) : new Date(),
            updatedAt: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
            deletedAt: cat.deletedAt ? new Date(cat.deletedAt) : null,
          }));

          setCategories((prev) => [...prev, ...categoryData]);
          setSkip((prevSkip) => prevSkip + categories.length);
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
  }, [skip, loading, hasMore]);

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

      // Scroll again after loading new categories to reveal new tabs
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
    setShowRightScroll(hasMore || scrollLeft < maxScrollLeft - 10);
  };

  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollButtonsVisibility);
    updateScrollButtonsVisibility();

    return () => {
      container.removeEventListener('scroll', updateScrollButtonsVisibility);
    };
  }, [hasMore]);

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
              stroke="#ffffff"
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
              onClick={() => setActiveTab(tab)}
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

        {showRightScroll && (
          <button
            onClick={() => scrollTabs('right')}
            disabled={loading}
            aria-label="Load more categories"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-green-800 rounded-full hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredArticles.map((article) => (
          <ArticleIndexCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
};

export default ArticleGrid;
