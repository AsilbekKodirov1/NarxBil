// src/components/scanner/ProductBottomSheet.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Store, 
  Tag, 
  AlertCircle, 
  ScanLine 
} from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";
import { addToCart } from "@/lib/cart";

export interface ScannedProductData {
  id: string;
  name: string;
  barcode: string;
  price: number;
  priceFormatted: string;
  discountPrice: number | null;
  discountPriceFormatted: string | null;
  discountPercent: number | null;
  imageUrl: string | null;
  category: string | null;
  store?: {
    id: string;
    name: string;
    address: string | null;
  };
}

interface ProductBottomSheetProps {
  product: ScannedProductData | null;
  notFoundBarcode: string | null;
  onClose: () => void;
  onManualInputClick: () => void;
}

export function ProductBottomSheet({
  product,
  notFoundBarcode,
  onClose,
  onManualInputClick,
}: ProductBottomSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    setQuantity(1);
    setIsAdded(false);
  }, [product?.id, notFoundBarcode]);

  const isOpen = Boolean(product || notFoundBarcode);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(
      {
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        discountPrice: product.discountPrice,
        imageUrl: product.imageUrl,
        category: product.category,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Orqa qorong'ilatuvchi parda */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Pastdan chiquvchi Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-[32px] shadow-2xl z-50 overflow-hidden border-t border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col"
          >
            {/* Tutqich chizig'i (Drag handle) */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* Chiqish tugmasi */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 overflow-y-auto">
              {/* HOLAT 1: MAHSULOT TOPILMADI */}
              {notFoundBarcode && !product && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/50 flex items-center justify-center text-amber-500 shadow-inner">
                    <AlertCircle className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
                    Mahsulot topilmadi
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span className="font-mono font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {notFoundBarcode}
                    </span>{" "}
                    shtrix kodli tovar do&apos;kon bazasida mavjud emas yoki noto&apos;g&apos;ri o&apos;qildi.
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={onManualInputClick}
                      className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition"
                    >
                      Kodni qo&apos;lda kiritib ko&apos;rish
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      Kameraga qaytish
                    </button>
                  </div>
                </div>
              )}

              {/* HOLAT 2: MAHSULOT MUVAFFAQIYATLI TOPILDI */}
              {product && (
                <div className="space-y-5">
                  {/* Mahsulot rasmi va asosiy ma'lumotlari */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex-shrink-0 shadow-sm">
                      {product.imageUrl && !imageError ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 96px, 112px"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Tag className="w-8 h-8 opacity-40" />
                        </div>
                      )}

                      {product.discountPercent && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-md">
                          -{product.discountPercent}%
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {product.category && (
                        <span className="inline-block text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md mb-1.5 uppercase tracking-wide">
                          {product.category}
                        </span>
                      )}
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {product.name}
                      </h2>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Shtrix: {product.barcode}
                      </div>

                      {product.store && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                          <Store className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{product.store.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Narx qismi */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 dark:from-purple-950/40 via-pink-50/50 dark:via-pink-950/30 to-amber-50/30 dark:to-amber-950/20 border border-purple-100/60 dark:border-purple-800/40">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Do&apos;kondagi narxi
                    </div>
                    <div className="flex items-baseline gap-3">
                      {product.discountPrice ? (
                        <>
                          <div className="text-3xl sm:text-4xl font-extrabold text-purple-700 dark:text-purple-400 font-price tracking-tight">
                            {product.discountPriceFormatted}
                          </div>
                          <div className="text-base sm:text-lg text-slate-400 font-price line-through decoration-rose-500 decoration-2">
                            {product.priceFormatted}
                          </div>
                        </>
                      ) : (
                        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-price tracking-tight">
                          {product.priceFormatted}
                        </div>
                      )}
                    </div>

                    {/* Eslatma */}
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span>{BRAND_CONFIG.priceDisclaimer}</span>
                    </p>
                  </div>

                  {/* Miqdor tanlash */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Miqdori:</span>
                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-40 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold font-price text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tugmalar */}
                  <div className="flex flex-col gap-2.5 pt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdded}
                      className={`w-full min-h-[50px] py-3.5 px-4 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                        isAdded
                          ? "bg-emerald-600 text-white shadow-emerald-600/30"
                          : "bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white shadow-purple-500/25 hover:opacity-95"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5 stroke-[2.5]" />
                          <span>Savatga qo&apos;shildi!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>
                            Savatga qo&apos;shish (
                            {BRAND_CONFIG.currency.format(
                              (product.discountPrice ?? product.price) * quantity
                            )}
                            )
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={onClose}
                      className="w-full py-3 px-4 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                    >
                      <ScanLine className="w-4 h-4" />
                      <span>Keyingi mahsulotni skanerlash</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
