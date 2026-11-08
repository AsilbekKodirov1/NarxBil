// src/app/history/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Trash2, 
  ScanBarcode, 
  ShoppingBag, 
  LogIn, 
  Clock, 
  Check, 
  Tag, 
  Store,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/components/ui/Toast";
import { BRAND_CONFIG } from "@/config/brand";

interface HistoryItem {
  id: string;
  scannedAt: string;
  timeFormatted: string;
  product: {
    id: string;
    name: string;
    barcode: string;
    price: number;
    priceFormatted: string;
    discountPrice: number | null;
    discountPriceFormatted: string | null;
    imageUrl: string | null;
    category: string | null;
    storeName: string | null;
  };
}

interface HistoryGroup {
  title: string;
  items: HistoryItem[];
}

export default function HistoryPage() {
  const { status } = useSession();
  const { success: toastSuccess, info: toastInfo, error: toastError } = useToast();

  const [groups, setGroups] = useState<HistoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups || []);
      }
    } catch {
      toastError("Tarixni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchHistory();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  const handleClearHistory = async () => {
    if (!confirm("Skanerlash tarixini tozalashni tasdiqlaysizmi?")) return;

    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (res.ok) {
        setGroups([]);
        toastSuccess("Skanerlash tarixi tozalandi");
      }
    } catch {
      toastError("Tarixni tozalashda xatolik yuz berdi");
    }
  };

  const handleAddToCart = (product: HistoryItem["product"]) => {
    addToCart({
      id: product.id,
      name: product.name,
      barcode: product.barcode,
      price: product.price,
      discountPrice: product.discountPrice,
      imageUrl: product.imageUrl,
      category: product.category,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    toastSuccess(`"${product.name}" savatga qo'shildi!`);

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10">
        {/* Sarlavha */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <History className="w-7 h-7 text-red-600" />
              <span>Skanerlash Tarixi</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Siz ilgari narxini tekshirgan barcha mahsulotlar
            </p>
          </div>

          {status === "authenticated" && groups.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-2 rounded-xl border border-rose-200/50 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Tarixni tozalash</span>
            </button>
          )}
        </div>

        {/* 1. FOYDALANUVCHI KIRMAGAN BO'LSA (MEHMON REJIMI) */}
        {status === "unauthenticated" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xl shadow-red-500/5"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-600 shadow-sm">
              <LogIn className="w-10 h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Tarixni saqlash uchun tizimga kiring
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
              Siz hozir mehmon rejimidasiz. Skanerlangan tovarlaringiz keyingi safar ham saqlanib turishi uchun hisobingizga kiring.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:opacity-95 transition"
              >
                Tizimga kirish
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 transition"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </div>
          </motion.div>
        )}

        {/* 2. YUKLANMOQDA */}
        {status === "loading" || isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : null}

        {/* 3. KIRGAN VA TARIX BO'SH */}
        {status === "authenticated" && !isLoading && groups.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 p-8 sm:p-14 text-center shadow-xl shadow-red-500/5 my-6"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-red-50 flex items-center justify-center text-red-600">
              <History className="w-10 h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
              Hozircha tarix mavjud emas
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Siz hali birorta ham mahsulotni skanerlamadingiz. Kamerangiz orqali narxlarni bilishni boshlang!
            </p>

            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 transition active:scale-95"
            >
              <ScanBarcode className="w-4 h-4" />
              <span>Skanerlashni boshlash</span>
            </Link>
          </motion.div>
        )}

        {/* 4. TARIX RO'YXATI (KUNLAR BO'YICHA GURUHLANGAN) */}
        {status === "authenticated" && groups.length > 0 && (
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.title} className="space-y-3">
                {/* Guruh sarlavhasi (Bugun, Kecha...) */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-xl border border-red-200/50">
                    {group.title}
                  </span>
                  <div className="flex-1 border-t border-slate-200/60" />
                  <span className="text-xs font-semibold text-slate-400">
                    {group.items.length} ta tovar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.items.map((item) => {
                    const isAdded = Boolean(addedIds[item.product.id]);
                    const effectivePrice = item.product.discountPrice ?? item.product.price;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-sm hover:shadow-md transition flex items-center gap-3.5 group"
                      >
                        {/* Rasm */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-100 dark:border-slate-800">
                          {item.product.imageUrl ? (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                              <Tag className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Ma'lumot */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-semibold mb-0.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{item.timeFormatted}</span>
                            {item.product.storeName && (
                              <>
                                <span>•</span>
                                <span className="truncate">{item.product.storeName}</span>
                              </>
                            )}
                          </div>

                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {item.product.name}
                          </h3>

                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="font-price font-extrabold text-sm text-red-600 dark:text-red-400">
                              {BRAND_CONFIG.currency.format(effectivePrice)}
                            </span>
                            {item.product.discountPrice && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-price line-through">
                                {item.product.priceFormatted}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Savatga qo'shish tugmasi */}
                        <button
                          onClick={() => handleAddToCart(item.product)}
                          disabled={isAdded}
                          className={`p-2.5 rounded-xl transition flex items-center justify-center flex-shrink-0 ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white group-hover:scale-105"
                          }`}
                          title="Savatga qo'shish"
                        >
                          {isAdded ? (
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

