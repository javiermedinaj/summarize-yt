import React, { useState } from 'react';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import { ThemeToggle } from './ThemeToggle';
// import { LanguageToggle } from '../i18n/LanguageToggle';
// import { useLanguage } from '../i18n/LanguageContext';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { t } = useLanguage();

  return (
    <nav className="bg-white/95 dark:bg-black backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-black dark:text-white transition-colors duration-200">
                YT-AI-RESUME
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#web-app"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FaGlobe className="w-4 h-4" />
              {/* <span className="hidden lg:inline">{t.navbar.webApp}</span>
              <span className="lg:hidden">{t.navbar.web}</span> */}
            </a>
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-2">
              <a
                href="#web-app"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaGlobe className="w-4 h-4" />
                <span>Aplicación Web</span>
              </a>
              {/* <div className="px-3 py-2">
                <LanguageToggle />
              </div> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};