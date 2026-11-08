// src/components/brand/Logo.tsx
import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textSize?: string;
  isLink?: boolean;
}

export function Logo({
  className = "",
  iconSize = 32,
  showText = true,
  textSize = "text-xl",
  isLink = true,
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* 1. OPTOVIK 3D quti belgisi (Rasmdagi uslubda) */}
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-blue-900 p-2 text-white shadow-lg shadow-red-500/20 transition-transform duration-300 hover:scale-105 active:scale-95"
        style={{ width: iconSize + 12, height: iconSize + 12 }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow"
        >
          {/* 3D Box tanasi (Navy) */}
          <path
            d="M24 6L40 14V34L24 42L8 34V14L24 6Z"
            fill="#1E3A8A"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Qutining tepa qopqog'i */}
          <path
            d="M24 6L40 14L24 22L8 14L24 6Z"
            fill="#2563EB"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Oq lenta (Tape) */}
          <path
            d="M24 6L24 22L32 18L32 2L24 6Z"
            fill="#FFFFFF"
            opacity="0.9"
          />
          {/* Qizil ko'rsatkich belgisi (Ikkita qizil strelka ↑↑) */}
          <g transform="translate(12, 19) scale(0.55)">
            <rect x="2" y="2" width="16" height="14" rx="2" fill="#FFFFFF" />
            <path d="M7 11V6M7 6L5 8M7 6L9 8" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 11V6M13 6L11 8M13 6L15 8" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="5" y1="13" x2="15" y2="13" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>

        {/* Pulsatsiyali faollik nuri */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </div>

      {/* 2. OPTOVIK.UZ brend matni (Rasmdagi kapsula uslubida) */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight leading-none">
            <span className={`${textSize} font-black text-slate-900 dark:text-white tracking-tighter`}>
              OPTOVIK
            </span>
            <span className={`${textSize} font-black text-red-600 tracking-tighter`}>
              .UZ
            </span>
          </div>
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
            Smart Supermarket
          </span>
        </div>
      )}
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="inline-flex items-center focus:outline-none group">
        {content}
      </Link>
    );
  }

  return content;
}
