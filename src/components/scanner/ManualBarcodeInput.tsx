// src/components/scanner/ManualBarcodeInput.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Barcode, Sparkles } from "lucide-react";

interface ManualBarcodeInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (barcode: string) => void;
}

// Tezkor sinash uchun namunaviy shtrix kodlar
const SAMPLE_BARCODES = [
  { name: "Musaffo Sut 1L", code: "4780000150123" },
  { name: "Coca-Cola 1.5L", code: "5449000000996" },
  { name: "KitKat Shokolad", code: "7613035368545" },
  { name: "Buxanka Non", code: "4780023456789" },
  { name: "President Sariyog'", code: "3176571991008" },
];

export function ManualBarcodeInput({
  isOpen,
  onClose,
  onSubmit,
}: ManualBarcodeInputProps) {
  const [barcode, setBarcode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = barcode.trim();
    if (!clean) return;
    onSubmit(clean);
    setBarcode("");
  };

  const handleSelectSample = (code: string) => {
    onSubmit(code);
    setBarcode("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[15%] max-w-md mx-auto bg-white rounded-3xl shadow-2xl z-50 p-6 border border-slate-100 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
                <Barcode className="w-5 h-5 text-purple-600" />
                <span>Kodni qo&apos;lda kiritish</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Mahsulot qadog&apos;idagi shtrix kod raqamlarini (odatda 8 yoki 13 ta raqam) kiriting.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Masalan: 4780000150123"
                  autoFocus
                  required
                  className="w-full min-h-[50px] px-4 py-3 text-lg font-mono tracking-wider font-semibold rounded-2xl border-2 border-purple-200 focus:border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition"
                />
              </div>

              <button
                type="submit"
                disabled={!barcode.trim()}
                className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Search className="w-4 h-4" />
                <span>Narxni tekshirish</span>
              </button>
            </form>

            {/* Namunaviy tezkor kodlar */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Sinash uchun tezkor tovarlar:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_BARCODES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleSelectSample(item.code)}
                    className="text-xs font-medium py-1.5 px-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/50 transition"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

