// src/components/home/PhoneMockup.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, Sparkles } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

export function PhoneMockup() {
  const [step, setStep] = useState<"scanning" | "detected" | "added">("scanning");

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev === "scanning") return "detected";
        if (prev === "detected") return "added";
        return "scanning";
      });
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-[270px] sm:w-[290px] h-[520px] sm:h-[560px] bg-slate-900 rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(220,38,38,0.3)] border-4 border-slate-800 select-none">
      {/* Telefon korpusi burchaklari va dinamik oroli */}
      <div className="relative w-full h-full bg-slate-950 rounded-[34px] overflow-hidden flex flex-col justify-between border border-slate-800">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-900/80 border border-red-500/40" />
        </div>

        {/* Kamera interfeysi */}
        <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 overflow-hidden flex flex-col items-center justify-center p-4">
          {/* Orqa fon kamerasi simulyatsiyasi */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#DC2626_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Yuqori ilova logotipi */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="h-6 w-20 relative">
              <Image
                src="/brand/logo-transparent.png"
                alt="OPTOVIK.UZ"
                fill
                className="object-contain drop-shadow"
                priority
              />
            </div>
            <div className="text-[10px] font-semibold text-white/70 mt-1">
              Shtrix kod qidirilmoqda...
            </div>
          </div>
          <div className="relative z-10 w-44 h-28 bg-white rounded-2xl p-3 shadow-2xl flex flex-col items-center justify-center border border-slate-100">
            <div className="text-[10px] font-bold text-slate-800 tracking-wider mb-1 flex items-center gap-1">
              <span>Musaffo Sut 3.2% 1L</span>
            </div>
            {/* Shtrix kod chiziqlari */}
            <div className="flex items-center justify-center gap-[3px] h-10 w-full px-2">
              {[4, 2, 5, 2, 6, 3, 2, 5, 2, 4, 6, 2, 3, 5, 2, 4].map((w, i) => (
                <div key={i} className="bg-slate-900 h-full rounded-sm" style={{ width: `${w}px` }} />
              ))}
            </div>
            <div className="text-[9px] font-mono font-bold text-slate-600 mt-1">
              4780000150123
            </div>

            {/* Skaner lazer chizig'i (Neon Qizil) */}
            {step === "scanning" && (
              <motion.div
                animate={{ top: ["5%", "90%", "5%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1 right-1 h-0.5 bg-red-500 shadow-[0_0_12px_#EF4444]"
              />
            )}
          </div>

          {/* Skaner nishoni burchaklari (Qizil burchaklar) */}
          <div className="absolute w-56 h-40 pointer-events-none">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-500 rounded-tl-lg shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-500 rounded-tr-lg shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-500 rounded-bl-lg shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-500 rounded-br-lg shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
          </div>
        </div>

        {/* Natija kartasi (Pastdan chiqadigan bottom sheet animatsiyasi) */}
        <AnimatePresence>
          {step !== "scanning" && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4 shadow-2xl z-20 border-t border-red-100"
            >
              <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mb-2.5" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex-shrink-0 flex items-center justify-center text-red-600 font-bold text-xs border border-red-200/60">
                  Sut
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-red-600 uppercase flex items-center justify-between">
                    <span>Sut mahsulotlari</span>
                    <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded text-[9px] font-black">-12%</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 truncate">
                    Musaffo Sut 3.2% 1L
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-extrabold font-price text-red-600">
                      11 900 so&apos;m
                    </span>
                    <span className="text-[10px] text-slate-400 font-price line-through">
                      13 500
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div
                  className={`w-full py-2 px-3 rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                    step === "added"
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-red-600 to-blue-900 text-white"
                  }`}
                >
                  {step === "added" ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Savatga qo&apos;shildi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Savatga qo&apos;shish</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
