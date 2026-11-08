// src/components/admin/AdminBarcodeScannerModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ScanBarcode, CameraOff } from "lucide-react";
import { playSuccessChime } from "@/lib/audio";
import { FastBarcodeScanner } from "@/lib/scanner-engine";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<FastBarcodeScanner | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setErrorMsg(null);
    setIsReady(false);

    const scanner = new FastBarcodeScanner();
    scannerRef.current = scanner;

    const start = async () => {
      // DOM da video elementi ulanishini kutish
      await new Promise((r) => setTimeout(r, 150));
      if (!isMounted || !videoRef.current) return;

      try {
        await scanner.start(videoRef.current, (result) => {
          if (!isMounted) return;
          playSuccessChime();
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([40, 50, 40]);
          }
          onDetected(result.text);
          onClose();
        });
        if (isMounted) setIsReady(true);
      } catch (err) {
        console.warn("Admin kamera xatosi:", err);
        if (isMounted) {
          setErrorMsg("Kamerani ishga tushirib bo'lmadi yoki ruxsat berilmadi");
        }
      }
    };

    start();

    return () => {
      isMounted = false;
      scanner.stop();
      scannerRef.current = null;
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
                <ScanBarcode className="w-5 h-5 text-red-500" />
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
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />

              {/* Lazer chizig'i animatsiyasi */}
              {isReady && !errorMsg && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-[260px] h-[160px] border-2 border-dashed border-red-500/80 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    <motion.div
                      animate={{ top: ["5%", "90%", "5%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_#EF4444]"
                    />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center">
                  <CameraOff className="w-8 h-8 text-rose-400 mb-2" />
                  <p className="text-xs text-rose-300 mb-3">{errorMsg}</p>
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
              Shtrix kodni ramka ichiga keltiring, u bir zumda aniqlanadi
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
