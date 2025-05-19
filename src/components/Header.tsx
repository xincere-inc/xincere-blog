'use client';

const Header = () => {
  return (
    <header className="bg-white shadow-sm h-[70px] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img
              src="images/logo.svg"
              alt="Logo"
              className="h-10 w-auto mr-2"
            />
          </a>
        </div>
        <button className="md:hidden text-gray-800 cursor-pointer">
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
