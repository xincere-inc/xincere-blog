import Image from 'next/image';

interface PopularArticle {
  id: number;
  title: string;
  image: string;
}

interface PopularArticlesProps {
  articles: PopularArticle[];
}

const PopularArticles: React.FC<PopularArticlesProps> = ({ articles }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="font-bold text-lg mb-4 border-b pb-2">人気記事</h3>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="flex space-x-3 cursor-pointer">
            <div className="w-[100px] h-[70px] overflow-hidden rounded">
              <Image
                src={article.image}
                alt={article.title}
                width={100}
                height={70}
                className="object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium line-clamp-3">{article.title}</h4>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularArticles;
