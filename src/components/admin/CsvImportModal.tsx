// src/components/admin/CsvImportModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileSpreadsheet, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CsvImportModal({
  isOpen,
  onClose,
  onSuccess,
}: CsvImportModalProps) {
  const { success: toastSuccess, error: toastError } = useToast();

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    importedCount: number;
    errorCount: number;
    errors: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!csvFile && !csvText.trim()) {
      toastError("Iltimos, CSV fayl tanlang yoki matn kiriting");
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData();
    if (csvFile) {
      formData.append("file", csvFile);
    } else {
      formData.append("csvText", csvText);
    }

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          importedCount: data.importedCount,
          errorCount: data.errorCount,
          errors: data.errors || [],
        });
        toastSuccess(`${data.importedCount} ta tovar muvaffaqiyatli import qilindi!`);
        onSuccess();
      } else {
        toastError(data.error || "Import qilishda xatolik yuz berdi");
      }
    } catch {
      toastError("Server bilan aloqada xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCsvFile(null);
    setCsvText("");
    setResult(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-[8%] max-w-lg mx-auto bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2 font-extrabold text-slate-900">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>CSV orqali tovarlarni ommaviy yuklash</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Namunaviy format ko'rsatmasi */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
                <p className="font-bold text-slate-700 mb-1">
                  Format ustunlari (vergul yoki nuqta-vergul bilan):
                </p>
                <code className="block bg-white p-2 rounded-lg text-slate-800 font-mono text-[11px] border border-slate-200">
                  nom,shtrix,narx,chegirma,kategoriya<br />
                  Musaffo Sut 1L,4780000150123,13500,11900,Sut<br />
                  Buxanka Non,4780023456789,3500,,Non
                </code>
              </div>

              {/* Natijalar ko'rinishi */}
              {result && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Natija: {result.importedCount} ta tovar qo&apos;shildi / yangilandi</span>
                  </div>

                  {result.errorCount > 0 && (
                    <div className="text-xs text-rose-700 font-medium">
                      {result.errorCount} ta qatorda xatolik aniqlandi:
                      <ul className="list-disc list-inside mt-1 text-[11px] text-rose-600 space-y-0.5 max-h-24 overflow-y-auto">
                        {result.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Fayl yuklash */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    CSV faylni tanlang:
                  </label>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => {
                      setCsvFile(e.target.files?.[0] || null);
                      setResult(null);
                    }}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">
                    yoki matnni to&apos;g&apos;ridan-to&apos;g&apos;ri qo&apos;ying
                  </span>
                </div>

                {/* Matn maydoni */}
                <div>
                  <textarea
                    rows={4}
                    value={csvText}
                    onChange={(e) => {
                      setCsvText(e.target.value);
                      setResult(null);
                    }}
                    placeholder="nom,shtrix,narx,kategoriya&#10;Qandolat Non,4780023456789,3500,Non"
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                  >
                    Yopish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!csvFile && !csvText.trim())}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>Import qilish</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

