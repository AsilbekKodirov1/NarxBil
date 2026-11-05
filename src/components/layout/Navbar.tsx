// src/components/layout/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  LogOut, 
  ShieldCheck, 
  LogIn, 
  Menu, 
  X,
  Sparkles,
  ShoppingBag,
  History,
  ScanBarcode
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND_CONFIG } from "@/config/brand";

export function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Chap tomon: Logotip */}
        <Logo iconSize={30} textSize="text-xl" isLink={true} />

        {/* O'rta: Asosiy havolalar (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link
            href="/scan"
            className="flex items-center gap-1.5 hover:text-purple-600 transition"
          >
            <ScanBarcode className="w-4 h-4 text-purple-600" />
            <span>Skaner</span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 hover:text-purple-600 transition"
          >
            <ShoppingBag className="w-4 h-4 text-pink-500" />
            <span>Savat</span>
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-1.5 hover:text-purple-600 transition"
          >
            <History className="w-4 h-4 text-amber-500" />
            <span>Tarix</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200/60 font-bold hover:bg-purple-100 transition"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* O'ng tomon: Profil yoki Kirish tugmasi */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200/80 transition text-sm font-semibold text-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
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
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50"
                  >
                    <div className="p-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-400">Kirilgan profil</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                          Administrator
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 rounded-xl transition"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin boshqaruvi</span>
                        </Link>
                      )}
                      <Link
                        href="/history"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition"
                      >
                        <History className="w-4 h-4 text-slate-400" />
                        <span>Skanerlash tarixim</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Chiqish</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-purple-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Kirish</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 px-4 py-2 rounded-xl shadow-md shadow-purple-500/20 hover:opacity-95 active:scale-95 transition"
              >
                <span>Ro&apos;yxatdan o&apos;tish</span>
              </Link>
            </div>
          )}

          {/* Mobil menyu tugmasi */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
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
            className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2 shadow-lg"
          >
            <Link
              href="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-600"
            >
              <ScanBarcode className="w-5 h-5 text-purple-600" />
              <span>Shtrix kod skaneri</span>
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-700 hover:bg-pink-50 hover:text-pink-600"
            >
              <ShoppingBag className="w-5 h-5 text-pink-500" />
              <span>Xarid savati</span>
            </Link>
            <Link
              href="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600"
            >
              <History className="w-5 h-5 text-amber-500" />
              <span>Skanerlash tarixi</span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl font-bold text-purple-700 bg-purple-50"
              >
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Admin boshqaruvi</span>
              </Link>
            )}
            {!session && (
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl"
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

