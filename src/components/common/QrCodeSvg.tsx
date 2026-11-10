// src/components/common/QrCodeSvg.tsx
"use client";

import React, { useState } from "react";
import { QrCode as QrIcon } from "lucide-react";

export interface QrCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
}

export function QrCodeSvg({ value, size = 180, className = "" }: QrCodeSvgProps) {
  const [hasError, setHasError] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}&margin=1`;

  return (
    <div className={`inline-flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md ${className}`}>
      {!hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrUrl}
          alt={`QR Kod: ${value}`}
          width={size}
          height={size}
          className="rounded-lg object-contain"
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="flex flex-col items-center justify-center bg-slate-100 rounded-lg text-slate-500 gap-2 p-2 text-center"
        >
          <QrIcon className="w-8 h-8 text-slate-400" />
          <span className="font-mono text-xs font-bold text-slate-800 break-all">{value}</span>
        </div>
      )}
      <span className="mt-2 font-mono text-xs font-black tracking-widest text-slate-950 uppercase select-all">
        {value}
      </span>
    </div>
  );
}

