import Link from 'next/link';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Xincere Blog</h4>
            <p className="text-gray-300 text-sm">
              最新の技術トレンドやシステム開発事例、効果的な開発手法のノウハウを発信しています。
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">リンク</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  会社概要
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  サービス
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  実績
                </a>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">フォロー</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <FaXTwitter fontSize={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <FaFacebook fontSize={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <FaLinkedin fontSize={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <FaGithub fontSize={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© 2025 株式会社シンシア All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
