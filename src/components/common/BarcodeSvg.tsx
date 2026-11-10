// src/components/common/BarcodeSvg.tsx
"use client";

import React from "react";

// Standard Code 128B patterns
// Each string is 6 digits representing the widths of 3 bars and 3 spaces (sum = 11)
const CODE128_PATTERNS: string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112" // 100-106 (106 is STOP: 7 digits)
];

const START_CODE_B = 104;
const STOP_CODE = 106;

export interface BarcodeSvgProps {
  value: string;
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export function BarcodeSvg({
  value,
  width = 280,
  height = 80,
  className = "",
  showText = true,
}: BarcodeSvgProps) {
  // Clean value (only ASCII 32 to 126 supported in Code128B)
  const cleanValue = value.replace(/[^\x20-\x7E]/g, "").toUpperCase();

  // Calculate Code128B tokens
  const codes: number[] = [START_CODE_B];
  let checksum = START_CODE_B;

  for (let i = 0; i < cleanValue.length; i++) {
    const code = cleanValue.charCodeAt(i) - 32;
    codes.push(code);
    checksum += code * (i + 1);
  }

  const checksumCode = checksum % 103;
  codes.push(checksumCode);
  codes.push(STOP_CODE);

  // Convert codes to bar pattern string
  let pattern = "0000000000"; // Left quiet zone
  for (const code of codes) {
    const p = CODE128_PATTERNS[code] || CODE128_PATTERNS[0];
    let isBar = true;
    for (let j = 0; j < p.length; j++) {
      const w = parseInt(p[j], 10);
      pattern += (isBar ? "1" : "0").repeat(w);
      isBar = !isBar;
    }
  }
  pattern += "0000000000"; // Right quiet zone

  const totalModules = pattern.length;
  const barHeight = showText ? height - 20 : height;

  return (
    <div 
      style={{ maxWidth: width }}
      className={`inline-flex flex-col items-center bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md ${className}`}
    >
      <svg
        viewBox={`0 0 ${totalModules} ${barHeight}`}
        className="w-full h-auto max-h-[85px] shape-rendering-crispEdges"
        preserveAspectRatio="none"
        style={{ shapeRendering: "crispEdges" }}
      >
        <rect width={totalModules} height={barHeight} fill="#FFFFFF" />
        {pattern.split("").map((bit, idx) => {
          if (bit === "1") {
            return (
              <rect
                key={idx}
                x={idx}
                y={0}
                width={1}
                height={barHeight}
                fill="#000000"
              />
            );
          }
          return null;
        })}
      </svg>
      {showText && (
        <span className="mt-1.5 font-mono text-xs sm:text-sm font-black tracking-[0.25em] text-slate-950 uppercase select-all">
          {cleanValue}
        </span>
      )}
    </div>
  );
}

