// src/app/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  ScanLine, 
  Store, 
  Plus, 
  FileSpreadsheet, 
  ArrowUpRight, 
  ShieldAlert,
  Loader2,
  Clock
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { StatsCharts } from "@/components/admin/StatsCharts";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { CsvImportModal } from "@/components/admin/CsvImportModal";
import { BRAND_CONFIG } from "@/config/brand";

interface DashboardStats {
  totalProducts: number;
  todayScans: number;
  totalStores: number;
  top5Products: Array<{
    id: string;
    name: string;
    barcode: string;
    priceFormatted: string;
    scanCount: number;
    category: string | null;
  }>;
  weeklyTrend: Array<{ date: string; skanerlar: number }>;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Dashboard yuklash xatosi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
    } else if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/");
      } else {
        fetchStats();
      }
    }
  }, [status, session, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Admin panel yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#FAFAFF] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Ruxsat cheklangan</h2>
          <p className="text-xs text-slate-500 mb-4">
            Bu sahifaga faqat administratorlar kirish huquqiga ega.
          </p>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex">
      {/* Chap menyu */}
      <AdminSidebar />

      {/* Asosiy qism */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
              Admin Boshqaruv Paneli
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200/60"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">CSV Import</span>
            </button>

            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white text-xs font-bold shadow-md shadow-red-500/20 hover:opacity-95 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi mahsulot</span>
            </button>
          </div>
        </header>

        <main className="p-6 sm:p-8 space-y-8 max-w-6xl w-full">
          {/* Metrik kartalar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Jami tovarlar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Jami mahsulotlar
                </p>
                <p className="text-3xl font-extrabold text-slate-900 font-price mt-1">
                  {stats?.totalProducts ?? 0}
                </p>
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 mt-2"
                >
                  <span>Boshqarish</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            {/* Bugungi skanerlashlar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bugungi skanerlar
                </p>
                <p className="text-3xl font-extrabold text-slate-900 font-price mt-1">
                  {stats?.todayScans ?? 0}
                </p>
                <span className="inline-block text-[11px] font-semibold text-emerald-600 mt-2">
                  Bugun so&apos;ralgan narxlar
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                <ScanLine className="w-6 h-6" />
              </div>
            </div>

            {/* Do'konlar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Faol do&apos;konlar
                </p>
                <p className="text-3xl font-extrabold text-slate-900 font-price mt-1">
                  {stats?.totalStores ?? 1}
                </p>
                <span className="inline-block text-[11px] font-semibold text-slate-400 mt-2">
                  {BRAND_CONFIG.name} tarmog&apos;i
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recharts grafiklari */}
          {stats && (
            <StatsCharts
              weeklyTrend={stats.weeklyTrend}
              top5Products={stats.top5Products}
            />
          )}

          {/* Eng ko'p skanerlangan mahsulotlar jadvali */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-900">
                Eng ommabop mahsulotlar
              </h3>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Barchasini ko&apos;rish
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats?.top5Products.map((p, idx) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs font-mono text-slate-400">Shtrix: {p.barcode}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-price font-bold text-red-600">{p.priceFormatted}</p>
                    <p className="text-xs font-semibold text-slate-400">
                      {p.scanCount} marta skanerlangan
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Tovar qo'shish modali */}
      <ProductFormDialog
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={() => fetchStats()}
      />

      {/* CSV import modali */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={() => fetchStats()}
      />
    </div>
  );
}

