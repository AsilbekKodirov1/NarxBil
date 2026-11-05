// src/config/brand.ts
// Brend ma'lumotlari yagona markaziy fayli.
// Brend nomini o'zgartirish uchun faqat shu fayldagi qiymatlarni tahrirlang!

export const BRAND_CONFIG = {
  // Asosiy brend parametrlari
  name: "NarxBil",
  shortName: "NarxBil",
  domain: "narxbil.uz",
  tagline: "Kassaga bormasdan narxni biling",
  description: "Mahsulot shtrix kodini skanerlang va do'kondagi aniq narxini telefoningizda darhol bilib oling.",
  
  // Ma'muriy va aloqa emaili
  email: "admin@narxbil.uz",
  supportEmail: "info@narxbil.uz",

  // Do'kon va narx eslatmasi
  priceDisclaimer: "Narx taxminiy bo'lishi mumkin, iltimos, kassada tekshiring.",

  // Ranglar va gradientlar
  colors: {
    primary: "#7C3AED", // Binafsha (Violet)
    secondary: "#EC4899", // Pushti (Pink)
    accent: "#F59E0B", // To'q sariq (Amber)
    cyan: "#06B6D4", // Firuza (Cyan)
    success: "#84CC16", // Limon-yashil (Lime)
    
    // Gradient sinflari (Tailwind)
    gradientPrimary: "from-purple-600 via-pink-500 to-amber-500",
    gradientHover: "hover:from-purple-700 hover:via-pink-600 hover:to-amber-600",
    gradientText: "bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent",
    gradientGlow: "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20",
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

