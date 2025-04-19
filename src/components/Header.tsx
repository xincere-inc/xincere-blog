'use client';

const Header = () => {
  return (
    <header className="bg-white shadow-sm h-[70px] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <div className="text-xincereGreen font-bold text-2xl">SINCERE</div>
            <div className="text-gray-600 ml-2 text-sm">Tech Blog</div>
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-800 hover:text-xincereGreen transition-colors duration-300"
          >
            開発サービス
          </a>
          <a
            href="#"
            className="text-gray-800 hover:text-xincereGreen transition-colors duration-300"
          >
            導入事例
          </a>
          <a
            href="#"
            className="text-gray-800 hover:text-xincereGreen transition-colors duration-300"
          >
            技術スタック
          </a>
          <button className="bg-xincereGreen text-white px-4 py-2 rounded-md hover:bg-[#356423] transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
            無料相談
          </button>
        </nav>
        <button className="md:hidden text-gray-800 cursor-pointer">
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
