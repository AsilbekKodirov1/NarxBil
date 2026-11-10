// src/components/layout/BottomNav.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Home, 
  History, 
  ScanBarcode, 
  ShoppingBag, 
  User, 
  ShieldCheck,
  LogIn
} from "lucide-react";
import { getCartFromStorage } from "@/lib/cart";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [cartCount, setCartCount] = useState(0);

  const updateBadge = () => {
    const items = getCartFromStorage();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateBadge();
    window.addEventListener("cart-updated", updateBadge);
    return () => window.removeEventListener("cart-updated", updateBadge);
  }, []);

  // Admin sahifasida pastki mobil menyuni ko'rsatmaslik
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 pb-safe select-none shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around relative">
        {/* 1. Bosh sahifa */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            pathname === "/" 
              ? "text-red-600 dark:text-red-400 font-bold" 
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t.nav.home}</span>
        </Link>

        {/* 2. Tarix */}
        <Link
          href="/history"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            pathname === "/history" 
              ? "text-red-600 dark:text-red-400 font-bold" 
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t.nav.history}</span>
        </Link>

        {/* 3. Markaziy Skaner Tugmasi (OPTOVIK Red-Navy Gradient) */}
        <div className="flex-1 flex justify-center -mt-6">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Link
              href="/scan"
              className="relative group p-4 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-blue-900 text-white shadow-xl shadow-red-600/35 transition-transform border-4 border-white dark:border-slate-900 flex items-center justify-center"
              aria-label={t.nav.scanner}
            >
              {/* Pulsatsiya xalqasi */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30 pointer-events-none" />
              <ScanBarcode className="w-7 h-7 stroke-[2.5]" />
            </Link>
          </motion.div>
        </div>

        {/* 4. Savat */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition ${
            pathname === "/cart" 
              ? "text-red-600 dark:text-red-400 font-bold" 
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{t.nav.cart}</span>
        </Link>

        {/* 5. Profil / Kirish */}
        <Link
          href={session ? (isAdmin ? "/admin" : "/history") : "/login"}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin")
              ? "text-red-600 dark:text-red-400 font-bold"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          {isAdmin ? (
            <ShieldCheck className="w-5 h-5 mb-0.5 text-red-600" />
          ) : session ? (
            <User className="w-5 h-5 mb-0.5" />
          ) : (
            <LogIn className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[10px] tracking-tight">
            {session ? (isAdmin ? "Boshqaruv" : "Profil") : "Kirish"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
