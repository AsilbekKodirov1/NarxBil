// src/config/brand.ts
// OPTOVIK.UZ Brend ma'lumotlari yagona markaziy konfiguratsiyasi.

export const BRAND_CONFIG = {
  // Asosiy brend parametrlari
  name: "OPTOVIK.UZ",
  shortName: "Optovik",
  domain: "optovik.uz",
  tagline: "Kassaga bormasdan narxni biling",
  description: "Mahsulot shtrix kodini skanerlang va do'kondagi ulgurji hamda chakana narxini telefoningizda darhol bilib oling.",
  
  // Ma'muriy va aloqa emaili
  email: "admin@optovik.uz",
  supportEmail: "info@optovik.uz",

  // Do'kon va narx eslatmasi
  priceDisclaimer: "Narx taxminiy bo'lishi mumkin, iltimos, kassada tekshiring.",

  // Ranglar va gradientlar (Rasmdagi OPTOVIK.UZ qizil va to'q ko'k brendi)
  colors: {
    primary: "#DC2626", // Asosiy Jonli Qizil (Red)
    secondary: "#1E3A8A", // To'q Ko'k (Royal Navy)
    accent: "#EF4444", // Yorqin qizil (Light Red / Coral)
    navy: "#0F172A", // Chuqur qora-ko'k (Deep Navy)
    laser: "#EF4444", // Skaner lazer nuri (Neon Red)
    success: "#10B981", // Zumrad yashil (Emerald)
    
    // Gradient sinflari (Tailwind)
    gradientPrimary: "from-red-600 via-rose-600 to-blue-900",
    gradientHover: "hover:from-red-700 hover:via-rose-700 hover:to-blue-950",
    gradientText: "bg-gradient-to-r from-red-600 via-rose-600 to-blue-900 bg-clip-text text-transparent",
    gradientGlow: "bg-gradient-to-r from-red-600/25 via-rose-500/20 to-blue-900/25",
    gradientRed: "from-red-600 to-rose-700",
    gradientNavy: "from-blue-900 to-slate-900",
  },

  // Valyuta sozlamasi
  currency: {
    symbol: "so'm",
    code: "UZS",
    format: (amount: number): string => {
      return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
    },
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
