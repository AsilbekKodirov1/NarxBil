// src/app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ScanBarcode, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  ShoppingBag, 
  Smartphone, 
  CheckCircle2, 
  Receipt,
  Store,
  Tag,
  Percent
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
      desc: "Kamerangizni tovar qadog'idagi shtrix kodga to'g'rilang yoki shtrix kod raqamlarini qo'lda yozing. Ilova o'rnatish shart emas.",
      icon: ScanBarcode,
      accent: "bg-red-600 text-white",
      tag: "1 soniyada",
    },
    {
      num: "02",
      title: "Haqiqiy narxni ko'ring",
      desc: "Supermarket kassa bazasidagi eng so'nggi narx, aksiya va chegirmalar foizi bilan darhol ko'rinadi.",
      icon: Tag,
      accent: "bg-blue-950 text-white dark:bg-slate-800",
      tag: "Aniq va shaffof",
    },
    {
      num: "03",
      title: "Savat va Kassa Cheki",
      desc: "Xaridlaringizni qo'shib boring, jami hisobni kuzating va kassada to'lash uchun bitta tayyor kassa kodini oling.",
      icon: Receipt,
      accent: "bg-red-700 text-white",
      tag: "Navbatsiz",
    },
  ];

  const features = [
    {
      title: "Kassada kutilmagan narxlar bo'lmaydi",
      desc: "Vitrinada boshqa, kassada boshqa narx chiqishidan asraydi. To'lovdan oldin hamma narsani aniq bilasiz.",
      icon: ShieldCheck,
      badge: "Kafolatlangan aniqlik",
    },
    {
      title: "Kassirni qidirib vaqt yo'qotmaysiz",
      desc: "Narxi yozilmagan tovarlar uchun zal bo'ylab narx tekshirgich qidirish yoki kassaga yugurish shart emas.",
      icon: Clock,
      badge: "Vaqtni tejash",
    },
    {
      title: "Aksiya va chegirmalar hisobi",
      desc: "Chegirma foizi, eski narx va qancha mablag' tejalayotgani har bir tovar kartasida yaqqol ko'rinadi.",
      icon: Percent,
      badge: "Tejamkor xarid",
    },
    {
      title: "PWA — Telefoningizda tez ishlaydi",
      desc: "Saytni to'g'ridan-to'g'ri telefoningiz bosh ekraniga saqlab, internet sust bo'lganda ham xotirjam ishlata olasiz.",
      icon: Smartphone,
      badge: "Zamonaviy PWA",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      <Navbar />
      <PwaManager />

      {/* Fon to'ri (Subtle Architectural Matrix Grid - No AI Slop) */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-70" />

      {/* 1. HERO BO'LIMI */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 px-4 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Matnli qism (7 ustun) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left z-10"
          >
            {/* Real Retail Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="tracking-wide">OPTOVIK.UZ • Jonli Supermarket Tizimi</span>
            </div>

            {/* Asosiy Sarlavha (High Contrast, Bold, Editorial) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.12]">
              Kassaga bormasdan <br className="hidden sm:inline" />
              <span className="text-red-600 dark:text-red-500 underline decoration-red-500/30 decoration-wavy decoration-2">
                narxni aniq biling
              </span>
            </h1>

            {/* Tavsif matni */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Telefoningiz kamerasini tovar shtrix kodiga qarating. Do&apos;kondagi haqiqiy narx, chegirmalar va tovar ma&apos;lumotlari 1 soniyada ekranda paydo bo&apos;ladi.
            </p>

            {/* 3D Taktil Harakat Tugmalari */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/scan"
                className="w-full sm:w-auto min-h-[54px] px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-base shadow-[0_6px_0_#991B1B] hover:shadow-[0_4px_0_#991B1B] active:shadow-none hover:translate-y-0.5 active:translate-y-1.5 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <ScanBarcode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Kamerani yoqish & Skanerlash</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/cart"
                className="w-full sm:w-auto min-h-[54px] px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-[0_4px_0_#CBD5E1] dark:shadow-[0_4px_0_#1E293B] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-red-600" />
                <span>Xarid Savatini ko&apos;rish</span>
              </Link>
            </div>

            {/* Haqiqiy Foyda Ko'rsatkichlari */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ilova o&apos;rnatish shart emas</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Qo&apos;l skaner apparatlariga mos</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Bepul xizmat</span>
              </span>
            </div>
          </motion.div>

          {/* O'ng tomon: Interaktiv 3D Telefon Qurilmasi (5 ustun) */}
          <div className="lg:col-span-5 flex justify-center relative z-20">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* 2. "QANDAY ISHLAYDI?" — 3D TAKTIL KARTALAR */}
      <section id="how-it-works" className="py-20 px-4 bg-white dark:bg-[#0B0F19] border-y border-slate-200/80 dark:border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/60 px-3.5 py-1.5 rounded-full border border-red-200 dark:border-red-900">
              Oddiy va amaliy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
              3 ta oson qadamda xarid qiling
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Hech qanday ro&apos;yxatdan o&apos;tmasdan, telefoningizda darhol ishlata olasiz.
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
                  transition={{ delay: idx * 0.12, duration: 0.4 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-[#FAFAFC] dark:bg-slate-900/90 p-8 rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] relative transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${s.accent} flex items-center justify-center shadow-md`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-3xl font-black font-price text-slate-300 dark:text-slate-700">
                        {s.num}
                      </span>
                    </div>

                    <span className="inline-block px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                      {s.tag}
                    </span>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2.5">
                      {s.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SUPERMARKET AFZALLIKLARI */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900">
            Nega aynan OPTOVIK.UZ?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
            Har bir xaridingizda vaqt va pulni tejang
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-start gap-5 transition-shadow hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 border border-red-200/60 dark:border-red-900/50">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 block mb-1">
                    {f.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. CTA BANNER (Real Retail Kiosk Card) */}
      <section className="py-12 px-4 max-w-6xl mx-auto w-full mb-12">
        <div className="relative rounded-[36px] bg-[#0E1526] text-white p-8 sm:p-12 md:p-16 overflow-hidden border-2 border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold mb-4">
              <Store className="w-3.5 h-3.5" />
              <span>Supermarketda sinab ko&apos;ring</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              Kassadagi navbatlar va narx noaniqligiga chek qo&apos;ying
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed font-medium">
              Hoziroq kamerangizni yoqing va har qanday mahsulot shtrix kodini skanerlang.
            </p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-base shadow-[0_6px_0_#991B1B] hover:shadow-[0_4px_0_#991B1B] active:shadow-none hover:translate-y-0.5 active:translate-y-1.5 transition-all cursor-pointer"
            >
              <ScanBarcode className="w-5 h-5" />
              <span>Skanerlashni boshlash</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 px-4 pb-24 md:pb-10 text-slate-500 dark:text-slate-400 text-xs select-none">
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
            <Link href="/admin" className="hover:text-red-600 transition">
              Admin
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
