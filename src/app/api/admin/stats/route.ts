// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { BRAND_CONFIG } from "@/config/brand";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.errorResponse;

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // 1. Jami tovarlar va bugungi skanerlashlar
    const [totalProducts, todayScans, totalStores] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.scanHistory.count({
        where: { scannedAt: { gte: todayStart } },
      }),
      prisma.store.count(),
    ]);

    // 2. Eng ko'p skanerlangan 5 ta tovar
    const topScansGroup = await prisma.scanHistory.groupBy({
      by: ["productId"],
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    });

    const topProductIds = topScansGroup.map((item) => item.productId);
    const topProductsData = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: {
        id: true,
        name: true,
        price: true,
        barcode: true,
        imageUrl: true,
        category: true,
      },
    });

    const top5Products = topScansGroup.map((group) => {
      const prod = topProductsData.find((p) => p.id === group.productId);
      return {
        id: group.productId,
        name: prod?.name || "Noma'lum mahsulot",
        barcode: prod?.barcode || "",
        priceFormatted: prod ? BRAND_CONFIG.currency.format(prod.price) : "",
        imageUrl: prod?.imageUrl || null,
        category: prod?.category || null,
        scanCount: group._count.productId,
      };
    });

    // 3. Oxirgi 7 kunlik skanerlash statistikasi (Recharts uchun)
    const recentScans = await prisma.scanHistory.findMany({
      where: { scannedAt: { gte: sevenDaysAgo } },
      select: { scannedAt: true },
    });

    const daysMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateKey = d.toLocaleDateString("uz-UZ", {
        month: "short",
        day: "numeric",
      });
      daysMap[dateKey] = 0;
    }

    for (const scan of recentScans) {
      const dateKey = new Date(scan.scannedAt).toLocaleDateString("uz-UZ", {
        month: "short",
        day: "numeric",
      });
      if (daysMap[dateKey] !== undefined) {
        daysMap[dateKey]++;
      }
    }

    const weeklyTrend = Object.entries(daysMap).map(([date, count]) => ({
      date,
      skanerlar: count,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        todayScans,
        totalStores,
        top5Products,
        weeklyTrend,
      },
    });
  } catch (error) {
    console.error("Admin statistika xatosi:", error);
    return NextResponse.json(
      { error: "Statistikani olishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

