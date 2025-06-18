'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Define custom user type for NextAuth session
interface LoggedInUserInfo {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

interface CustomSession {
  user?: LoggedInUserInfo;
}

export default function ArticleReviewForm() {
  const { data: session } = useSession() as { data: CustomSession | null };

  // State for form fields
  const [formData, setFormData] = useState({
    comment: '',
    name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Update name and email when session changes
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

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      toast.error('コメントを入力してください。', {
        position: 'bottom-right',
      });
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
      // TODO: Replace with API call (e.g., ApiArticle.submitComment)
      console.log('Submitting comment:', formData);
      toast.success('コメントが投稿されました！', {
        position: 'bottom-right',
      });
      // Reset comment field after submission
      setFormData((prev) => ({
        ...prev,
        comment: '',
      }));
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
    /* コメントセクション */
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">コメント</h3>
      {/* コメント投稿フォーム */}
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
      {/* 既存コメント */}
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex justify-between mb-2">
            <div className="font-bold">佐藤 健太</div>
            <div className="text-sm text-gray-500">2025-04-08</div>
          </div>
          <p className="text-gray-700">
            とても参考になる記事でした！特に「ペルソナの精緻化」と「内部リンク構造の最適化」は自社のサイトでもすぐに取り入れたいと思います。質問ですが、内部リンク構造を最適化する際に使用しているツールなどはありますか？
          </p>
        </div>
        <div className="border-b pb-4">
          <div className="flex justify-between mb-2">
            <div className="font-bold">
              田島 光太郎 <span className="text-primary text-sm">（著者）</span>
            </div>
            <div className="text-sm text-gray-500">2025-04-09</div>
          </div>
          <p className="text-gray-700">
            佐藤様、コメントありがとうございます！内部リンク構造の分析には主にScreamingFrogとAhrefsを使用しています。特にScreamingFrogのビジュアライゼーション機能は、サイト構造の問題点を視覚的に把握するのに役立ちます。また、社内では独自のスプレッドシートでコンテンツインベントリを管理し、リンク機会を定期的に見直しています。
          </p>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <div className="font-bold">鈴木 美咲</div>
            <div className="text-sm text-gray-500">2025-04-10</div>
          </div>
          <p className="text-gray-700">
            「組織文化としてのSEO意識の浸透」が特に印象に残りました。マーケティング部門だけでなく、全社的な取り組みとしてSEOを位置づけることの重要性を再認識しました。弊社でも部門間の壁を取り払い、情報共有を活性化させたいと思います。素晴らしい記事をありがとうございました！
          </p>
        </div>
      </div>
    </div>
  );
}
