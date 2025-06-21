'use client';

import ApiCommentArticle from '@/api/ApiCommentArticle';
import '@ant-design/v5-patch-for-react-19';
import { Comment } from '@prisma/client';
import { Popconfirm } from 'antd';
import { useSession } from 'next-auth/react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast

interface Params {
  id: string;
}

export interface ArticleCommentListRef {
  addComment: (newComment: Comment) => void;
}

const ArticleCommentList = forwardRef<ArticleCommentListRef, Params>(
  ({ id }, ref) => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'admin';

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 10;

    const handlePageChange = (page: number) => {
      if (page < 1 || page > totalPages) return; // Prevent invalid pages
      setCurrentPage(page);
    };

    useImperativeHandle(ref, () => ({
      addComment: (newComment: Comment) => {
        setComments((prev) => [newComment, ...prev]);
      },
    }));

    useEffect(() => {
      async function fetchComments() {
        setLoading(true);
        try {
          const res = await ApiCommentArticle.getComments(
            Number(id),
            currentPage,
            limit
          );

          setComments(
            (res.data.comments || []).map((c: any) => ({
              id: c.id,
              articleId: c.articleId,
              userId: c.userId ?? null,
              name: c.name ?? null,
              email: c.email ?? null,
              content: c.content,
              status: c.status,
              createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
              updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
              deletedAt: c.deletedAt ? new Date(c.deletedAt) : null,
            }))
          );
          setTotalPages(Math.max(1, Math.ceil((res.data.total ?? 0) / limit))); // Ensure at least 1 page
        } catch (err) {
          console.error('コメントの取得に失敗しました:', err);
          toast.error('コメントの取得に失敗しました', {
            position: 'bottom-right',
          });
        } finally {
          setLoading(false);
        }
      }

      fetchComments();
    }, [id, currentPage]);

    const handleDeleteComment = async (commentId: string) => {
      try {
        const response = await ApiCommentArticle.adminDeleteComments({
          ids: [Number(commentId)],
        });

        if (response.status === 200) {
          setComments((prev) => prev.filter((c) => c.id !== Number(commentId)));
          toast.success(response.data.message || 'コメントを削除しました', {
            position: 'bottom-right',
          });
        }
      } catch (err) {
        console.error('削除エラー:', err);
        toast.error('コメントの削除に失敗しました', {
          position: 'bottom-right',
        });
      }
    };

    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
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
        if (startPage > 2)
          pages.push(
            <span key="start-ellipsis" className="px-2">
              ...
            </span>
          );
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
        if (endPage < totalPages - 1)
          pages.push(
            <span key="end-ellipsis" className="px-2">
              ...
            </span>
          );
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

    if (loading) return <p>読み込み中...</p>;

    return (
      <div className="space-y-6">
        {comments.map((c) => (
          <div
            key={c.id}
            className={`border-b pb-4${c.status === 'pending' ? ' opacity-70' : ''}`}
          >
            <div className="flex justify-between mb-2">
              <div className="font-bold">
                {c.name}
                {c.email === 'author@example.com' && (
                  <span className="text-primary text-sm">（著者）</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <p className="text-gray-700 flex-1 break-words">{c.content}</p>
              {isAdmin && (
                <Popconfirm
                  title="Are you sure you want to delete this comment？"
                  onConfirm={() => handleDeleteComment(String(c.id))}
                  okText="Yes"
                  cancelText="Cancel"
                >
                  <button
                    className="text-red-500 hover:underline mt-1 shrink-0"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 011 1v0a1 1 0 01-1 1H6a1 1 0 01-1-1v0a1 1 0 011-1h12z"
                      />
                    </svg>
                  </button>
                </Popconfirm>
              )}
            </div>
          </div>
        ))}
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
      </div>
    );
  }
);

export default ArticleCommentList;
