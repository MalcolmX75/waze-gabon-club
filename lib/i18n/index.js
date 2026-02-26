'use client';

import { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import fr from './fr.json';
import en from './en.json';

const SUPPORTED_LANGS = ['fr', 'en'];
const DEFAULT_LANG = 'fr';
const STORAGE_KEY = 'lang';

const translations = { fr, en };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      setLangState(stored);
      return;
    }
    const browserLang = navigator.language?.slice(0, 2);
    if (browserLang && SUPPORTED_LANGS.includes(browserLang)) {
      setLangState(browserLang);
    }
  }, []);

  const setLang = useCallback((newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang)) return;
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
  }, []);

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export { SUPPORTED_LANGS, DEFAULT_LANG };
