'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage?: number;
  loading?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage = 1,
  loading = false,
  className = '',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages || loading) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // ページ番号のレンダリング（省略記号付き）
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 表示ページ数が最大表示ページ数より少ない場合、開始ページを調整
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 先頭ページと省略記号の表示
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === 1
              ? 'bg-xincereGreen text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          disabled={loading}
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

    // 中間ページの表示
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === i
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          disabled={loading}
        >
          {i}
        </button>
      );
    }

    // 末尾ページと省略記号の表示
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
              ? 'bg-xincereGreen text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          disabled={loading}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div
      className={`flex justify-center items-center space-x-2 mt-8 ${className}`}
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        前へ
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        次へ
      </button>
    </div>
  );
};

export default Pagination;
