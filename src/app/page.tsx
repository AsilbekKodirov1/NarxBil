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
      color: "from-purple-500 to-indigo-600",
    },
    {
      num: "02",
      title: "Narxni darhol ko'ring",
      desc: "Do'kondagi eng so'nggi aniq narx, chegirmalar va tovar to'liq ma'lumoti 1 soniyada ekranda paydo bo'ladi.",
      icon: Zap,
      color: "from-pink-500 to-rose-600",
    },
    {
      num: "03",
      title: "Byudjetingizni nazorat qiling",
      desc: "Xarid savatingizga qo'shib boring va kassaga bormasdanoq umumiy summani doimo aniq bilib turing.",
      icon: ShoppingBag,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const features = [
    {
      title: "Vaqtingizni tejang",
      desc: "Narxi yozilmagan tovarlar uchun kassirni qidirish yoki kassada navbat kutishga vaqt sarflamaysiz.",
      icon: Clock,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Aniq va shaffof narxlar",
      desc: "Kassada to'lash paytida kutilmagan noxush narxlardan va ortiqcha xarajatlardan o'zingizni asraysiz.",
      icon: ShieldCheck,
      color: "text-pink-600 bg-pink-50",
    },
    {
      title: "Aksiyalar va chegirmalar",
      desc: "Chegirmali mahsulotlarni darhol bilib olasiz — eski narx va qancha tejalayotgani yaqqol ko'rinadi.",
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "PWA — Telefoningizga o'rnatiladi",
      desc: "Xuddi oddiy mobil ilova kabi telefon ekraniga o'rnatiladi va internet sekin bo'lganda ham ishlayveradi.",
      icon: Smartphone,
      color: "text-cyan-600 bg-cyan-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex flex-col relative overflow-hidden">
      <Navbar />
      <PwaManager />

      {/* Orqa fon bezakli gradient bloblari */}
      <div className="absolute top-12 left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/15 blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-400/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-[450px] h-[450px] rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      {/* 1. HERO BO'LIMI */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Matnli qism (7 ustun) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Kichik tepki nishon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Smart Supermarket Yordamchisi</span>
            </div>

            {/* Asosiy Sarlavha */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Kassaga bormasdan{" "}
              <span className={BRAND_CONFIG.colors.gradientText}>
                narxni biling
              </span>
            </h1>

            {/* Tavsif matni */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              {BRAND_CONFIG.description} Do&apos;kondagi xaridlaringizni osonlashtiring, vaqtingizni va pulingizni tejang!
            </p>

            {/* Asosiy harakat tugmalari */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="/scan"
                className="w-full sm:w-auto min-h-[52px] px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-purple-500/30 hover:opacity-95 active:scale-95 transition flex items-center justify-center gap-2.5 group"
              >
                <ScanBarcode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Skanerlashni boshlash</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto min-h-[52px] px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
              >
                Qanday ishlaydi?
              </a>
            </div>

            {/* Kichik ishonch ko'rsatkichlari */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
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
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* 2. "QANDAY ISHLAYDI?" BO'LIMI */}
      <section id="how-it-works" className="py-20 px-4 bg-white/70 border-y border-slate-200/60 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/50">
              Oddiy va qulay
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              3 ta oddiy qadamda narxni biling
            </h2>
            <p className="text-sm text-slate-500 mt-2">
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
                  transition={{ delay: idx * 0.15 }}
                  className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg shadow-purple-500/5 relative hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div className="text-3xl font-black font-price text-slate-200 group-hover:text-purple-300 transition-colors absolute top-6 right-6">
                    {s.num}
                  </div>

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center mb-6 shadow-md shadow-purple-500/20`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2.5">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
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
          <span className="text-xs font-extrabold uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200/50">
            Nega aynan {BRAND_CONFIG.name}?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
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
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-2">
                  {f.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. TIZIMGA KIRISH VA IMKONIYATLAR BANNERI */}
      <section className="py-12 px-4 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Bezak nurlar */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-cyan-300 text-xs font-bold">
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
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-purple-900 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition"
              >
                <LogIn className="w-4 h-4 text-purple-700" />
                <span>Kirish</span>
                <ArrowRight className="w-4 h-4 text-purple-700" />
              </Link>
              <Link
                href="/scan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
              >
                <ScanBarcode className="w-4 h-4 text-cyan-300" />
                <span>Skanerlash</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-12 px-4 pb-24 md:pb-12 text-slate-500 text-xs select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo iconSize={26} textSize="text-lg" isLink={true} />
            <p className="text-slate-400 text-xs text-center md:text-left">
              {BRAND_CONFIG.tagline} • O&apos;zbekistonda ishlab chiqilgan
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-600">
            <Link href="/scan" className="hover:text-purple-600 transition">
              Skaner
            </Link>
            <Link href="/cart" className="hover:text-purple-600 transition">
              Savat
            </Link>
            <Link href="/history" className="hover:text-purple-600 transition">
              Tarix
            </Link>
            <Link href="/login" className="hover:text-purple-600 transition">
              Kirish
            </Link>
          </div>

          <div className="text-center md:text-right text-slate-400">
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>

      {/* Mobil pastki dock (BottomNav) */}
      <BottomNav />
    </div>
  );
}
