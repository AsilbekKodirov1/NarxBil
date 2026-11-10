// src/components/i18n/LanguageProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Translations, translations } from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "uz",
  setLang: () => {},
  t: translations.uz,
});

export const LANG_STORAGE_KEY = "narxbil_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("uz");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (saved && (saved === "uz" || saved === "ru" || saved === "en")) {
        setLangState(saved);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // safe fallback
    }
  };

  const t = translations[lang] || translations.uz;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
