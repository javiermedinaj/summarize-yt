import React, { createContext, useContext, useState } from 'react';
import { Language, TranslationStrings } from './types';
import { es } from './es';
import { en } from './en';

interface LanguageContextType {
  language: Language;
  translations: TranslationStrings;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = { es, en };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detectar idioma del navegador, por defecto español
  const getInitialLanguage = (): Language => {
    const saved = localStorage.getItem('preferred-language') as Language;
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved;
    }
    
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) {
      return 'es';
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const contextValue: LanguageContextType = {
    language,
    translations: translations[language],
    setLanguage,
    t: translations[language], 
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
