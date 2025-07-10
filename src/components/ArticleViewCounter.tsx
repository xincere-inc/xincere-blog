'use client';
import ApiArticle from '@/api/ApiArticle';
import { useEffect } from 'react';

type ArticleViewCounterProps = { articleId: string };

export default function ArticleViewCounter({
  articleId,
}: ArticleViewCounterProps) {
  const incrementViewCount = async (articleId: string) => {
    try {
      await ApiArticle.incrementArticleViewCount(articleId);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  useEffect(() => {
    if (articleId) {
      incrementViewCount(articleId);
    }
  }, [articleId]);

  return null;
}
