// src/app/error.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Ilovada kutilmagan xatolik yuz berdi:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#FAFAFF] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-6">
      <header className="flex justify-center pt-4">
        <Logo variant="horizontal" iconSize={36} />
      </header>

      <div className="max-w-md mx-auto text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mb-6 border border-amber-500/20 shadow-inner">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          Kutilmagan xatolik yuz berdi
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
          Tizimda vaqtinchalik nosozlik yuz berdi. Iltimos, sahifani qayta yuklang yoki birozdan so&apos;ng urinib ko&apos;ring.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-600/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Qayta urinish
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Bosh sahifa
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs font-mono text-slate-400 dark:text-slate-600">
            Xatolik kodi: {error.digest}
          </p>
        )}
      </div>

      <footer className="text-center text-xs text-slate-500 dark:text-slate-500 pb-4">
        &copy; {new Date().getFullYear()} OPTOVIK.UZ — Qo&apos;llab-quvvatlash xizmati
      </footer>
    </main>
  );
}
