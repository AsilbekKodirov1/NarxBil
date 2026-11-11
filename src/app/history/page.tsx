// src/app/history/page.tsx
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  History, 
  Trash2, 
  ScanBarcode, 
  ShoppingBag, 
  Clock, 
  Check, 
  Tag,
  ShieldCheck
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/components/ui/Toast";
import { BRAND_CONFIG } from "@/config/brand";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { 
  HistoryItemRecord, 
  HistoryGroupRecord, 
  getLocalScanHistory, 
  clearLocalScanHistory, 
  groupHistoryRecords 
} from "@/lib/scanHistory";

export default function HistoryPage() {
  const { status } = useSession();
  const { t, lang } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [groups, setGroups] = useState<HistoryGroupRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const groupTitles = useMemo(() => ({
    uz: { today: "Bugun", yesterday: "Kecha", week: "Oxirgi 7 kun", earlier: "Avvalroq" },
    ru: { today: "Сегодня", yesterday: "Вчера", week: "Последние 7 дней", earlier: "Ранее" },
    en: { today: "Today", yesterday: "Yesterday", week: "Last 7 days", earlier: "Earlier" },
  }[lang] || { today: "Bugun", yesterday: "Kecha", week: "Oxirgi 7 kun", earlier: "Avvalroq" }), [lang]);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      if (status === "authenticated") {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          if (data.groups && data.groups.length > 0) {
            setGroups(data.groups);
            setIsLoading(false);
            return;
          }
        }
      }

      // Mehmon rejimida yoki serverda bo'sh bo'lsa: LocalStorage'dan olish
      const localItems = getLocalScanHistory();
      if (localItems.length > 0) {
        const grouped = groupHistoryRecords(localItems, groupTitles);
        setGroups(grouped);
      } else {
        setGroups([]);
      }
    } catch {
      const localItems = getLocalScanHistory();
      setGroups(groupHistoryRecords(localItems, groupTitles));
    } finally {
      setIsLoading(false);
    }
  }, [status, groupTitles]);

  useEffect(() => {
    loadHistory();

    const handleUpdate = () => loadHistory();
    window.addEventListener("scan-history-updated", handleUpdate);
    return () => window.removeEventListener("scan-history-updated", handleUpdate);
  }, [loadHistory]);

  const handleClearHistory = async () => {
    if (!confirm(lang === "ru" ? "Очистить историю сканирования?" : lang === "en" ? "Clear scan history?" : "Skanerlash tarixini tozalashni tasdiqlaysizmi?")) return;

    try {
      if (status === "authenticated") {
        await fetch("/api/history", { method: "DELETE" }).catch(() => {});
      }
      clearLocalScanHistory();
      setGroups([]);
      toastSuccess(lang === "ru" ? "История очищена" : lang === "en" ? "History cleared" : "Skanerlash tarixi tozalandi");
    } catch {
      toastError(lang === "ru" ? "Ошибка при очистке" : lang === "en" ? "Error clearing history" : "Tarixni tozalashda xatolik yuz berdi");
    }
  };

  const handleAddToCart = (product: HistoryItemRecord["product"]) => {
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
    toastSuccess(`"${product.name}" ${t.cart.title.toLowerCase()}ga qo'shildi!`);

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 pb-24 sm:py-10">
        {/* Sarlavha */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <History className="w-7 h-7 text-red-600" />
              <span>{t.nav.history}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {lang === "ru" 
                ? "Все товары, цены которых вы проверяли" 
                : lang === "en" 
                ? "All products you previously scanned and checked" 
                : "Siz ilgari narxini tekshirgan barcha mahsulotlar"}
            </p>
          </div>

          {groups.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/50 px-3 py-2 rounded-xl border border-rose-200/50 dark:border-rose-900 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.cart.clearAll}</span>
            </button>
          )}
        </div>

        {/* Mehmon rejimida yengil eslatma (Bloklamaydigan xabar) */}
        {status === "unauthenticated" && groups.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                {lang === "ru"
                  ? "История сохраняется на этом устройстве. Войдите, чтобы синхронизировать её в облаке."
                  : lang === "en"
                  ? "History is saved locally on this device. Sign in to sync across devices."
                  : "Tarixingiz ushbu qurilmada saqlanmoqda. Boshqa telefonlarda ham ko'rish uchun tizimga kiring."}
              </span>
            </div>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap transition cursor-pointer"
            >
              {t.nav.login}
            </Link>
          </div>
        )}

        {/* Yuklanish skeleti */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          /* BO'SH TARIX HOLATI */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8 sm:p-14 text-center shadow-xl shadow-red-500/5 my-6"
          >
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 shadow-sm">
              <ScanBarcode className="w-10 h-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              {lang === "ru" ? "История пуста" : lang === "en" ? "No scan history yet" : "Tarix hozircha bo'sh"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8">
              {lang === "ru"
                ? "Вы еще не сканировали товары. Наведите камеру на штрих-код товара в магазине, чтобы узнать цену."
                : lang === "en"
                ? "You haven't scanned any products yet. Point your camera at a barcode to check prices."
                : "Siz hali tovarlarni skanerlamagansiz. Do'kondagi tovar shtrix kodini skanerlab narxini tekshiring."}
            </p>

            <Link
              href="/scan"
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-bold text-sm shadow-xl shadow-red-500/25 hover:opacity-95 active:scale-95 transition"
            >
              <ScanBarcode className="w-5 h-5" />
              <span>{t.cart.startShopping}</span>
            </Link>
          </motion.div>
        ) : (
          /* TARIX RO'YXATI (KUNLAR BO'YICHA GURUHLANGAN) */
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.title} className="space-y-3">
                {/* Guruh sarlavhasi (Bugun, Kecha...) */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-xl border border-red-200/50 dark:border-red-900">
                    {group.title}
                  </span>
                  <div className="flex-1 border-t border-slate-200/60 dark:border-slate-800" />
                  <span className="text-xs font-semibold text-slate-400">
                    {group.items.length} {t.cashier.quantityCol.toLowerCase()}
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
                          className={`p-2.5 rounded-xl transition flex items-center justify-center flex-shrink-0 cursor-pointer ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white group-hover:scale-105"
                          }`}
                          title={t.cart.title}
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
