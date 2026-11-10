// src/components/home/PhoneMockup.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ScanBarcode, Store, Percent, CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Language } from "@/lib/i18n";

interface DemoProduct {
  name: string;
  category: string;
  barcode: string;
  price: string;
  originalPrice?: string;
  discountBadge?: string;
  shortName: string;
  savings: string;
}

const DEMO_PRODUCTS: Record<Language, DemoProduct[]> = {
  uz: [
    {
      name: "Musaffo Sut 3.2% 1L",
      category: "Sut mahsulotlari",
      barcode: "4780000150123",
      price: "11 900 so'm",
      originalPrice: "13 500 so'm",
      discountBadge: "-12% TEJOV",
      shortName: "Sut 1L",
      savings: "1 600 so'm tejaldi",
    },
    {
      name: "Coca-Cola Classic 1.5L",
      category: "Ichimliklar",
      barcode: "5449000000996",
      price: "14 500 so'm",
      originalPrice: "16 000 so'm",
      discountBadge: "-9% AKSIYA",
      shortName: "Coca-Cola",
      savings: "1 500 so'm tejaldi",
    },
    {
      name: "KitKat Shokolad 40g",
      category: "Shirinliklar",
      barcode: "7613035368545",
      price: "8 200 so'm",
      shortName: "KitKat",
      savings: "Standart narx",
    },
  ],
  ru: [
    {
      name: "Молоко Musaffo 3.2% 1Л",
      category: "Молочные продукты",
      barcode: "4780000150123",
      price: "11 900 сум",
      originalPrice: "13 500 сум",
      discountBadge: "-12% СКИДКА",
      shortName: "Молоко 1Л",
      savings: "1 600 сум экономия",
    },
    {
      name: "Coca-Cola Classic 1.5Л",
      category: "Напитки",
      barcode: "5449000000996",
      price: "14 500 сум",
      originalPrice: "16 000 сум",
      discountBadge: "-9% АКЦИЯ",
      shortName: "Coca-Cola",
      savings: "1 500 сум экономия",
    },
    {
      name: "Шоколад KitKat 40г",
      category: "Сладости",
      barcode: "7613035368545",
      price: "8 200 сум",
      shortName: "KitKat",
      savings: "Стандартная цена",
    },
  ],
  en: [
    {
      name: "Musaffo Milk 3.2% 1L",
      category: "Dairy products",
      barcode: "4780000150123",
      price: "11 900 UZS",
      originalPrice: "13 500 UZS",
      discountBadge: "-12% OFF",
      shortName: "Milk 1L",
      savings: "1,600 UZS saved",
    },
    {
      name: "Coca-Cola Classic 1.5L",
      category: "Beverages",
      barcode: "5449000000996",
      price: "14 500 UZS",
      originalPrice: "16 000 UZS",
      discountBadge: "-9% SALE",
      shortName: "Coca-Cola",
      savings: "1,500 UZS saved",
    },
    {
      name: "KitKat Chocolate 40g",
      category: "Sweets & Snacks",
      barcode: "7613035368545",
      price: "8 200 UZS",
      shortName: "KitKat",
      savings: "Standard price",
    },
  ],
};

const MOCKUP_TEXTS = {
  uz: {
    superSavings: "#SUPER-TEJOV",
    salePrice: "Aksiya Narxi",
    cashierCode: "KASSA TO'LOV KODI",
    readyForCashier: "Kassirga Tayyor",
    oneSecond: "1 soniya",
    storePrice: "Do'kondagi narx:",
    centralSupermarket: "Markaziy Supermarket",
    verifiedPrice: "Aniq narx",
    scanningBarcode: "Shtrix kod skanerlanmoqda...",
  },
  ru: {
    superSavings: "#СУПЕР-ЭКОНОМИЯ",
    salePrice: "Цена по акции",
    cashierCode: "КОД ОПЛАТЫ НА КАССЕ",
    readyForCashier: "Готово для кассира",
    oneSecond: "1 секунда",
    storePrice: "Цена в магазине:",
    centralSupermarket: "Центральный супермаркет",
    verifiedPrice: "Точная цена",
    scanningBarcode: "Сканирование штрих-кода...",
  },
  en: {
    superSavings: "#SUPER-SAVINGS",
    salePrice: "Sale Price",
    cashierCode: "CASHIER PAYMENT CODE",
    readyForCashier: "Ready for Cashier",
    oneSecond: "1 sec",
    storePrice: "Store price:",
    centralSupermarket: "Central Supermarket",
    verifiedPrice: "Verified price",
    scanningBarcode: "Scanning barcode...",
  },
};

