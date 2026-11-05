// src/components/admin/AdminBarcodeScannerModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, ScanBarcode, RotateCcw } from "lucide-react";
import { playSuccessChime } from "@/lib/audio";

interface AdminBarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (barcode: string) => void;
}

export function AdminBarcodeScannerModal({
  isOpen,
  onClose,
  onDetected,
}: AdminBarcodeScannerModalProps) {
  const scannerId = "admin-product-qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const startScanner = async () => {
      setErrorMsg(null);
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerId, {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
            ],
            verbose: false,
          });
        }

        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          if (isMounted) setErrorMsg("Kamera topilmadi");
          return;
        }

        let cameraId = devices[0].id;
        const back = devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear"));
        if (back) cameraId = back.id;

        await scannerRef.current.start(
          cameraId,
          {
            fps: 15,
            qrbox: { width: 250, height: 160 },
          },
          (decodedText) => {
            playSuccessChime();
            onDetected(decodedText);
            onClose();
          },
          () => {}
        );
      } catch (err) {
        console.warn("Admin kamera xatosi:", err);
        if (isMounted) setErrorMsg("Kameraga ulanib bo'lmadi");
      }
    };

    // Modal ochilganda biroz kechiktirib ishga tushirish (DOM tayyor bo'lishi uchun)
    const timer = setTimeout(startScanner, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
        } catch {}
      }
    };
  }, [isOpen, onDetected, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-[10%] max-w-md mx-auto bg-slate-900 text-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-800"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ScanBarcode className="w-5 h-5 text-purple-400" />
                <span>Shtrix kodni skanerlash</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[280px] bg-black flex items-center justify-center overflow-hidden">
              <div id={scannerId} className="w-full h-full object-cover" />

              {/* Lazer chizig'i animatsiyasi */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-[250px] h-[160px] border-2 border-dashed border-cyan-400/80 rounded-2xl overflow-hidden">
                  <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#06B6D4]"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-xs text-rose-400 mb-3">{errorMsg}</p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                  >
                    Yopish
                  </button>
                </div>
              )}
            </div>

            <div className="p-3 text-center text-[11px] text-slate-400">
              Shtrix kodni ramka ichiga keltiring, u avtomatik aniqlanadi
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

