import React from 'react';
import { useLanguage } from './LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
      <button
        onClick={() => setLanguage('es')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          language === 'es'
            ? 'bg-white text-black shadow-sm'
            : 'text-gray-600 hover:text-black'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          language === 'en'
            ? 'bg-white text-black shadow-sm'
            : 'text-gray-600 hover:text-black'
        }`}
      >
        EN
      </button>
    </div>
  );
};