export function PhoneMockup() {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [scanStep, setScanStep] = useState<"scanning" | "detected">("scanning");

  const products = DEMO_PRODUCTS[lang] || DEMO_PRODUCTS.uz;
  const activeProduct = products[activeIdx] || products[0];
  const texts = MOCKUP_TEXTS[lang] || MOCKUP_TEXTS.uz;

  // 3D Tilt Spring Physics (Ultra-smooth interpolation)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 26, stiffness: 240, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-18, 18]);

  // Parallax offsets for floating 3D companion elements
  const floatXLeft = useTransform(smoothX, [0, 1], [22, -22]);
  const floatYLeft = useTransform(smoothY, [0, 1], [18, -18]);

  const floatXRight = useTransform(smoothX, [0, 1], [-26, 26]);
  const floatYRight = useTransform(smoothY, [0, 1], [-20, 20]);

  // Specular Glare position
  const glareX = useTransform(smoothX, [0, 1], [0, 100]);
  const glareY = useTransform(smoothY, [0, 1], [0, 100]);

  // Avtomatik skanerlash davri (ovozsiz)
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setScanStep("detected");
    }, 1900);

    const timer2 = setTimeout(() => {
      setScanStep("scanning");
      setActiveIdx((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeIdx, products.length]);

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
      className="relative w-full max-w-[480px] sm:max-w-[540px] h-[580px] sm:h-[620px] select-none perspective-[1600px] flex items-center justify-center mx-auto"
    >
      {/* 3D Zamin Soyasi (Ambient Radial Floor Shadow) */}
      <motion.div
        animate={{
          scale: [0.95, 1.08, 0.95],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-6 w-[280px] sm:w-[340px] h-[40px] rounded-[100%] bg-gradient-to-r from-red-600/30 via-slate-950/60 to-blue-900/40 blur-2xl pointer-events-none z-0"
      />

      {/* ======================================================== */}
      {/* 3D FLOATING COMPANION 1: CHAP TOMONDAGI SERRATED NARX TEGI */}
      {/* ======================================================== */}
      <motion.div
        style={{
          x: floatXLeft,
          y: floatYLeft,
          transformStyle: "preserve-3d",
          transform: "translateZ(85px) rotateZ(-7deg)",
        }}
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="hidden sm:flex absolute -left-6 top-24 z-30 flex-col bg-white dark:bg-[#0E1526] rounded-2xl p-3.5 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.35)] border border-slate-200 dark:border-slate-700/80 w-[170px] pointer-events-none"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-inner" />
          <span className="text-[9px] font-mono font-bold text-slate-400">{texts.superSavings}</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-0.5">
          <Tag className="w-3 h-3" />
          <span>{texts.salePrice}</span>
        </div>

        <div className="font-price font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
          {activeProduct.price}
        </div>

        <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 pt-1 border-t border-dashed border-slate-200 dark:border-slate-700">
          <CheckCircle2 className="w-2.5 h-2.5" />
          <span>{activeProduct.savings}</span>
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* 3D FLOATING COMPANION 2: O'NG TOMONDAGI KASSA CHEKI / QR */}
      {/* ======================================================== */}
      <motion.div
        style={{
          x: floatXRight,
          y: floatYRight,
          transformStyle: "preserve-3d",
          transform: "translateZ(95px) rotateZ(6deg)",
        }}
        animate={{
          y: [0, -14, 0],
        }}
        transition={{
          y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
        className="hidden sm:flex absolute -right-6 bottom-28 z-30 flex-col bg-gradient-to-br from-red-600 to-blue-950 text-white rounded-2xl p-3.5 shadow-[0_20px_50px_-10px_rgba(220,38,38,0.45)] border-2 border-white/20 w-[180px] pointer-events-none"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8.5px] uppercase font-black tracking-widest text-red-200">
            {texts.cashierCode}
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <div className="font-mono font-black text-xl tracking-wider text-white">
          #OPT-74829
        </div>

        <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/20 text-[9px] font-bold text-red-100">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>{texts.readyForCashier}</span>
          </span>
          <span className="text-white font-black">{texts.oneSecond}</span>
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* ASOSIY 3D TELEFON QURILMASI (Hero Terminal Device) */}
      {/* ======================================================== */}
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
        className="relative w-[285px] sm:w-[315px] h-[550px] sm:h-[580px] bg-[#0E1526] rounded-[50px] p-3 shadow-[0_35px_80px_-15px_rgba(11,21,40,0.6),0_20px_40px_-10px_rgba(220,38,38,0.35)] border-4 border-slate-700/80 cursor-grab active:cursor-grabbing z-20"
      >
        {/* Yon apparat tugmalari (Tactile physical titanium buttons) */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-9 bg-slate-600 rounded-l-sm" />
        <div className="absolute -left-[7px] top-40 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
        <div className="absolute -right-[7px] top-32 w-[3px] h-14 bg-red-600/90 rounded-r-sm" />

        {/* Ichki shassi va ekran oynasi */}
        <div className="relative w-full h-full bg-[#080C14] rounded-[40px] overflow-hidden flex flex-col justify-between border border-slate-800 shadow-inner">
          {/* Dinamik Oyna Yaltirashi (Realistic Specular Glass Reflection) */}
          <motion.div
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 45%, transparent 70%)`,
            }}
            className="absolute inset-0 z-40 pointer-events-none rounded-[40px]"
          />

          {/* Dynamic Island / Kamera tirqishi */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5 border border-slate-800/80 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-blue-600/50" />
            </div>
          </div>

          {/* 1-QAVAT: Terminal Skaner Ko'rinishi */}
          <div className="relative flex-1 bg-[#090D18] flex flex-col items-center justify-between pt-10 pb-4 px-3 overflow-hidden">
            {/* Supermarket skaner lazer to'ri */}
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

            {/* O'rta: Skanerlanayotgan 3D Shtrix Kod Kartasi (translateZ: 55px) */}
            <div
              style={{ transform: "translateZ(55px)" }}
              className="relative my-auto w-full max-w-[230px] bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.55)] border-2 border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center"
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

                {/* Skaner Lazer Nuri (Neon Crimson Laser Beam with Glow Cone) */}
                {scanStep === "scanning" && (
                  <motion.div
                    animate={{ top: ["8%", "92%", "8%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1 right-1 h-[2.5px] bg-red-500 shadow-[0_0_14px_#EF4444]"
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-red-400/50 blur-xs rounded-full" />
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

            {/* Tovarlar almashtirish tugmalari (Interactive Test Pills with Dynamic Hover Layer) */}
            <div
              style={{ transform: "translateZ(35px)" }}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex items-center p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800/90 gap-1 z-20 mb-1"
            >
              {products.map((prod, idx) => {
                const isSelected = activeIdx === idx;
                const isHovered = hoveredIdx === idx;
                return (
                  <button
                    key={prod.barcode}
                    onClick={() => handleManualSelect(idx)}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    className={`relative px-2.5 py-1 rounded-lg text-[9.5px] font-bold transition-colors duration-150 cursor-pointer select-none ${
                      isSelected
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {/* Active Tanlangan Fon */}
                    {isSelected && (
                      <motion.div
                        layoutId="activePill"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-red-600 rounded-lg shadow-[0_2px_12px_rgba(220,38,38,0.55)] z-0"
                      />
                    )}

                    {/* Kursor kelganda orqasida silliq hover foni */}
                    {!isSelected && isHovered && (
                      <motion.div
                        layoutId="hoverPill"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 bg-white/10 rounded-lg border border-white/10 z-0"
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-1">
                      {prod.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-QAVAT: Pastki 3D Narx Tegi & Chek Natijasi (translateZ: 70px) */}
          <div className="relative z-30 p-2.5 bg-gradient-to-t from-black via-slate-950 to-transparent">
            <AnimatePresence mode="wait">
              {scanStep === "detected" ? (
                <motion.div
                  key="detected"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 320, damping: 25 }}
                  style={{ transform: "translateZ(70px)" }}
                  className="bg-white rounded-2xl p-3 shadow-2xl border border-red-100 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {texts.storePrice}
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
                      <span>{texts.centralSupermarket}</span>
                    </span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      {texts.verifiedPrice}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ transform: "translateZ(45px)" }}
                  className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-center flex items-center justify-center gap-2"
                >
                  <ScanBarcode className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300">
                    {texts.scanningBarcode}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
