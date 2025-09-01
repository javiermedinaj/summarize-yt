import React, { useState } from 'react';
import { FaTerminal, FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import { LanguageToggle } from '../i18n/LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-black">
                YT-AI-RESUME
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#web-app"
              className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FaGlobe className="w-4 h-4" />
              <span className="hidden lg:inline">{t.navbar.webApp}</span>
              <span className="lg:hidden">{t.navbar.web}</span>
            </a>
            <a
              href="#terminal-app"
              className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FaTerminal className="w-4 h-4" />
              <span className="hidden lg:inline">{t.navbar.terminalComingSoon}</span>
              <span className="lg:hidden">{t.navbar.terminal}</span>
            </a>
            <LanguageToggle />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-black p-2 rounded-md transition-colors"
            >
              {isMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>


        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#web-app"
                className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaGlobe className="w-4 h-4" />
                {t.navbar.webApp}
              </a>
              <a
                href="#terminal-app"
                className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaTerminal className="w-4 h-4" />
                {t.navbar.terminalComingSoon}
              </a>
              <div className="px-3 py-2">
                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
