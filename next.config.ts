import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Kamera va skaner kutubxonasi ikki marta ketma-ket ishga tushmasligi uchun
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
