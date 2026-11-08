// src/components/admin/ProductFormDialog.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  ScanBarcode,
  Check,
  Tag,
  Loader2
} from "lucide-react";
import { AdminBarcodeScannerModal } from "./AdminBarcodeScannerModal";
import { useToast } from "@/components/ui/Toast";

export interface ProductFormData {
  id?: string;
  name: string;
  barcode: string;
  price: number;
  discountPrice?: number | null;
  category?: string | null;
  imageUrl?: string | null;
}

interface ProductFormDialogProps {
  isOpen: boolean;
  productToEdit?: ProductFormData | null;
  onClose: () => void;
  onSuccess: () => void;
}

function ProductFormModalInner({
  productToEdit,
  onClose,
  onSuccess,
}: {
  productToEdit?: ProductFormData | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { success: toastSuccess, error: toastError } = useToast();

  const [name, setName] = useState(productToEdit?.name || "");
  const [barcode, setBarcode] = useState(productToEdit?.barcode || "");
  const [price, setPrice] = useState(productToEdit?.price ? String(productToEdit.price) : "");
  const [discountPrice, setDiscountPrice] = useState(
    productToEdit?.discountPrice ? String(productToEdit.discountPrice) : ""
  );
  const [category, setCategory] = useState(productToEdit?.category || "");
  const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || "");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Rasm yuklash (Drag & drop yoki tanlash)
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toastError("Rasm hajmi 3 MB dan oshmasligi kerak");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        setImageUrl(data.url);
        toastSuccess("Rasm muvaffaqiyatli yuklandi");
      } else {
        toastError(data.error || "Rasm yuklashda xatolik yuz berdi");
      }
    } catch {
      toastError("Server bilan aloqa uzildi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !barcode.trim() || !price) {
      toastError("Iltimos, nom, shtrix kod va narxni to'ldiring");
      return;
    }

    const numPrice = parseInt(price, 10);
    const numDiscount = discountPrice ? parseInt(discountPrice, 10) : null;

    if (numDiscount !== null && numDiscount >= numPrice) {
      toastError("Chegirma narxi asosiy narxdan arzon bo'lishi kerak");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      barcode: barcode.trim(),
      price: numPrice,
      discountPrice: numDiscount,
      category: category.trim() || null,
      imageUrl: imageUrl.trim() || null,
    };

    try {
      const isEditing = Boolean(productToEdit?.id);
      const url = isEditing
        ? `/api/admin/products/${productToEdit!.id}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toastSuccess(
          isEditing
            ? "Mahsulot muvaffaqiyatli yangilandi!"
            : "Yangi mahsulot qo'shildi!"
        );
        onSuccess();
        onClose();
      } else {
        toastError(data.error || "Saqlashda xatolik yuz berdi");
      }
    } catch {
      toastError("Server bilan aloqada xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-x-4 top-[5%] max-w-xl mx-auto bg-white rounded-3xl shadow-2xl z-40 overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Modal sarlavhasi */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900">
            {productToEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form tarkibi */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* 1. Rasm yuklash (Drag & drop) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mahsulot rasmi (ixtiyoriy)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Tag className="w-6 h-6 text-slate-300" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold cursor-pointer transition border border-red-200/50">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? "Yuklanmoqda..." : "Rasm tanlash"}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  JPG, PNG, WEBP (maksimal 3 MB)
                </p>
              </div>
            </div>
          </div>
          {/* 2. Mahsulot nomi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mahsulot nomi *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Musaffo Sut 3.2% 1L"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium"
            />
          </div>

          {/* 3. Shtrix kod + Kameradan o'qish tugmasi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Shtrix kod *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value.replace(/[^0-9A-Za-z]/g, ""))}
                placeholder="4780000150123"
                required
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-semibold"
              />
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-3 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/50 text-xs font-bold transition flex items-center gap-1.5"
                title="Kamera bilan skanerlash"
              >
                <ScanBarcode className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline">Skanerlash</span>
              </button>
            </div>
          </div>

          {/* 4. Narx va Chegirma narxi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Narxi (so&apos;mda) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="13500"
                required
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-price font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chegirma narxi (so&apos;mda)
              </label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="11900 (ixtiyoriy)"
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-price font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              />
            </div>
          </div>

          {/* 5. Kategoriya */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kategoriya (ixtiyoriy)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Masalan: Sut mahsulotlari, Ichimliklar, Non"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium"
            />
          </div>

          {/* Tugmalar */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 text-white font-bold text-sm shadow-md shadow-red-500/20 hover:opacity-95 active:scale-[0.98] transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{productToEdit ? "Yangilash" : "Saqlash"}</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Shtrix kod skaneri modali */}
      <AdminBarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDetected={(code) => setBarcode(code)}
      />
    </>
  );
}

export function ProductFormDialog({
  isOpen,
  productToEdit,
  onClose,
  onSuccess,
}: ProductFormDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ProductFormModalInner
          key={productToEdit?.id ?? "new_product"}
          productToEdit={productToEdit}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </AnimatePresence>
  );
}
