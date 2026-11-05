// src/app/scan/page.tsx
import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { BRAND_CONFIG } from "@/config/brand";

export const metadata: Metadata = {
  title: `Skaner — ${BRAND_CONFIG.name}`,
  description: "Mahsulot shtrix kodini kamerangiz orqali skanerlang va do'kondagi aniq narxini darhol biling.",
};

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center">
        <BarcodeScanner />
      </div>
    </main>
  );
}

