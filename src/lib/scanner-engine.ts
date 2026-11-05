// src/lib/scanner-engine.ts
// Yuqori tezlikdagi apparat tezlashuvli gibrid shtrix kod skaneri (Native BarcodeDetector + ZXing Fallback)

import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";

export interface ScanResult {
  text: string;
  format?: string;
}

export type ScanCallback = (result: ScanResult) => void;

interface BarcodeDetectorInstance {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string; format: string }>>;
}

declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: { formats: string[] }): BarcodeDetectorInstance;
      getSupportedFormats?: () => Promise<string[]>;
    };
  }
}

export class FastBarcodeScanner {
  private videoElement: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private zxingReader: BrowserMultiFormatReader | null = null;
  private isScanning: boolean = false;
  private onDetected: ScanCallback | null = null;
  private lastDetectedCode: string = "";
  private lastDetectedTime: number = 0;
  private debounceMs: number = 2000;
  private isDetecting: boolean = false;

  constructor() {
    // ZXing sozlamalari (TRY_HARDER: true — xira yoki biroz qiyshaygan shtrix kodlarni ham o'qishi uchun)
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.QR_CODE,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    this.zxingReader = new BrowserMultiFormatReader(hints);
  }

  // Mavjud kameralar ro'yxatini olish
  static async getCameras(): Promise<{ id: string; label: string }[]> {
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
        return [];
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter((d) => d.kind === "videoinput")
        .map((d, index) => ({
          id: d.deviceId,
          label: d.label || (index === 0 ? "Asosiy orqa kamera" : `Kamera ${index + 1}`),
        }));
    } catch {
      return [];
    }
  }

  // Skanerlashni boshlash
  async start(
    videoElement: HTMLVideoElement,
    onDetected: ScanCallback,
    preferredDeviceId?: string
  ): Promise<{ hasTorch: boolean; cameras: { id: string; label: string }[] }> {
    this.stop(); // Oldingi oqimni tozalash

    this.videoElement = videoElement;
    this.onDetected = onDetected;
    this.isScanning = true;
    this.isDetecting = false;

    // Kamera constraints: Yuqori sifat (Full HD / HD) va avtofokus
    const videoConstraints: MediaTrackConstraints = {
      width: { ideal: 1920, min: 1280 },
      height: { ideal: 1080, min: 720 },
      ...(preferredDeviceId
        ? { deviceId: { exact: preferredDeviceId } }
        : { facingMode: { ideal: "environment" } }),
      // @ts-expect-error advanced focusMode
      advanced: [{ focusMode: "continuous" }],
    };

    try {
      // 1. Kamerani ochish
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false,
        });
      } catch {
        // Agar yuqori aniqlik qo'llab-quvvatlanmasa, oddiy constraints bilan qayta urinish
        stream = await navigator.mediaDevices.getUserMedia({
          video: preferredDeviceId
            ? { deviceId: { exact: preferredDeviceId } }
            : { facingMode: "environment" },
          audio: false,
        });
      }

      this.stream = stream;
      this.videoElement.srcObject = stream;
      this.videoElement.setAttribute("playsinline", "true");
      this.videoElement.muted = true;
      await this.videoElement.play();

      // 2. BarcodeDetector yoki ZXing rejimini tanlash
      const hasNativeDetector = typeof window !== "undefined" && Boolean(window.BarcodeDetector);

      if (hasNativeDetector) {
        await this.runNativeScanLoop();
      } else {
        this.runZXingScanLoop();
      }

      // 3. Fonar (Torch) imkoniyatini tekshirish
      const track = stream.getVideoTracks()[0];
      const capabilities = track?.getCapabilities ? (track.getCapabilities() as { torch?: boolean }) : {};
      const hasTorch = Boolean(capabilities.torch);

      // Kameralar ro'yxatini yangilash (ruxsat olingandan so'ng nomlari aniq chiqadi)
      const cameras = await FastBarcodeScanner.getCameras();

      return { hasTorch, cameras };
    } catch (err) {
      this.stop();
      throw err;
    }
  }

  // 1. Apparat tezlashuvli Native BarcodeDetector (Chrome, Edge, Android Chrome da 0% CPU sarfi bilan 60fps)
  private async runNativeScanLoop() {
    if (!window.BarcodeDetector || !this.videoElement) return;

    let detector: BarcodeDetectorInstance | null = null;
    try {
      let formats = ["ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "qr_code"];
      if (window.BarcodeDetector.getSupportedFormats) {
        const supported = await window.BarcodeDetector.getSupportedFormats();
        formats = formats.filter((f) => supported.includes(f));
      }
      detector = new window.BarcodeDetector({ formats });
    } catch {
      // Xatolik bo'lsa zaxiradagi ZXing ga o'tish
      this.runZXingScanLoop();
      return;
    }

    const scan = async () => {
      if (!this.isScanning || !this.videoElement) return;

      if (this.videoElement.readyState >= 2 && !this.isDetecting && detector) {
        this.isDetecting = true;
        try {
          const barcodes = await detector.detect(this.videoElement);
          if (barcodes && barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            const now = Date.now();

            if (rawValue && (rawValue !== this.lastDetectedCode || now - this.lastDetectedTime > this.debounceMs)) {
              this.lastDetectedCode = rawValue;
              this.lastDetectedTime = now;
              if (this.onDetected) {
                this.onDetected({ text: rawValue, format: barcodes[0].format });
              }
            }
          }
        } catch {
          // Kadrni o'qishda xatolik bo'lsa davom ettirish
        } finally {
          this.isDetecting = false;
        }
      }

      if (this.isScanning) {
        this.animFrameId = requestAnimationFrame(scan);
      }
    };

    this.animFrameId = requestAnimationFrame(scan);
  }

  // 2. ZXing Scan Loop (iOS Safari va boshqa brauzerlar uchun)
  private runZXingScanLoop() {
    if (!this.zxingReader || !this.videoElement) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const scan = () => {
      if (!this.isScanning || !this.videoElement) return;

      if (this.videoElement.readyState >= 2 && !this.isDetecting && ctx && this.videoElement.videoWidth > 0) {
        this.isDetecting = true;
        try {
          // To'liq kadr yoki markaziy hududni qamrab olish (chiziqlar buzilmasligi uchun)
          const vw = this.videoElement.videoWidth;
          const vh = this.videoElement.videoHeight;

          canvas.width = vw;
          canvas.height = vh;
          ctx.drawImage(this.videoElement, 0, 0, vw, vh);

          const result = this.zxingReader?.decodeFromCanvas(canvas);
          if (result) {
            const text = result.getText();
            const now = Date.now();

            if (text && (text !== this.lastDetectedCode || now - this.lastDetectedTime > this.debounceMs)) {
              this.lastDetectedCode = text;
              this.lastDetectedTime = now;
              if (this.onDetected) {
                this.onDetected({ text, format: result.getBarcodeFormat()?.toString() });
              }
            }
          }
        } catch {
          // Kadrda shtrix kod topilmasa, bu normal holat
        } finally {
          this.isDetecting = false;
        }
      }

      if (this.isScanning) {
        // 60-80ms oraliqda skanerlash (ortiqcha qotib qolishni oldini olish uchun)
        setTimeout(() => {
          if (this.isScanning) {
            this.animFrameId = requestAnimationFrame(scan);
          }
        }, 70);
      }
    };

    this.animFrameId = requestAnimationFrame(scan);
  }

  // Fonarni (Chiroqni) yoqish/o'chirish
  async setTorch(enabled: boolean): Promise<boolean> {
    if (!this.stream) return false;
    const track = this.stream.getVideoTracks()[0];
    if (!track) return false;

    try {
      await track.applyConstraints({
        advanced: [{ torch: enabled } as MediaTrackConstraintSet],
      });
      return true;
    } catch {
      return false;
    }
  }

  // Yangi skanerlash uchun debounceni tozalash
  resetDebounce() {
    this.lastDetectedCode = "";
    this.lastDetectedTime = 0;
  }

  // Kamerani to'xtatish va barcha resurslarni xotiradan ozod qilish
  stop() {
    this.isScanning = false;
    this.isDetecting = false;

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      this.stream = null;
    }

    if (this.videoElement) {
      try {
        this.videoElement.srcObject = null;
      } catch {}
    }
  }
}
