// src/components/pwa/PwaManager.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Sparkles } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Service Worker ni ro'yxatdan o'tkazish
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW muvaffaqiyatli ro'yxatdan o'tdi:", reg.scope))
        .catch((err) => console.warn("SW xatosi:", err));
    }

    // 2. PWA o'rnatish hodisasini tinglash
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Foydalanuvchiga 3 soniyadan keyin taklif qilish
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setShowPrompt(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate">
                {BRAND_CONFIG.name} ilovasini o&apos;rnating
              </h4>
              <p className="text-[11px] text-slate-300 truncate">
                Ekranga qo&apos;shing va tezroq skanerlang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
            >
              O&apos;rnatish
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white transition"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

