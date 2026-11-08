// src/components/cart/AiAssistantModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  UtensilsCrossed, 
  PiggyBank, 
  Send, 
  X, 
  Loader2 
} from "lucide-react";
import { CartItem } from "@/lib/cart";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  budget?: number | null;
}

export function AiAssistantModal({
  isOpen,
  onClose,
  items,
  budget,
}: AiAssistantModalProps) {
  const [activeTab, setActiveTab] = useState<"recipe" | "budget_advice" | "custom">("recipe");
  const [customQuestion, setCustomQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const fetchAdvice = async (type: "recipe" | "budget_advice" | "custom", prompt?: string) => {
    setIsLoading(true);
    setResponse(null);
    setActiveTab(type);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          items: items.map((i) => ({
            name: i.name,
            category: i.category,
            price: i.price,
            quantity: i.quantity,
          })),
          budget,
          prompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setResponse(data.text);
      } else {
        setResponse("Kechirasiz, ma'lumot olishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
      }
    } catch {
      setResponse("Internet yoki server bilan aloqada xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isLoading) return;
    fetchAdvice("custom", customQuestion);
  };

  // Modal ochilganda avtomatik retsept so'rash
  React.useEffect(() => {
    if (isOpen && !response && !isLoading) {
      fetchAdvice("recipe");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Orqa fon qorayishi */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal kartasi */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[8%] sm:top-[12%] max-w-lg mx-auto bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-100 flex flex-col max-h-[82vh]"
          >
            {/* Modal sarlavhasi (OPTOVIK Red-Navy) */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-base tracking-tight">AI Maslahatchi</h3>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-white text-red-600">
                      Smart
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80">
                    Savatdagi {items.length} ta mahsulot bo&apos;yicha maslahatlar
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tezkor mavzular (Action Pills) */}
            <div className="p-3 bg-slate-50 border-b border-slate-200/60 flex items-center gap-2 overflow-x-auto select-none no-scrollbar">
              <button
                onClick={() => fetchAdvice("recipe")}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 ${
                  activeTab === "recipe"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Retsept tavsiyasi</span>
              </button>

              <button
                onClick={() => fetchAdvice("budget_advice")}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 ${
                  activeTab === "budget_advice"
                    ? "bg-blue-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <PiggyBank className="w-3.5 h-3.5" />
                <span>Tejamkorlik tahlili</span>
              </button>
            </div>

            {/* Javob maydoni */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3 animate-spin">
                    <Loader2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 mb-1">
                    AI savatingizni tahlil qilmoqda...
                  </h4>
                  <p className="text-xs text-slate-400">
                    Oshpazlik va tejamkorlik maslahatlari tayyorlanmoqda
                  </p>
                </div>
              ) : response ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 shadow-sm"
                >
                  {response}
                </motion.div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Yuqoridagi mavzulardan birini tanlang yoki savol bering.
                </div>
              )}
            </div>

            {/* Savol yozish maydoni (Bottom Input) */}
            <div className="p-3 bg-white border-t border-slate-100">
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Xarid bo'yicha savolingizni yozing..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                />
                <button
                  type="submit"
                  disabled={!customQuestion.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-blue-900 hover:opacity-90 text-white transition disabled:opacity-50"
                  title="Yuborish"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

