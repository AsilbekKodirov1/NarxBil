// src/components/scanner/BarcodeScanner.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Flashlight, 
  FlashlightOff, 
  SwitchCamera, 
  Keyboard, 
  RotateCcw,
  CameraOff
} from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { playSuccessChime } from "@/lib/audio";
import { ProductBottomSheet, ScannedProductData } from "./ProductBottomSheet";
import { ManualBarcodeInput } from "./ManualBarcodeInput";
import { useToast } from "@/components/ui/Toast";

export function BarcodeScanner() {
  const { error: toastError, info: toastInfo } = useToast();

  const scannerRegionId = "narxbil-html5-qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isTransitioningRef = useRef(false);

  // Kameralar va sozlamalar
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState<number>(0);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  // Holatlar
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Skanerlangan tovar va modal holatlari
  const [scannedProduct, setScannedProduct] = useState<ScannedProductData | null>(null);
  const [notFoundBarcode, setNotFoundBarcode] = useState<string | null>(null);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);

  // Debounce (takroriy o'qishdan saqlash)
  const lastScannedTimeRef = useRef<number>(0);
  const lastScannedCodeRef = useRef<string>("");

  // Mahsulotni serverdan olish
  const fetchProduct = useCallback(async (barcode: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/products/barcode/${encodeURIComponent(barcode)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        // Muvaffaqiyat effektlari
        playSuccessChime();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([40, 50, 40]);
        }
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#7C3AED", "#EC4899", "#06B6D4", "#84CC16"],
        });

        setScannedProduct(data.product);
        setNotFoundBarcode(null);
      } else {
        setNotFoundBarcode(barcode);
        setScannedProduct(null);
      }
    } catch (err) {
      console.error("Mahsulot qidirish xatosi:", err);
      toastError("Internet yoki server bilan aloqada xatolik yuz berdi");
    } finally {
      setIsProcessing(false);
    }
  }, [toastError]);

  // Shtrix kod aniqlanganda
  const onScanSuccess = useCallback(
    (decodedText: string) => {
      const now = Date.now();
      // Debounce: 2.5 soniya ichida bir xil kodni qayta o'qimaslik
      if (
        decodedText === lastScannedCodeRef.current &&
        now - lastScannedTimeRef.current < 2500
      ) {
        return;
      }

      // Agar modal ochiq yoki qidiruv ketyapti bo'lsa, to'xtatib turish
      if (scannedProduct || notFoundBarcode || isProcessing) {
        return;
      }

      lastScannedCodeRef.current = decodedText;
      lastScannedTimeRef.current = now;

      fetchProduct(decodedText);
    },
    [fetchProduct, scannedProduct, notFoundBarcode, isProcessing]
  );

  // Kamerani ishga tushirish (xavfsiz holat nazorati bilan)
  const startCamera = useCallback(async () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCameraError(null);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerRegionId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          verbose: false,
        });
      }

      // Agar allaqachon skanerlayotgan bo'lsa, qayta start qilmaslik
      if (html5QrCodeRef.current.isScanning) {
        setIsScanning(true);
        return;
      }

      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setCameraError("Qurilmada kamera topilmadi");
        return;
      }

      setCameras(devices);

      // Orqa kamerani (back/environment) topish
      let targetCameraId = devices[0].id;
      const backCamera = devices.find((d) =>
        d.label.toLowerCase().includes("back") ||
        d.label.toLowerCase().includes("orqa") ||
        d.label.toLowerCase().includes("rear") ||
        d.label.toLowerCase().includes("environment")
      );
      if (backCamera) {
        targetCameraId = backCamera.id;
      }

      await html5QrCodeRef.current.start(
        targetCameraId,
        {
          fps: 15,
          qrbox: { width: 280, height: 180 },
          aspectRatio: 1.777778,
        },
        onScanSuccess,
        () => {} // Xatolarni har kadrda konsolga chiqarmaslik
      );

      setIsScanning(true);

      // Fonar (Torch) qo'llab-quvvatlashini tekshirish
      try {
        const capabilities = html5QrCodeRef.current.getRunningTrackCapabilities();
        if (capabilities && (capabilities as { torch?: boolean }).torch) {
          setTorchSupported(true);
        }
      } catch {
        setTorchSupported(false);
      }
    } catch (err: unknown) {
      console.warn("Kamerani ishga tushirishda xatolik:", err);
      const errMsg = String(err);
      if (errMsg.includes("NotAllowedError") || errMsg.includes("Permission")) {
        setCameraError(
          "Kameradan foydalanishga ruxsat berilmadi. Iltimos, brauzer sozlamalaridan kamera ruxsatini yoqing."
        );
      } else if (!errMsg.includes("transition")) {
        setCameraError(
          "Kamerani ishga tushirish imkoni bo'lmadi. Kodni qo'lda kiritishingiz mumkin."
        );
      }
      setIsScanning(false);
    } finally {
      isTransitioningRef.current = false;
    }
  }, [onScanSuccess]);

  // Kamerani to'xtatish
  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current && isScanning) {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.warn("Kamera to'xtatish xatosi:", err);
      } finally {
        isTransitioningRef.current = false;
      }
    }
  }, [isScanning]);

  // Fonarni yoqish/o'chirish
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !torchSupported) return;
    try {
      const nextState = !isTorchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState } as MediaTrackConstraintSet],
      });
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn("Fonar boshqaruvida xatolik:", err);
      toastInfo("Bu qurilmada fonarni boshqarib bo'lmadi");
    }
  };

  // Old/orqa kamerani almashtirish
  const switchCamera = async () => {
    if (cameras.length <= 1) {
      toastInfo("Boshqa kamera topilmadi");
      return;
    }

    const nextIndex = (selectedCameraIndex + 1) % cameras.length;
    setSelectedCameraIndex(nextIndex);

    if (html5QrCodeRef.current && isScanning) {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.start(
          cameras[nextIndex].id,
          {
            fps: 15,
            qrbox: { width: 280, height: 180 },
            aspectRatio: 1.777778,
          },
          onScanSuccess,
          () => {}
        );
      } finally {
        isTransitioningRef.current = false;
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        try {
          html5QrCodeRef.current.stop().catch(() => {});
        } catch {}
      }
    };
  }, [startCamera]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] max-w-lg mx-auto bg-black overflow-hidden flex flex-col justify-between select-none">
      {/* 1. Kamera video konteyneri */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <div id={scannerRegionId} className="w-full h-full object-cover" />
      </div>

      {/* 2. Yuqori navigatsiya va boshqaruv asboblari */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-white text-xs font-bold tracking-wider uppercase drop-shadow">
            Skaner faol
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Fonar tugmasi */}
          {torchSupported && (
            <button
              onClick={toggleTorch}
              className={`p-3 rounded-full backdrop-blur-md border transition ${
                isTorchOn
                  ? "bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/30"
                  : "bg-white/20 text-white border-white/20 hover:bg-white/30"
              }`}
              title="Fonarni yoqish/o'chirish"
            >
              {isTorchOn ? <Flashlight className="w-5 h-5" /> : <FlashlightOff className="w-5 h-5" />}
            </button>
          )}

          {/* Kamera almashtirish */}
          {cameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 transition"
              title="Kamerani almashtirish"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
          )}

          {/* Qo'lda kiritish */}
          <button
            onClick={() => setIsManualInputOpen(true)}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 transition"
            title="Shtrix kodni qo'lda kiritish"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. O'rta: Skaner nishoni va animatsiyali lazer chizig'i */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pointer-events-none">
        {/* Agar kamera xatosi bo'lsa */}
        {cameraError ? (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700 p-6 rounded-3xl max-w-sm text-center text-white shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <CameraOff className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-1">Kamera ulanmadi</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {cameraError}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={startCamera}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta urinish</span>
              </button>
              <button
                onClick={() => setIsManualInputOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition"
              >
                Kodni qo&apos;lda kiritish
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-[280px] h-[180px]">
            {/* Burchak belgilari (Corner brackets) */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-2xl shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-2xl shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-2xl shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-2xl shadow-[0_0_15px_rgba(6,182,212,0.8)]" />

            {/* Animatsiyali lazer chizig'i */}
            <motion.div
              animate={{
                top: ["5%", "90%", "5%"],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06B6D4]"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-cyan-400/30 blur-sm rounded-full" />
            </motion.div>

            {/* Yuklanish / Qidiruv indikatori */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center text-white">
                <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs font-bold tracking-wide">Narx qidirilmoqda...</span>
              </div>
            )}
          </div>
        )}

        <p className="text-white/80 text-xs font-semibold mt-4 text-center drop-shadow px-4">
          Shtrix kodni ramka ichiga to&apos;g&apos;rilang
        </p>
      </div>

      {/* 4. Pastki qism: Qo'lda kiritish tugmasi */}
      <div className="relative z-20 p-4 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-center">
        <button
          onClick={() => setIsManualInputOpen(true)}
          className="py-3 px-6 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition active:scale-95"
        >
          <Keyboard className="w-4 h-4 text-cyan-300" />
          <span>Kodni qo&apos;lda kiritish</span>
        </button>
      </div>

      {/* 5. Mahsulot Natija Kartasi (Bottom Sheet) */}
      <ProductBottomSheet
        product={scannedProduct}
        notFoundBarcode={notFoundBarcode}
        onClose={() => {
          setScannedProduct(null);
          setNotFoundBarcode(null);
        }}
        onManualInputClick={() => {
          setScannedProduct(null);
          setNotFoundBarcode(null);
          setIsManualInputOpen(true);
        }}
      />

      {/* 6. Qo'lda shtrix kod kiritish modali */}
      <ManualBarcodeInput
        isOpen={isManualInputOpen}
        onClose={() => setIsManualInputOpen(false)}
        onSubmit={(barcode) => {
          setIsManualInputOpen(false);
          fetchProduct(barcode);
        }}
      />
    </div>
  );
}
