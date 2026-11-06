// src/components/cart/BudgetController.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  X, 
  TrendingUp, 
  TrendingDown,
  Sparkles
} from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

interface BudgetControllerProps {
  currentTotal: number;
}

const STORAGE_KEY = "narxbil_shopping_budget";
const PRESETS = [100000, 250000, 500000, 1000000];

export function BudgetController({ currentTotal }: BudgetControllerProps) {
  const [budget, setBudget] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Saqlangan byudjetni yuklash
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          setBudget(parsed);
          setInputValue(parsed.toString());
        }
      }
    } catch {}
  }, []);

  const saveBudget = (amount: number | null) => {
    setBudget(amount);
    setIsEditing(false);
    try {
      if (amount && amount > 0) {
        localStorage.setItem(STORAGE_KEY, amount.toString());
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = parseInt(inputValue.replace(/\D/g, ""), 10);
    if (!isNaN(cleanNum) && cleanNum > 0) {
      saveBudget(cleanNum);
    } else {
      saveBudget(null);
    }
  };

  // Agar byudjet belgilanmagan bo'lsa
  if (!budget && !isEditing) {
    return (
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-200/70 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Byudjet nazorati</h4>
              <p className="text-[11px] text-slate-500">Xaridingiz uchun limit belgilang</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Limit qo&apos;yish</span>
          </button>
        </div>
      </div>
    );
  }

  // Byudjetni tahrirlash oynasi
  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-purple-200 p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Wallet className="w-4 h-4 text-purple-600" />
            <span>Xarid byudjetini belgilang</span>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tezkor tugmalar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => saveBudget(p)}
              className="py-1.5 px-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 transition font-price"
            >
              {p >= 1000000 ? `${p / 1000000} mln` : `${p / 1000} ming`}
            </button>
          ))}
        </div>

        {/* Ixtiyoriy summa kiritish */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="number"
            min="1000"
            step="1000"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Masalan: 350000"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 font-price font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
          >
            Saqlash
          </button>
          {budget && (
            <button
              type="button"
              onClick={() => saveBudget(null)}
              className="px-2.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold"
              title="Byudjetni olib tashlash"
            >
              Bekor qilish
            </button>
          )}
        </form>
      </div>
    );
  }

  // Byudjet hisob-kitobi
  const percentage = Math.min(Math.round((currentTotal / (budget || 1)) * 100), 100);
  const isOver = currentTotal > (budget || 0);
  const diff = Math.abs((budget || 0) - currentTotal);

  let statusColor = "bg-emerald-500";
  let statusBg = "bg-emerald-50 border-emerald-200/70 text-emerald-800";
  if (percentage >= 75 && percentage < 100) {
    statusColor = "bg-amber-500";
    statusBg = "bg-amber-50 border-amber-200/70 text-amber-800";
  } else if (isOver) {
    statusColor = "bg-rose-500";
    statusBg = "bg-rose-50 border-rose-200/70 text-rose-800";
  }

  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition-all ${statusBg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Byudjet: {BRAND_CONFIG.currency.format(budget || 0)}
          </span>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="text-xs font-semibold opacity-75 hover:opacity-100 flex items-center gap-1 transition"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>O&apos;zgartirish</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden mb-2 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${statusColor} rounded-full`}
        />
      </div>

      {/* Holat xabari */}
      <div className="flex items-center justify-between text-xs font-bold">
        {isOver ? (
          <div className="flex items-center gap-1.5 text-rose-700">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Limitdan oshdi: +{BRAND_CONFIG.currency.format(diff)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Qolgan byudjet: {BRAND_CONFIG.currency.format(diff)}</span>
          </div>
        )}

        <span className="font-price font-extrabold">{percentage}%</span>
      </div>
    </div>
  );
}

