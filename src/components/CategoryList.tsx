import React from 'react';

interface Category {
  name: string;
  count: number;
}

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <div>
      <h3 className="font-bold text-lg mb-4 border-b pb-2">カテゴリー</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <a
              href="#"
              className="flex justify-between items-center py-2 hover:bg-softGreen px-2 rounded-md transition-colors duration-300 cursor-pointer"
            >
              <span>{category.name}</span>
              <span className="bg-softGreen text-xincereGreen text-xs px-2 py-1 rounded-full">
                {category.count}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
