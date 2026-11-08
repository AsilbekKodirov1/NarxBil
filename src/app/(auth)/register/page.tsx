// src/app/(auth)/register/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, UserCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND_CONFIG } from "@/config/brand";
import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toastError("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    if (password.length < 6) {
      toastError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    if (password !== confirmPassword) {
      toastError("Parollar bir-biriga mos kelmadi");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toastError(data.error || "Ro'yxatdan o'tishda xatolik yuz berdi");
        setIsLoading(false);
        return;
      }

      toastSuccess("Akkauntingiz yaratildi! Tizimga kirilmoqda...");

      // Avtomatik kirish
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      toastError("Server bilan aloqada xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#FAFAFF]">
      {/* Orqa fon bezakli gradient bloblari */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Yuqori logotip */}
        <div className="flex flex-col items-center mb-8">
          <Logo iconSize={36} textSize="text-2xl" isLink={true} />
          <p className="text-slate-500 text-sm mt-2 text-center font-medium">
            {BRAND_CONFIG.tagline}
          </p>
        </div>

        {/* Ro'yxatdan o'tish kartasi */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-red-500/10 rounded-3xl p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Ro&apos;yxatdan o&apos;tish
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Bepul hisob oching va xaridlaringizni nazorat qiling
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ism va familiya
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ali Valiyev"
                  required
                  className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email manzil
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@misol.uz"
                  required
                  className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Parol (kamida 6 belgi)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Parolni tasdiqlang
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ro&apos;yxatdan o&apos;tish</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Kirish havolasi */}
          <div className="mt-6 text-center text-sm text-slate-600 font-medium">
            Akkauntingiz bormi?{" "}
            <Link
              href="/login"
              className="text-red-600 hover:text-red-700 font-bold hover:underline"
            >
              Kirish
            </Link>
          </div>
        </div>

        {/* Mehmon rejimi */}
        <div className="mt-6 text-center">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition py-2 px-4 rounded-xl hover:bg-white/60"
          >
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Kirmasdan davom etish (Mehmon rejimi)</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

