import Image from 'next/image';

interface ArticleCardProps {
  imageUrl: string;
  altText: string;
  title: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  imageUrl,
  altText,
  title,
}) => {
  return (
    <div className="flex space-x-3 cursor-pointer">
      <div className="w-[100px] h-[70px] overflow-hidden rounded">
        <Image
          src={imageUrl}
          alt={altText}
          width={100}
          height={70}
          className="rounded"
        />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium line-clamp-3">{title}</h4>
      </div>
    </div>
  );
};

export default ArticleCard;
