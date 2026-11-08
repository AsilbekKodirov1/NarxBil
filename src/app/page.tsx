// src/app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ScanBarcode, 
  ArrowRight, 
  Zap, 
  Clock, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  LogIn
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { PwaManager } from "@/components/pwa/PwaManager";
import { PhoneMockup } from "@/components/home/PhoneMockup";
import { Logo } from "@/components/brand/Logo";
import { BRAND_CONFIG } from "@/config/brand";

export default function HomePage() {
  const steps = [
    {
      num: "01",
      title: "Shtrix kodni skanerlang",
      desc: "Telefoningiz kamerasini tovar qadog'idagi shtrix kodga to'g'rilang. Hech qanday dastur yuklab olish shart emas.",
      icon: ScanBarcode,
      color: "from-red-600 to-rose-700",
    },
    {
      num: "02",
      title: "Narxni darhol ko'ring",
      desc: "Do'kondagi eng so'nggi aniq narx, chegirmalar va tovar to'liq ma'lumoti 1 soniyada ekranda paydo bo'ladi.",
      icon: Zap,
      color: "from-blue-800 to-indigo-950",
    },
    {
      num: "03",
      title: "Byudjetingizni nazorat qiling",
      desc: "Xarid savatingizga qo'shib boring va kassaga bormasdanoq umumiy summani doimo aniq bilib turing.",
      icon: ShoppingBag,
      color: "from-red-600 via-rose-600 to-blue-900",
    },
  ];

  const features = [
    {
      title: "Vaqtingizni tejang",
      desc: "Narxi yozilmagan tovarlar uchun kassirni qidirish yoki kassada navbat kutishga vaqt sarflamaysiz.",
      icon: Clock,
      color: "text-red-600 bg-red-50 dark:bg-red-950/40",
    },
    {
      title: "Aniq va shaffof narxlar",
      desc: "Kassada to'lash paytida kutilmagan noxush narxlardan va ortiqcha xarajatlardan o'zingizni asraysiz.",
      icon: ShieldCheck,
      color: "text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Aksiyalar va chegirmalar",
      desc: "Chegirmali mahsulotlarni darhol bilib olasiz — eski narx va qancha tejalayotgani yaqqol ko'rinadi.",
      icon: Sparkles,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
    },
    {
      title: "PWA — Telefoningizga o'rnatiladi",
      desc: "Xuddi oddiy mobil ilova kabi telefon ekraniga o'rnatiladi va internet sekin bo'lganda ham ishlayveradi.",
      icon: Smartphone,
      color: "text-red-700 bg-red-50 dark:bg-red-950/40",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      <Navbar />
      <PwaManager />

      {/* Orqa fon bezakli OPTOVIK qizil va to'q ko'k gradient bloblari */}
      <div className="absolute top-12 left-[-10%] w-[550px] h-[550px] rounded-full bg-red-500/12 dark:bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-[-10%] w-[550px] h-[550px] rounded-full bg-blue-900/15 dark:bg-blue-950/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-[450px] h-[450px] rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      {/* 1. HERO BO'LIMI */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-28 px-4 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Matnli qism (7 ustun) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Kichik tepki nishon */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200/80 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-black shadow-sm cursor-default"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Smart Supermarket Yordamchisi</span>
            </motion.div>

            {/* Asosiy Sarlavha */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Kassaga bormasdan{" "}
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 bg-clip-text text-transparent">
                narxni biling
              </span>
            </h1>

            {/* Tavsif matni */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              {BRAND_CONFIG.description} Do&apos;kondagi xaridlaringizni osonlashtiring, vaqtingizni va pulingizni tejang!
            </p>

            {/* Asosiy harakat tugmalari */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/scan"
                  className="w-full min-h-[52px] px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-extrabold text-base shadow-xl shadow-red-500/25 hover:opacity-95 transition flex items-center justify-center gap-2.5 group"
                >
                  <ScanBarcode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Skanerlashni boshlash</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <a
                  href="#how-it-works"
                  className="w-full min-h-[52px] px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 transition flex items-center justify-center shadow-sm"
                >
                  Qanday ishlaydi?
                </a>
              </motion.div>
            </div>

            {/* Kichik ishonch ko'rsatkichlari */}
            <div className="pt-3 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>O&apos;rnatish shart emas</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Bepul</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Tezkor natija</span>
              </span>
            </div>
          </motion.div>

          {/* O'ng tomon: 3D Animatsiyali Telefon Mockup (5 ustun) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* 2. "QANDAY ISHLAYDI?" BO'LIMI */}
      <section id="how-it-works" className="py-20 px-4 bg-white/70 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/60 px-3.5 py-1 rounded-full border border-red-200/60 dark:border-red-900">
              Oddiy va qulay
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
              3 ta oddiy qadamda narxni biling
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Hech qanday murakkabliksiz, bir necha soniyada aniq ma&apos;lumot oling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.4 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-red-500/5 relative transition-all group"
                >
                  <div className="text-3xl font-black font-price text-slate-200 dark:text-slate-800 group-hover:text-red-300 dark:group-hover:text-red-900 transition-colors absolute top-6 right-6">
                    {s.num}
                  </div>

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center mb-6 shadow-md shadow-red-500/20`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2.5">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. AFZALLIKLAR BO'LIMI */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-900">
            Nega aynan {BRAND_CONFIG.name}?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Xaridlaringiz endi ancha oson
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
                  {f.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. TIZIMGA KIRISH VA IMKONIYATLAR BANNERI (OPTOVIK Navy-Red uslubida) */}
      <section className="py-12 px-4 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-blue-900/50">
          {/* Bezak qizil va ko'k nurlar */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-600/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-700/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-red-400 text-xs font-bold border border-white/10">
              <LogIn className="w-3.5 h-3.5" />
              <span>Shaxsiy hisob</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Profilingizga kiring va barcha xaridlaringizni saqlang
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tizimga kirish orqali skanerlangan mahsulotlar tarixini doimo qo&apos;l ostingizda saqlashingiz, xarid savatini boshqarishingiz va xarajatlaringizni tahlil qilishingiz mumkin.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/scan"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
                >
                  <ScanBarcode className="w-4 h-4 text-red-400" />
                  <span>Skanerlash</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 pb-24 md:pb-12 text-slate-500 dark:text-slate-400 text-xs select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo iconSize={30} textSize="text-lg" isLink={true} />
            <p className="text-slate-400 dark:text-slate-500 text-xs text-center md:text-left">
              {BRAND_CONFIG.tagline} • O&apos;zbekistonda ishlab chiqilgan
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-700 dark:text-slate-300">
            <Link href="/scan" className="hover:text-red-600 transition">
              Skaner
            </Link>
            <Link href="/cart" className="hover:text-red-600 transition">
              Savat
            </Link>
            <Link href="/history" className="hover:text-red-600 transition">
              Tarix
            </Link>
            <Link href="/login" className="hover:text-red-600 transition">
              Kirish
            </Link>
          </div>

          <div className="text-center md:text-right text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>

      {/* Mobil pastki dock (BottomNav) */}
      <BottomNav />
    </div>
  );
}
