// src/components/brand/Logo.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textSize?: string;
  isLink?: boolean;
  variant?: "default" | "box" | "full";
}

export function Logo({
  className = "",
  iconSize = 36,
  showText = true,
  isLink = true,
  variant = "default",
}: LogoProps) {
  // Hisoblangan o'lchamlar
  // logo-transparent.png o'lchami: 302 x 136 (nisbat: 2.22)
  const logoHeight = Math.max(30, Math.round(iconSize * 1.05));
  const logoWidth = Math.round(logoHeight * 2.22);

  const content = (
    <div className={`inline-flex items-center select-none group ${className}`}>
      {variant === "box" || !showText ? (
        /* Faqat 3D quti belgisi */
        <div
          className="relative flex items-center justify-center rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105 active:scale-95"
          style={{ width: iconSize, height: iconSize }}
        >
          <Image
            src="/brand/logo-box.png"
            alt="OPTOVIK"
            width={iconSize}
            height={iconSize}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      ) : variant === "full" ? (
        /* To'liq kvadrat qizil fonli original logotip */
        <div
          className="relative rounded-2xl overflow-hidden shadow-lg shadow-red-500/20 transition-transform duration-300 group-hover:scale-105 active:scale-95 border border-red-500/30"
          style={{ width: iconSize * 2, height: iconSize * 2 }}
        >
          <Image
            src="/brand/logo-full.png"
            alt="OPTOVIK.UZ"
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        /* Haqiqiy yuklangan OPTOVIK.UZ emblemasi (3D quti + OPTOVIK.UZ kapsulasi) */
        <div
          className="relative flex items-center transition-transform duration-300 group-hover:scale-105 active:scale-95"
          style={{ height: logoHeight, width: logoWidth }}
        >
          <Image
            src="/brand/logo-transparent.png"
            alt="OPTOVIK.UZ"
            width={302}
            height={136}
            className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(220,38,38,0.2)]"
            priority
          />
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
