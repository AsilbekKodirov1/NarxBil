// src/components/layout/BottomNav.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Home, 
  History, 
  ScanBarcode, 
  ShoppingBag, 
  User, 
  ShieldCheck 
} from "lucide-react";
import { getCartFromStorage } from "@/lib/cart";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/70 pb-safe select-none shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around relative">
        {/* 1. Bosh sahifa */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            pathname === "/" ? "text-purple-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Asosiy</span>
        </Link>

        {/* 2. Tarix */}
        <Link
          href="/history"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            pathname === "/history" ? "text-purple-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Tarix</span>
        </Link>

        {/* 3. Markaziy Skaner Tugmasi (Bo'rtib turuvchi, yirik, pulsatsiyali) */}
        <div className="flex-1 flex justify-center -mt-6">
          <Link
            href="/scan"
            className="relative group p-4 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 text-white shadow-xl shadow-purple-500/35 transition-transform active:scale-95 hover:scale-105 border-4 border-white flex items-center justify-center"
            aria-label="Shtrix kodni skanerlash"
          >
            {/* Pulsatsiya xalqasi */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-30 pointer-events-none" />
            <ScanBarcode className="w-7 h-7 stroke-[2.5]" />
          </Link>
        </div>

        {/* 4. Savat */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition ${
            pathname === "/cart" ? "text-purple-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Savat</span>
        </Link>

        {/* 5. Profil yoki Admin */}
        <Link
          href={session ? (isAdmin ? "/admin" : "/login") : "/login"}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin")
              ? "text-purple-600 font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {isAdmin ? (
            <ShieldCheck className="w-5 h-5 mb-0.5 text-purple-600" />
          ) : (
            <User className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[10px] tracking-tight">
            {session ? (isAdmin ? "Admin" : "Profil") : "Kirish"}
          </span>
        </Link>
      </div>
    </nav>
  );
}

