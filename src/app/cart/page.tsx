// src/app/cart/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ScanBarcode, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Tag,
  Bot
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { BudgetController } from "@/components/cart/BudgetController";
import { AiAssistantModal } from "@/components/cart/AiAssistantModal";
import { BRAND_CONFIG } from "@/config/brand";
import { 
  CartItem, 
  getCartFromStorage, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart, 
  calculateCartTotal 
} from "@/lib/cart";
import { useToast } from "@/components/ui/Toast";

export default function CartPage() {
  const { success: toastSuccess, info: toastInfo } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const loadCart = () => {
    setItems(getCartFromStorage());
    setIsLoaded(true);
  };

  useEffect(() => {
    loadCart();

    const handleUpdate = () => loadCart();
    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

  const handleQuantityChange = (productId: string, newQty: number) => {
    const updated = updateCartQuantity(productId, newQty);
    setItems(updated);
  };

  const handleRemove = (productId: string, name: string) => {
    const updated = removeFromCart(productId);
    setItems(updated);
    toastInfo(`"${name}" savatdan o'chirildi`);
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    if (confirm("Haqiqatan ham savatdagi barcha tovarlarni tozalashni xohlaysizmi?")) {
      clearCart();
      setItems([]);
      toastSuccess("Savat muvaffaqiyatli tozalandi");
    }
  };

  const { totalItems, totalSum, totalSavings } = calculateCartTotal(items);

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 pb-24 sm:py-10">
        {/* Sahifa sarlavhasi */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-red-600" />
              <span>Xarid Savati</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Skanerlangan barcha tovarlar va jami hisob-kitob
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-2 rounded-xl border border-rose-200/50 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Savatni tozalash</span>
            </button>
          )}
        </div>

        {/* Yuklanish skeleti */}
        {!isLoaded ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* BO'SH SAVAT HOLATI */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8 sm:p-14 text-center shadow-xl shadow-red-500/5 my-6"
          >
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-gradient-to-tr from-red-100 via-rose-100 to-blue-100 dark:from-red-950/60 dark:via-rose-950/50 dark:to-blue-950/60">
              <ShoppingBag className="w-12 h-12 text-red-600" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Savatingiz hozircha bo&apos;sh
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8">
              Kassaga bormasdan narxlarni bilish va hisoblab borish uchun mahsulotlar shtrix kodini skanerlang.
            </p>

            <Link
              href="/scan"
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-bold text-sm shadow-xl shadow-red-500/25 hover:opacity-95 active:scale-95 transition"
            >
              <ScanBarcode className="w-5 h-5" />
              <span>Skanerlashni boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* TO'LA SAVAT RO'YXATI VA HISOBLAGICH */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Tovar kartalari ro'yxati (2 ustun) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Byudjet nazorati moduli */}
              <BudgetController currentTotal={totalSum} />

              <div className="space-y-3">
                <AnimatePresence>
                {items.map((item) => {
                  const effectivePrice = item.discountPrice ?? item.price;
                  const itemTotal = effectivePrice * item.quantity;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition flex items-center gap-4"
                    >
                      {/* Rasm */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-100 dark:border-slate-800">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                            <Tag className="w-6 h-6" />
                          </div>
                        )}
                        {item.discountPrice && (
                          <span className="absolute top-1 left-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                            Chegirma
                          </span>
                        )}
                      </div>

                      {/* Nomi va Narxi */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                          {item.category || "Oziq-ovqat"}
                        </div>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h3>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-price font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                            {BRAND_CONFIG.currency.format(effectivePrice)}
                          </span>
                          {item.discountPrice && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-price line-through">
                              {BRAND_CONFIG.currency.format(item.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Miqdor va Jami narx */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition shadow-sm"
                            aria-label="Kamaytirish"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-price text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition shadow-sm"
                            aria-label="Ko'paytirish"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-semibold text-slate-400">Jami:</div>
                          <div className="font-price font-extrabold text-red-600 text-sm sm:text-base">
                            {BRAND_CONFIG.currency.format(itemTotal)}
                          </div>
                        </div>
                      </div>

                      {/* O'chirish tugmasi */}
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl hover:bg-rose-50"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Yana skanerlash tugmasi */}
              <div className="pt-2">
                <Link
                  href="/scan"
                  className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-red-300 hover:border-red-500 bg-red-50/50 hover:bg-red-50 text-red-700 font-bold text-sm transition flex items-center justify-center gap-2"
                >
                  <ScanBarcode className="w-4 h-4" />
                  <span>Yana mahsulot skanerlash</span>
                </Link>
              </div>
            </div>
          </div>

          {/* O'ng tomon: Jami hisob-kitob (Sticky Summary Card) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl shadow-red-500/5 sticky top-24 space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Hisob-kitob xulosasi
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kassaga bormasdan taxminiy hisob
                </p>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Jami tovarlar soni:</span>
                  <span className="font-bold text-slate-900 font-price">{totalItems} ta</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Chegirmadan tejov:</span>
                    </span>
                    <span className="font-price font-bold">
                      -{BRAND_CONFIG.currency.format(totalSavings)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Umumiy summa:</span>
                  <AnimatedCounter
                    value={totalSum}
                    className="text-2xl sm:text-3xl text-red-600 dark:text-red-400 tracking-tight"
                  />
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1 mt-3">
                  <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span>{BRAND_CONFIG.priceDisclaimer}</span>
                </div>
              </div>

              <div className="pt-1 space-y-2.5">
                {/* AI Maslahatchi tugmasi */}
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-blue-50 dark:from-red-950/40 dark:via-rose-950/30 dark:to-blue-950/40 border border-red-200/80 dark:border-red-900/60 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition shadow-sm active:scale-95"
                >
                  <Bot className="w-4 h-4 text-red-600" />
                  <span>AI Maslahatchi (Retsept & Tahlil)</span>
                  <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                </button>

                <Link
                  href="/scan"
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  <ScanBarcode className="w-4 h-4" />
                  <span>Skanerlashda davom etish</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistent Modali */}
        <AiAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          items={items}
          budget={totalSum}
        />
      </main>
      <BottomNav />
    </div>
  );
}

