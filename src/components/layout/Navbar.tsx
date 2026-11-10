// src/components/layout/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  ShieldCheck, 
  LogIn, 
  Menu, 
  X,
  ShoppingBag,
  History,
  ScanBarcode
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const isScanPage = pathname === "/scan";

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-200 border-b shadow-xs ${
        isScanPage
          ? "bg-black/90 border-white/10 text-white"
          : "bg-white/90 dark:bg-[#0B0F19]/90 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Chap tomon: Logotip */}
        <Logo iconSize={30} textSize="text-xl" isLink={true} />

        {/* O'rta: Asosiy havolalar (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link
            href="/scan"
            className={`flex items-center gap-1.5 transition ${
              pathname === "/scan"
                ? "text-red-600 dark:text-red-400 font-bold"
                : isScanPage
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
            }`}
          >
            <ScanBarcode className="w-4 h-4 text-red-500" />
            <span>{t.nav.scanner}</span>
          </Link>
          <Link
            href="/cart"
            className={`flex items-center gap-1.5 transition ${
              pathname === "/cart"
                ? "text-red-600 dark:text-red-400 font-bold"
                : isScanPage
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-red-500" />
            <span>{t.nav.cart}</span>
          </Link>
          <Link
            href="/history"
            className={`flex items-center gap-1.5 transition ${
              pathname === "/history"
                ? "text-blue-800 dark:text-blue-400 font-bold"
                : isScanPage
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400"
            }`}
          >
            <History className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>{t.nav.history}</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-3 py-1.5 rounded-xl border border-red-200/60 dark:border-red-800 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/60 transition"
            >
              <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>{t.nav.admin}</span>
            </Link>
          )}
        </nav>

        {/* O'ng tomon: Til tanlash, Qorong'i rejim, Profil va Kirish */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <LanguageSwitcher />
          <ThemeToggle />

          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition text-sm font-semibold ${
                  isScanPage
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-blue-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {session.user?.name ? session.user.name.charAt(0) : "U"}
                </div>
                <span className="hidden sm:inline-block max-w-[120px] truncate">
                  {session.user?.name || "Foydalanuvchi"}
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 text-slate-900 dark:text-slate-100"
                  >
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400">Kirilgan profil</p>
                      <p className="text-sm font-bold truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session.user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                          Administrator
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-xl transition"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin boshqaruvi</span>
                        </Link>
                      )}
                      <Link
                        href="/history"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <History className="w-4 h-4 text-slate-400" />
                        <span>Skanerlash tarixim</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.nav.logout}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-blue-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-md shadow-red-500/20 hover:opacity-95 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.nav.login}</span>
                </Link>
              </motion.div>
              <Link
                href="/register"
                className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl transition ${
                  isScanPage
                    ? "text-slate-200 hover:bg-white/10"
                    : "text-slate-700 dark:text-slate-200 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>Ro&apos;yxatdan o&apos;tish</span>
              </Link>
            </div>
          )}

          {/* Mobil menyu tugmasi */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition ${
              isScanPage
                ? "text-white hover:bg-white/10"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobil ochiluvchi menyu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 shadow-xl"
          >
            <Link
              href="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600"
            >
              <ScanBarcode className="w-5 h-5 text-red-600" />
              <span>Shtrix kod skaneri</span>
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600"
            >
              <ShoppingBag className="w-5 h-5 text-red-600" />
              <span>Xarid savati</span>
            </Link>
            <Link
              href="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700"
            >
              <History className="w-5 h-5 text-blue-700" />
              <span>Skanerlash tarixi</span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60"
              >
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span>Admin boshqaruvi</span>
              </Link>
            )}
            {!session && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center font-bold text-white bg-gradient-to-r from-red-600 to-blue-900 rounded-xl"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
