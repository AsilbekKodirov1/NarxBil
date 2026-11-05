// src/components/ui/AnimatedCounter.tsx
"use client";

import React, { useEffect, useState } from "react";
import { BRAND_CONFIG } from "@/config/brand";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number; // millisekundlarda
}

export function AnimatedCounter({
  value,
  className = "",
  duration = 600,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const diff = value - startValue;

    if (diff === 0) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startValue + diff * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, duration]);

  return (
    <span className={`font-price font-extrabold tabular-nums ${className}`}>
      {BRAND_CONFIG.currency.format(displayValue)}
    </span>
  );
}

