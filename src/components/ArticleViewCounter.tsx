'use client';
import ApiArticle from '@/api/ApiArticle';
import { useEffect, useState } from 'react';

type ArticleViewCounterProps = { articleId: string; initial: number };

export default function ArticleViewCounter({
  articleId,
  initial,
}: ArticleViewCounterProps) {
  const [viewCount, setViewCount] = useState(initial);

  const incrementViewCount = async (articleId: string) => {
    setViewCount((prev) => prev + 1);
    try {
      const response = await ApiArticle.incrementArticleViewCount(articleId);
      if (response.status === 200) {
        if (response.data && response.data.viewsCount !== viewCount) {
          setViewCount(response.data.viewsCount || viewCount);
        }
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  useEffect(() => {
    if (articleId) {
      incrementViewCount(articleId);
    }
  }, [articleId]);

  return <span>{viewCount.toLocaleString()} views</span>;
}
