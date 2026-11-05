// src/components/brand/Logo.tsx
import React from "react";
import Link from "next/link";
import { ScanBarcode } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textSize?: string;
  isLink?: boolean;
}

export function Logo({
  className = "",
  iconSize = 28,
  showText = true,
  textSize = "text-xl",
  isLink = true,
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Yorqin gradientli ikonka qutisi */}
      <div className="relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-105 active:scale-95">
        <ScanBarcode size={iconSize} className="stroke-[2.5]" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
        </span>
      </div>

      {/* Brend nomi */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSize} font-extrabold ${BRAND_CONFIG.colors.gradientText} leading-none`}>
            {BRAND_CONFIG.name}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground/70">
            Smart Scanner
          </span>
        </div>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

