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
    <div className="relative mx-auto w-[270px] sm:w-[290px] h-[520px] sm:h-[560px] bg-slate-900 rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(124,58,237,0.35)] border-4 border-slate-800 select-none">
      {/* Telefon korpusi burchaklari va dinamik oroli */}
      <div className="relative w-full h-full bg-slate-950 rounded-[34px] overflow-hidden flex flex-col justify-between border border-slate-800">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-900/80 border border-purple-500/30" />
        </div>

        {/* Kamera interfeysi */}
        <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 overflow-hidden flex flex-col items-center justify-center p-4">
          {/* Orqa fon kamerasi simulyatsiyasi */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#7C3AED_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Skanerlanayotgan mahsulot shtrix kodi */}
          <div className="relative z-10 w-44 h-28 bg-white/95 rounded-2xl p-3 shadow-2xl flex flex-col items-center justify-center border border-white/60">
            <div className="text-[10px] font-bold text-slate-800 tracking-wider mb-1">
              Musaffo Sut 3.2% 1L
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

            {/* Skaner lazer chizig'i */}
            {step === "scanning" && (
              <motion.div
                animate={{ top: ["5%", "90%", "5%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1 right-1 h-0.5 bg-cyan-400 shadow-[0_0_10px_#06B6D4]"
              />
            )}
          </div>

          {/* Skaner nishoni burchaklari */}
          <div className="absolute w-56 h-40 pointer-events-none">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
          </div>

          <div className="absolute top-10 text-[11px] font-semibold text-white/70">
            Shtrix kod qidirilmoqda...
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
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4 shadow-2xl z-20 border-t border-purple-100"
            >
              <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mb-2.5" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex-shrink-0 flex items-center justify-center text-purple-600 font-bold text-xs border border-purple-200/60">
                  Sut
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-purple-600 uppercase">
                    Sut mahsulotlari
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 truncate">
                    Musaffo Sut 3.2% 1L
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-extrabold font-price text-purple-700">
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
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
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

