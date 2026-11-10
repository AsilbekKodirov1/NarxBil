// src/components/home/PhoneMockup.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ScanBarcode, Store, Percent, CheckCircle2 } from "lucide-react";
import { playSuccessChime } from "@/lib/audio";

interface DemoProduct {
  name: string;
  category: string;
  barcode: string;
  price: string;
  originalPrice?: string;
  discountBadge?: string;
  shortName: string;
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    name: "Musaffo Sut 3.2% 1L",
    category: "Sut mahsulotlari",
    barcode: "4780000150123",
    price: "11 900 so'm",
    originalPrice: "13 500 so'm",
    discountBadge: "-12% TEJOV",
    shortName: "Sut 1L",
  },
  {
    name: "Coca-Cola Classic 1.5L",
    category: "Ichimliklar",
    barcode: "5449000000996",
    price: "14 500 so'm",
    originalPrice: "16 000 so'm",
    discountBadge: "-9% AKSIYA",
    shortName: "Coca-Cola",
  },
  {
    name: "KitKat Shokolad 40g",
    category: "Shirinliklar",
    barcode: "7613035368545",
    price: "8 200 so'm",
    shortName: "KitKat",
  },
];

export function PhoneMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scanStep, setScanStep] = useState<"scanning" | "detected">("scanning");

  const activeProduct = DEMO_PRODUCTS[activeIdx];

  // 3D Tilt Spring Physics
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 22, stiffness: 220, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [0, 1], [14, -14]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-16, 16]);
  const glareX = useTransform(smoothMouseX, [0, 1], [0, 100]);
  const glareY = useTransform(smoothMouseY, [0, 1], [0, 100]);

  // Avtomatik skanerlash davri
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setScanStep("detected");
      try {
        playSuccessChime();
      } catch {
        // audio muted by default until user interaction
      }
    }, 1800);

    const timer2 = setTimeout(() => {
      setScanStep("scanning");
      setActiveIdx((prev) => (prev + 1) % DEMO_PRODUCTS.length);
    }, 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeIdx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleManualSelect = (idx: number) => {
    setActiveIdx(idx);
    setScanStep("scanning");
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-8 select-none perspective-[1400px] flex flex-col items-center justify-center"
    >
      {/* 3D Zamin Soyasi (Ambient Occlusion Floor Shadow) */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.45, 0.35],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-4 w-[260px] sm:w-[300px] h-[34px] rounded-[100%] bg-gradient-to-r from-red-600/20 via-blue-950/40 to-red-600/20 blur-xl pointer-events-none z-0"
      />

      {/* Asosiy 3D Harakatlanuvchi Telefon Qurilmasi */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative w-[285px] sm:w-[315px] h-[550px] sm:h-[580px] bg-[#0E1526] rounded-[48px] p-3 shadow-[0_30px_70px_-15px_rgba(11,21,40,0.5),0_15px_30px_-10px_rgba(220,38,38,0.3)] border-4 border-[#1E293B] cursor-grab active:cursor-grabbing group"
      >
        {/* Yon tugmalar (Physical metallic hardware buttons) */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-9 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-[7px] top-40 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -right-[7px] top-32 w-[3px] h-14 bg-red-700/80 rounded-r-sm" />

        {/* Ichki Shassi & Ekran (Screen Glass) */}
        <div className="relative w-full h-full bg-[#080C14] rounded-[38px] overflow-hidden flex flex-col justify-between border border-slate-800/80 shadow-inner">
          {/* Dinamik Oyna Yaltirashi (Specular Dynamic Glass Glare) */}
          <motion.div
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)`,
            }}
            className="absolute inset-0 z-40 pointer-events-none rounded-[38px]"
          />

          {/* Dynamic Island / Kamera tirqishi */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5 border border-slate-800/60 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-blue-600/50" />
            </div>
          </div>

          {/* 1-Qavat: Terminal Skaner Ko'rinishi */}
          <div className="relative flex-1 bg-[#090D18] flex flex-col items-center justify-between pt-10 pb-4 px-3 overflow-hidden">
            {/* Supermarket skaner lazer to'ri (Subtle Reticle Grid) */}
            <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:18px_18px]" />

            {/* Yuqori brend paneli (translateZ: 35px) */}
            <div
              style={{ transform: "translateZ(35px)" }}
              className="relative z-20 flex items-center justify-between w-full px-2"
            >
              <div className="flex items-center gap-1.5">
                <div className="relative w-6 h-6 rounded-lg bg-gradient-to-br from-red-600 to-blue-900 p-0.5 shadow-sm">
                  <Image
                    src="/brand/logo-box.png"
                    alt="OPTOVIK"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black tracking-tight text-white leading-none">
                    OPTOVIK<span className="text-red-500">.UZ</span>
                  </span>
                  <span className="text-[7.5px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                    Terminal v2.4
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/70 border border-red-800/60 text-red-400 text-[9px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>Jonli Skaner</span>
              </div>
            </div>

            {/* O'rta: Skanerlanayotgan 3D Shtrix Kod Kartasi (translateZ: 50px) */}
            <div
              style={{ transform: "translateZ(50px)" }}
              className="relative my-auto w-full max-w-[230px] bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] border-2 border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center"
            >
              {/* Tovar nomi */}
              <div className="text-[11px] font-extrabold text-slate-900 dark:text-white tracking-tight text-center mb-1 line-clamp-1">
                {activeProduct.name}
              </div>

              {/* Shtrix kod chiziqlari (Physical Barcode Graphic) */}
              <div className="relative w-full h-14 bg-white rounded-lg p-2 flex items-center justify-center gap-[2.5px] border border-slate-200 overflow-hidden my-1">
                {[5, 2, 4, 2, 6, 3, 2, 5, 2, 4, 7, 2, 3, 5, 2, 4, 3, 6, 2, 4, 2].map((w, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 h-full rounded-[0.5px]"
                    style={{ width: `${w}px` }}
                  />
                ))}

                {/* Skaner Lazer Nuri (Neon Crimson Laser Beam) */}
                {scanStep === "scanning" && (
                  <motion.div
                    animate={{ top: ["8%", "92%", "8%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1 right-1 h-[2.5px] bg-red-500 shadow-[0_0_12px_#EF4444]"
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-red-400/40 blur-xs rounded-full" />
                  </motion.div>
                )}
              </div>

              {/* Shtrix kod raqami */}
              <div className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 tracking-wider">
                {activeProduct.barcode}
              </div>

              {/* Burchak nishonlari */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-red-500 rounded-tl-md" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-red-500 rounded-tr-md" />
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-red-500 rounded-bl-md" />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-red-500 rounded-br-md" />
            </div>

            {/* Tovarlar almashtirish tugmalari (Interactive Test Pills) */}
            <div
              style={{ transform: "translateZ(30px)" }}
              className="flex items-center gap-1.5 z-20 mb-1"
            >
              {DEMO_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.barcode}
                  onClick={() => handleManualSelect(idx)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                    activeIdx === idx
                      ? "bg-red-600 text-white shadow-sm shadow-red-500/40 scale-105"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                  }`}
                >
                  {prod.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Qavat: Pastki 3D Narx Tegi & Chek Natijasi (translateZ: 65px) */}
          <div className="relative z-30 p-2.5 bg-gradient-to-t from-black via-slate-950 to-transparent">
            <AnimatePresence mode="wait">
              {scanStep === "detected" ? (
                <motion.div
                  key="detected"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 320, damping: 25 }}
                  style={{ transform: "translateZ(65px)" }}
                  className="bg-white rounded-2xl p-3 shadow-2xl border border-red-100 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Do&apos;kondagi narx:
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-price font-extrabold text-xl text-red-600 leading-none">
                          {activeProduct.price}
                        </span>
                        {activeProduct.originalPrice && (
                          <span className="text-[11px] font-semibold text-slate-400 line-through">
                            {activeProduct.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {activeProduct.discountBadge && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                        <Percent className="w-2.5 h-2.5" />
                        {activeProduct.discountBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Store className="w-3 h-3 text-red-600" />
                      <span>Markaziy Supermarket</span>
                    </span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Aniq narx
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ transform: "translateZ(40px)" }}
                  className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-center flex items-center justify-center gap-2"
                >
                  <ScanBarcode className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300">
                    Shtrix kod skanerlanmoqda...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Qo'llanma maslahat (3D interactive hover indicator) */}
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
        <span>Kursor bilan 3D burchakni aylantiring yoki tovarlarni bosing</span>
      </div>
    </div>
  );
}
