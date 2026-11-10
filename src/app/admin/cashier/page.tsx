// src/app/admin/cashier/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Receipt, 
  ScanBarcode, 
  Search, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  AlertCircle, 
  RefreshCw, 
  Loader2,
  Printer,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Camera,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminBarcodeScannerModal } from "@/components/admin/AdminBarcodeScannerModal";
import { BRAND_CONFIG } from "@/config/brand";
import { OrderRecord } from "@/lib/ordersStore";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function AdminCashierPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();

  const [scanInput, setScanInput] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Authenticate Admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin/cashier");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load recent orders
  const fetchRecentOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setRecentOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchRecentOrders();
      // Auto-focus barcode input
      barcodeInputRef.current?.focus();
    }
  }, [status, session]);

  const handleLookupOrder = async (codeToSearch: string) => {
    const code = codeToSearch.trim().toUpperCase();
    if (!code) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(code)}`);
      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setCurrentOrder(data.order);
        setScanInput("");
      } else {
        setErrorMessage(data.message || "Ushbu kassa kodi bo'yicha buyurtma topilmadi");
        setCurrentOrder(null);
      }
    } catch {
      setErrorMessage("Server bilan bog'lanishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
      setTimeout(() => barcodeInputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanInput.trim()) {
      handleLookupOrder(scanInput);
    }
  };

  const handleProcessPayment = async (paymentMethod: "CASH" | "CARD") => {
    if (!currentOrder) return;

    setIsPaying(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(currentOrder.orderCode)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pay", paymentMethod }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentOrder(data.order);
        setSuccessMessage(`To'lov muvaffaqiyatli qabul qilindi! (${paymentMethod === "CASH" ? "Naqd pul" : "Plastik karta"})`);
        
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}

        fetchRecentOrders();
      } else {
        setErrorMessage(data.message || "To'lovni tasdiqlashda xatolik");
      }
    } catch {
      setErrorMessage("To'lovni amalga oshirishda server xatosi");
    } finally {
      setIsPaying(false);
      setTimeout(() => barcodeInputRef.current?.focus(), 100);
    }
  };

  const handleResetForNextCustomer = () => {
    setCurrentOrder(null);
    setScanInput("");
    setErrorMessage(null);
    setSuccessMessage(null);
    fetchRecentOrders();
    setTimeout(() => barcodeInputRef.current?.focus(), 100);
  };

  const handleCreateDemoOrder = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const demoCode = `OPT-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: demoCode,
          items: [
            {
              id: "demo-1",
              name: "Musaffo Sut 3.2% 1L",
              barcode: "4780000150123",
              price: 13500,
              discountPrice: 11900,
              quantity: 2,
              category: "Sut mahsulotlari",
            },
            {
              id: "demo-2",
              name: "Coca-Cola Classic 1.5L",
              barcode: "5449000000996",
              price: 16000,
              discountPrice: 14500,
              quantity: 1,
              category: "Ichimliklar",
            },
            {
              id: "demo-3",
              name: "KitKat Shokolad 40g",
              barcode: "7613035368545",
              price: 8200,
              discountPrice: null,
              quantity: 3,
              category: "Shirinliklar",
            },
          ],
          totalSum: 62900,
          totalSavings: 4700,
          totalItems: 6,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`Demo buyurtma #${demoCode} yaratildi va kassa ekraniga yuklandi!`);
        setCurrentOrder(data.order);
        fetchRecentOrders();
      }
    } catch {
      setErrorMessage("Demo buyurtma yaratishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FAFAFF] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] flex text-slate-900 dark:text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Yuqori Sarlavha & Kassa Holati */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <Receipt className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {t.cashier.title}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t.cashier.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{t.cashier.scannerReady}</span>
            </div>
            <button
              onClick={fetchRecentOrders}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Ro'yxatni yangilash"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. SKANER / INPUT BLOKI */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-red-500/30 p-5 sm:p-6 shadow-xl mb-6">
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-600" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder={t.cashier.placeholder}
                  className="w-full pl-13 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 focus:border-red-600 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-lg outline-none transition placeholder:text-slate-400"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="flex-1 sm:flex-initial px-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 hover:from-red-700 hover:to-blue-950 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Camera className="w-5 h-5 text-white animate-pulse" />
                  <span>{t.cashier.cameraScanBtn}</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !scanInput.trim()}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 disabled:opacity-50 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{t.cashier.openCart}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Kassa apparatingiz bo&apos;lmasa, <b>&quot;{t.cashier.cameraScanBtn}&quot;</b> tugmasi orqali telefoningizda mijoz kodini o&apos;qita olasiz.</span>
              </span>

              <button
                type="button"
                onClick={handleCreateDemoOrder}
                className="text-red-600 dark:text-red-400 hover:underline font-bold flex items-center gap-1 cursor-pointer bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-xl border border-red-200/50 dark:border-red-900"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>{t.cashier.demoOrderBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Xabarlar */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-3 text-sm font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 2. AKTIV BUYURTMA KARTASI */}
        {currentOrder ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-8">
            {/* Buyurtma Bosh qismi */}
            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-black text-red-600 dark:text-red-400 tracking-wider">
                    #{currentOrder.orderCode}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      currentOrder.status === "PAID"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 animate-pulse"
                    }`}
                  >
                    {currentOrder.status === "PAID" ? "TO'LANGAN" : "KUTILMOQDA (PENDING)"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Yaratilgan vaqti: {new Date(currentOrder.createdAt).toLocaleTimeString("uz-UZ")} • Jami: {currentOrder.totalItems} ta tovar
                </p>
              </div>

              {currentOrder.status === "PAID" && (
                <button
                  onClick={handleResetForNextCustomer}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{t.cashier.nextCustomer}</span>
                </button>
              )}
            </div>

            {/* Mahsulotlar Jadvali */}
            <div className="p-5 sm:p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                {t.cashier.productsList}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs uppercase font-bold">
                      <th className="pb-3">{t.cashier.productCol}</th>
                      <th className="pb-3">{t.cashier.barcodeCol}</th>
                      <th className="pb-3 text-center">{t.cashier.quantityCol}</th>
                      <th className="pb-3 text-right">{t.cashier.priceCol}</th>
                      <th className="pb-3 text-right">{t.cashier.totalCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentOrder.items.map((item, idx) => {
                      const activePrice = item.discountPrice ?? item.price;
                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3 font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="py-3 font-mono text-xs text-slate-500">
                            {item.barcode}
                          </td>
                          <td className="py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-right font-price text-slate-600 dark:text-slate-400">
                            {BRAND_CONFIG.currency.format(activePrice)}
                          </td>
                          <td className="py-3 text-right font-price font-extrabold text-slate-900 dark:text-white">
                            {BRAND_CONFIG.currency.format(activePrice * item.quantity)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* To'lov Xulosasi & Tugmalar */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  {currentOrder.totalSavings > 0 && (
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      {t.cart.savings} -{BRAND_CONFIG.currency.format(currentOrder.totalSavings)}
                    </div>
                  )}
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                    {t.cashier.totalAmount}
                  </div>
                  <div className="text-3xl sm:text-4xl font-price font-black text-red-600 dark:text-red-400">
                    {BRAND_CONFIG.currency.format(currentOrder.totalSum)}
                  </div>
                </div>

                {currentOrder.status !== "PAID" ? (
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <button
                      type="button"
                      disabled={isPaying}
                      onClick={() => handleProcessPayment("CASH")}
                      className="flex-1 md:flex-initial px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Banknote className="w-5 h-5" />
                      <span>{t.cashier.payCash}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPaying}
                      onClick={() => handleProcessPayment("CARD")}
                      className="flex-1 md:flex-initial px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>{t.cashier.payCard}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{t.cashier.printReceipt}</span>
                    </button>
                    <button
                      onClick={handleResetForNextCustomer}
                      className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-500/30 transition flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.cashier.nextCustomer}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Bo'sh kassa holati */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center mb-8">
            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Kassir kutish rejimida
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Xaridor telefonidagi shtrix-kodni skanerlaganingizda, butun savat tafsilotlari darhol shu yerda aks etadi.
            </p>
          </div>
        )}

        {/* 3. SO'NGGI BUYURTMALAR RO'YXATI */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Oxirgi Buyurtmalar (Kassa navbati)
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {recentOrders.length} ta buyurtma
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Hozircha faol buyurtmalar yo&apos;q
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentOrders.map((ord) => (
                <div
                  key={ord.orderCode}
                  onClick={() => handleLookupOrder(ord.orderCode)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    currentOrder?.orderCode === ord.orderCode
                      ? "border-red-600 bg-red-50/50 dark:bg-red-950/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      #{ord.orderCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === "PAID"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      }`}
                    >
                      {ord.status === "PAID" ? "To'langan" : "Kutilmoqda"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">{ord.totalItems} ta tovar</span>
                    <span className="font-price font-extrabold text-red-600 dark:text-red-400">
                      {BRAND_CONFIG.currency.format(ord.totalSum)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Telefon kamerasi orqali shtrix-kod skanerlash modali */}
      <AdminBarcodeScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onDetected={(detectedCode) => {
          setIsCameraOpen(false);
          handleLookupOrder(detectedCode);
        }}
      />
    </div>
  );
}

