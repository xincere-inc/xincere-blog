'use client';

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-sm h-[70px] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img
              src="images/logo.svg"
              alt="Logo"
              className="h-6 sm:h-10 w-auto mr-2"
            />
          </a>
        </div>

        <div className="flex items-center">
          <Link
            href="/contacts"
            className="text-sm sm:text-md bg-primary text-white p-2 sm:p-4 rounded-md hover:bg-primary-dark transition-colors duration-300 flex items-center !rounded-button whitespace-nowrap cursor-pointer"
          >
            お問い合わせ
          </Link>
          <button className="md:hidden text-gray-800 cursor-pointer">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
