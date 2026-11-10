// src/components/i18n/LanguageSwitcher.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Language } from "@/lib/i18n";

const LANGUAGES: { code: Language; label: string; flag: string; short: string }[] = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿", short: "UZ" },
  { code: "ru", label: "Русский", flag: "🇷🇺", short: "RU" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer select-none"
        title="Tilni o'zgartirish / Сменить язык / Change language"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="font-mono tracking-wider">{current.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {LANGUAGES.map((item) => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLang(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{item.flag}</span>
                  <span>{item.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
