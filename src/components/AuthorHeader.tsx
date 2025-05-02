import AuthorCard from '@/components/AuthorCard';

const AuthorHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">
        後発のBtoBメディアがコンテンツSEOで勝ち切るために必要だった10のこと
      </h1>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="inline-block bg-primary-light text-primary text-xs px-3 py-1 rounded-full">
            コンテンツ戦略
          </span>
          <span className="text-gray-500 text-sm ml-4">2025-04-01</span>
        </div>
        <div className="flex space-x-3">
          <a
            href="#"
            className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
      <AuthorCard
        name="田島 光太郎"
        role="Xincere マーケティング責任者"
        description="10年以上のBtoBマーケティング経験を持ち、特にコンテンツマーケティングとSEO戦略に精通。"
        imageUrl="https://placehold.co/600x400"
        profileUrl="/author/tajima-kotaro"
      />
    </div>
  );
};

export default AuthorHeader;
