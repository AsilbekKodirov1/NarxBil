// src/components/admin/AdminSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  ShieldCheck, 
  ScanBarcode, 
  Home, 
  ExternalLink 
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND_CONFIG } from "@/config/brand";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      title: "Mahsulotlar",
      href: "/admin/products",
      icon: Package,
      active: pathname.startsWith("/admin/products"),
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0B0F19] border-r border-slate-200/80 dark:border-slate-800 min-h-screen flex flex-col justify-between p-5 hidden md:flex sticky top-0 h-screen select-none transition-colors duration-200">
      <div className="space-y-6">
        {/* Yuqori logotip */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <Logo iconSize={32} textSize="text-xl" isLink={true} />
          <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200/50 dark:border-red-900/60">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Admin Boshqaruvi</span>
          </div>
        </div>

        {/* Asosiy navigatsiya */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition ${
                  item.active
                    ? "bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white shadow-md shadow-red-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tezkor havolalar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            Tezkor o&apos;tish
          </div>
          <Link
            href="/scan"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <ScanBarcode className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>Skaner sahifasi</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-400" />
              <span>Bosh sahifaga qaytish</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Profil va Chiqish */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
            {session?.user?.name ? session.user.name.charAt(0) : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {session?.user?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {session?.user?.email || BRAND_CONFIG.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Tizimdan chiqish</span>
        </button>
      </div>
    </aside>
  );
}
