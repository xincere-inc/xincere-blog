import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

type Category = Pick<Prisma.CategoryGetPayload<{
  include: { _count: { select: { articles: true } } }
}>, 'id' | 'name' | 'slug'> & {
  _count: { articles: number }
};
interface CategoryListProps {
  categories: Category[];
  currentSlug?: string;
  className?: string;
}

const CategoryList = ({ categories, currentSlug, className = '' }: CategoryListProps) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm mb-6 ${className}`}>
      <h3 className="font-bold text-lg mb-4 border-b pb-2">
        カテゴリー
      </h3>
      <ul>
        {categories.map((category) => {
          const isCurrentCategory = category.slug === currentSlug;
          return (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className={`flex justify-between items-center py-2 px-2 rounded-md transition-colors duration-300 cursor-pointer ${
                  isCurrentCategory ? 'bg-[#E8F0E6]' : 'hover:bg-[#E8F0E6]'
                }`}
              >
                <span
                  className={
                    isCurrentCategory ? 'text-primary font-medium' : ''
                  }
                >
                  {category.name}
                </span>
                <span className="bg-[#E8F0E6] text-primary text-xs px-2 py-1 rounded-full">
                  {category._count.articles}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryList;