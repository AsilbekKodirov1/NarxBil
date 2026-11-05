// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { BRAND_CONFIG } from "@/config/brand";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
  description: BRAND_CONFIG.description,
  applicationName: BRAND_CONFIG.name,
  authors: [{ name: BRAND_CONFIG.name }],
  keywords: ["narx", "shtrix kod", "skaner", "supermarket", "narxbil", "kassa", "o'zbekiston"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_CONFIG.colors.primary,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      className={`${sora.variable} ${plusJakarta.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAFAFF] dark:bg-[#0B0B1A] text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
