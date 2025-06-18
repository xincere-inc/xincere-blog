'use client';

import ApiCommentArticle from '@/api/ApiCommentArticle';
import ArticleCommentList, {
  ArticleCommentListRef,
} from '@/components/ArticleCommentList';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface LoggedInUserInfo {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}
interface CustomSession {
  user?: LoggedInUserInfo;
}

export default function ArticleComments() {
  const params = useParams();
  const rawArticleId = params?.id;
  const articleId = Array.isArray(rawArticleId)
    ? rawArticleId[0]
    : rawArticleId;
  const { data: session } = useSession() as { data: CustomSession | null };

  const commentListRef = useRef<ArticleCommentListRef>(null);

  const [formData, setFormData] = useState({
    comment: '',
    name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!articleId) return null;

  useEffect(() => {
    if (session?.user) {
      const fullName =
        session.user.firstName && session.user.lastName
          ? `${session.user.firstName} ${session.user.lastName}`
          : '';
      setFormData((prev) => ({
        ...prev,
        name: fullName,
        email: session.user?.email || '',
      }));
    }
  }, [session]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      toast.error('コメントを入力してください。', { position: 'bottom-right' });
      return;
    }
    if (!session && (!formData.name.trim() || !formData.email.trim())) {
      toast.error('お名前とメールアドレスを入力してください。', {
        position: 'bottom-right',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await ApiCommentArticle.postComment({
        articleId: Number(articleId),
        content: formData.comment,
        email: formData.email,
        name: formData.name,
      });

      if (response.status === 201 && response.data.comment) {
        const createdComment = {
          id: response.data.comment.id,
          articleId: Number(articleId),
          content: formData.comment,
          email: formData.email,
          name: formData.name,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          userId: null,
        };

        commentListRef.current?.addComment(createdComment as any);

        setFormData((prev) => ({ ...prev, comment: '' }));

        toast.success(response.data.message || 'Comment posted successfully', {
          position: 'bottom-right',
        });
      } else {
        toast.error(response.data.message || 'Failed to create comment', {
          position: 'bottom-right',
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('コメントの投稿に失敗しました。', {
        position: 'bottom-right',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h3 className="text-xl font-bold mb-4">コメント</h3>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            placeholder="コメントを入力してください"
            required
            disabled={submitting}
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="お名前"
              disabled={!!session || submitting}
              required
              readOnly={!!session}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="メールアドレス（非公開）"
              disabled={!!session || submitting}
              required
              readOnly={!!session}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            {submitting ? '投稿中...' : 'コメントを投稿'}
          </button>
        </div>
      </form>
      <ArticleCommentList id={articleId} ref={commentListRef} />
    </>
  );
}
