// src/components/ui/ThemeToggle.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-9 h-9 rounded-xl bg-slate-100 ${className}`} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 ${className}`}
      title={isDark ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
      aria-label="Mavzuni almashtirish"
    >
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 stroke-[2.2]" />
        ) : (
          <Moon className="w-5 h-5 text-blue-900 stroke-[2.2]" />
        )}
      </motion.div>
    </button>
  );
}

