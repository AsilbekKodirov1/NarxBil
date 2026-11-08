// src/app/not-found.tsx
import Link from "next/link";
import { ScanBarcode, Home } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAFAFF] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-6">
      <header className="flex justify-center pt-4">
        <Logo variant="horizontal" iconSize={36} />
      </header>

      <div className="max-w-md mx-auto text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-price font-extrabold text-5xl mb-6 shadow-inner border border-red-500/20">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          Sahifa topilmadi
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
          Siz qidirayotgan sahifa mavjud emas, o&apos;chirilgan yoki manzili o&apos;zgargan bo&apos;lishi mumkin.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <Home className="w-4 h-4" />
            Bosh sahifa
          </Link>

          <Link
            href="/scan"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-600/20 transition-all"
          >
            <ScanBarcode className="w-4 h-4" />
            Skanerga o&apos;tish
          </Link>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 dark:text-slate-500 pb-4">
        &copy; {new Date().getFullYear()} OPTOVIK.UZ — Aqlli Narx Tekshirish Tizimi
      </footer>
    </main>
  );
}
