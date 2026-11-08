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
  variant?: "horizontal" | "badge" | "box" | "full";
}

export function Logo({
  className = "",
  iconSize = 36,
  showText = true,
  textSize = "text-xl",
  isLink = true,
  variant = "horizontal",
}: LogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {variant === "full" ? (
        /* Original 500x500 user-uploaded logo */
        <div
          className="relative rounded-3xl overflow-hidden shadow-xl shadow-red-500/25 transition-transform duration-300 group-hover:scale-105 active:scale-95 border-2 border-red-500/40"
          style={{ width: iconSize * 2.2, height: iconSize * 2.2 }}
        >
          <Image
            src="/brand/logo-full.png"
            alt="OPTOVIK.UZ"
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : variant === "badge" ? (
        /* Stacked transparent emblem (3D box + pill) */
        <div
          className="relative flex items-center transition-transform duration-300 group-hover:scale-105 active:scale-95"
          style={{ height: Math.max(48, Math.round(iconSize * 1.3)), width: Math.max(48, Math.round(iconSize * 1.3)) * 2.22 }}
        >
          <Image
            src="/brand/logo-transparent.png"
            alt="OPTOVIK.UZ"
            width={302}
            height={136}
            className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(220,38,38,0.25)]"
            priority
          />
        </div>
      ) : variant === "box" ? (
        /* Faqat 3D quti belgisi */
        <div
          className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-blue-900 p-1.5 shadow-md shadow-red-500/25 transition-transform duration-300 group-hover:scale-105 active:scale-95 flex-shrink-0"
          style={{ width: iconSize + 6, height: iconSize + 6 }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/brand/logo-box.png"
              alt="OPTOVIK"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : (
        /* Asosiy gorizontal kompozitsiya (Navbar, Sidebar va sarlavhalar uchun qulay va 100% o'qiluvchan) */
        <>
          <div
            className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-blue-900 p-1.5 shadow-md shadow-red-500/25 transition-transform duration-300 group-hover:scale-105 active:scale-95 flex-shrink-0"
            style={{ width: iconSize + 6, height: iconSize + 6 }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/brand/logo-box.png"
                alt="OPTOVIK"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Faollik nuri */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>

          {showText && (
            <div className="flex flex-col">
              <div className="flex items-center tracking-tight leading-none gap-1.5">
                <span className={`${textSize} font-black text-blue-950 dark:text-white tracking-tighter`}>
                  OPTOVIK
                </span>
                <span className={`${textSize} font-black text-red-600 tracking-tighter`}>
                  .UZ
                </span>
                <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                  BETA
                </span>
              </div>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
                Smart Supermarket
              </span>
            </div>
          )}
        </>
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
