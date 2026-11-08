// src/app/(auth)/login/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, UserCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND_CONFIG } from "@/config/brand";
import { useToast } from "@/components/ui/Toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { error: toastError, success: toastSuccess } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/google-status")
      .then((res) => res.json())
      .then((data) => setGoogleAvailable(data.enabled))
      .catch(() => setGoogleAvailable(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toastError("Iltimos, email va parolni to'ldiring");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toastError(res.error);
      } else {
        toastSuccess("Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.");
        
        // Agar admin bo'lsa, to'g'ridan-to'g'ri admin panelga yo'naltirish
        try {
          const sessionRes = await fetch("/api/auth/session");
          const sessionData = await sessionRes.json();
          if (sessionData?.user?.role === "ADMIN") {
            router.push("/admin");
            router.refresh();
            return;
          }
        } catch {
          // Xato bo'lsa standart callbackUrl ga yo'naltirish
        }

        router.push(callbackUrl === "/admin" ? "/" : callbackUrl);
        router.refresh();
      }
    } catch {
      toastError("Kutilmagan xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!googleAvailable) {
      toastError("Google OAuth hozirda sozlanmagan. Iltimos, email va parol orqali kiring.");
      return;
    }
    signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Yuqori logotip */}
      <div className="flex flex-col items-center mb-8">
        <Logo iconSize={36} textSize="text-2xl" isLink={true} />
        <p className="text-slate-500 text-sm mt-2 text-center font-medium">
          {BRAND_CONFIG.tagline}
        </p>
      </div>

      {/* Kirish kartasi (Glassmorphism) */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-red-500/10 rounded-3xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Tizimga kirish
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Skanerlash tarixi va savatingizni saqlash uchun kiring
          </p>
        </div>

        {/* Google bilan kirish tugmasi */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleAvailable === false}
            className={`w-full min-h-[48px] px-4 py-3 rounded-2xl border flex items-center justify-center gap-3 font-semibold text-sm transition-all duration-200 ${
              googleAvailable === false
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-75"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.98]"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {googleAvailable === false
                ? "Google bilan kirish (Tez orada)"
                : "Google bilan davom etish"}
            </span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-slate-400 font-semibold absolute">
            yoki email bilan
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="admin@narxbil.uz"
                required
                className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Parol
              </label>
            </div>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[48px] mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Kirish</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Ro'yxatdan o'tish havolasi */}
        <div className="mt-6 text-center text-sm text-slate-600 font-medium">
          Akkauntingiz yo&apos;qmi?{" "}
          <Link
            href="/register"
            className="text-red-600 hover:text-red-700 font-bold hover:underline"
          >
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>
      </div>

      {/* Mehmon rejimi tugmasi */}
      <div className="mt-6 text-center">
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition py-2 px-4 rounded-xl hover:bg-white/60"
        >
          <UserCheck className="w-4 h-4 text-emerald-500" />
          <span>Kirmasdan davom etish (Mehmon rejimi)</span>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F19]">
      {/* Orqa fon bezakli gradient bloblari */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-red-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-900/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex justify-center"
      >
        <Suspense fallback={<div className="p-8 text-center text-slate-400">Yuklanmoqda...</div>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
