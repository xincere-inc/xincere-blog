'use client';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm h-[70px] flex items-center relative">
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

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="#"
              className="text-sm sm:text-md text-gray-800 hover:text-primary transition-colors duration-300"
            >
              無料相談
            </Link>
            <Link
              href="#"
              className="text-sm sm:text-md text-gray-800 hover:text-primary transition-colors duration-300"
            >
              導入事例
            </Link>
            <Link
              href="#"
              className="text-sm sm:text-md text-gray-800 hover:text-primary transition-colors duration-300"
            >
              無料スクック
            </Link>
            <Link
              href="/contacts"
              className="text-sm sm:text-md bg-primary text-white p-2 sm:p-4 rounded-md hover:bg-primary-dark transition-colors duration-300 flex items-center !rounded-button whitespace-nowrap cursor-pointer"
            >
              お問い合わせ
            </Link>
          </nav>
          <button
            className="md:hidden text-gray-800 cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            className="text-gray-800 cursor-pointer"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <Link
            href="#"
            className="text-md text-gray-800 hover:text-primary transition-colors duration-300"
            onClick={toggleMenu}
          >
            無料相談
          </Link>
          <Link
            href="#"
            className="text-md text-gray-800 hover:text-primary transition-colors duration-300"
            onClick={toggleMenu}
          >
            導入事例
          </Link>
          <Link
            href="#"
            className="text-md text-gray-800 hover:text-primary transition-colors duration-300"
            onClick={toggleMenu}
          >
            無料スクック
          </Link>
          <Link
            href="/contacts"
            className="text-md bg-primary text-white p-3 rounded-md hover:bg-primary-dark transition-colors duration-300 text-center"
            onClick={toggleMenu}
          >
            お問い合わせ
          </Link>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </header>
  );
};

export default Header;
