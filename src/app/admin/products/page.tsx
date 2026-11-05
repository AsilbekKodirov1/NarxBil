// src/app/admin/products/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Edit3, 
  Trash2, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Loader2 
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductFormDialog, ProductFormData } from "@/components/admin/ProductFormDialog";
import { CsvImportModal } from "@/components/admin/CsvImportModal";
import { BRAND_CONFIG } from "@/config/brand";
import { useToast } from "@/components/ui/Toast";

interface ProductItem {
  id: string;
  name: string;
  barcode: string;
  price: number;
  discountPrice: number | null;
  category: string | null;
  imageUrl: string | null;
  updatedAt: string;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Modallar
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductFormData | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search,
        category,
      });

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (data.availableCategories) {
          setAvailableCategories(data.availableCategories);
        }
      }
    } catch {
      toastError("Mahsulotlarni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, category, toastError]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin/products");
    } else if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/");
      } else {
        fetchProducts();
      }
    }
  }, [status, session, router, fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Haqiqatan ham "${name}" mahsulotini o'chirishni istaysizmi?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toastSuccess(`"${name}" muvaffaqiyatli o'chirildi`);
        fetchProducts();
      } else {
        toastError("O'chirishda xatolik yuz berdi");
      }
    } catch {
      toastError("Server bilan aloqada xatolik");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFF] flex">
      {/* Chap yon menyu */}
      <AdminSidebar />

      {/* Asosiy kontent */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
              Mahsulotlar katalogi ({total})
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200/60"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">CSV Import</span>
            </button>

            <button
              onClick={() => {
                setProductToEdit(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 hover:opacity-95 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi mahsulot</span>
            </button>
          </div>
        </header>

        <main className="p-6 sm:p-8 space-y-6 max-w-6xl w-full">
          {/* Qidiruv va Filtr paneli */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Qidiruv maydoni */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nom yoki shtrix kod bo'yicha qidirish..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>

            {/* Kategoriya filtri */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                Kategoriya:
              </span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 bg-white"
              >
                <option value="ALL">Barcha kategoriyalar</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mahsulotlar jadvali */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    <th className="py-3.5 px-4">Tovar</th>
                    <th className="py-3.5 px-4">Shtrix kod</th>
                    <th className="py-3.5 px-4">Narxi</th>
                    <th className="py-3.5 px-4">Kategoriya</th>
                    <th className="py-3.5 px-4">Oxirgi yangilanish</th>
                    <th className="py-3.5 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                        Yuklanmoqda...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Mahsulotlar topilmadi
                      </td>
                    </tr>
                  ) : (
                    products.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition">
                        {/* Rasm va nom */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 flex-shrink-0">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Tag className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-slate-900 max-w-xs truncate">
                              {item.name}
                            </div>
                          </div>
                        </td>

                        {/* Shtrix kod */}
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.barcode}
                          </span>
                        </td>

                        {/* Narx */}
                        <td className="py-3 px-4">
                          <div className="font-price font-bold text-slate-900">
                            {BRAND_CONFIG.currency.format(item.discountPrice ?? item.price)}
                          </div>
                          {item.discountPrice && (
                            <div className="text-[11px] text-slate-400 font-price line-through">
                              {BRAND_CONFIG.currency.format(item.price)}
                            </div>
                          )}
                        </td>

                        {/* Kategoriya */}
                        <td className="py-3 px-4">
                          {item.category ? (
                            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200/50">
                              {item.category}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Yangilanish vaqti */}
                        <td className="py-3 px-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {new Date(item.updatedAt).toLocaleDateString("uz-UZ", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Tahrirlash va O'chirish */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setProductToEdit(item);
                                setIsFormOpen(true);
                              }}
                              className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                              title="Tahrirlash"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Sahifalash (Pagination) */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <div>
                  Sahifa {page} / {totalPages} (Jami {total} ta)
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mahsulot qo'shish / tahrirlash dialogi */}
      <ProductFormDialog
        isOpen={isFormOpen}
        productToEdit={productToEdit}
        onClose={() => {
          setIsFormOpen(false);
          setProductToEdit(null);
        }}
        onSuccess={() => fetchProducts()}
      />

      {/* CSV import modali */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={() => fetchProducts()}
      />
    </div>
  );
}

