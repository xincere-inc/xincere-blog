import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faLinkedin,
  faFacebook,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const iconStyle: React.CSSProperties = { padding: 10, fontSize: 24 };

  return (
    <footer className="bg-gray-800 text-white py-10 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">SINCERE Tech Blog</h4>
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
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  お問い合わせ
                </a>
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
                <FontAwesomeIcon style={iconStyle} icon={faTwitter} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <FontAwesomeIcon style={iconStyle} icon={faFacebook} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <FontAwesomeIcon style={iconStyle} icon={faLinkedin} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <FontAwesomeIcon style={iconStyle} icon={faGithub} />
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
