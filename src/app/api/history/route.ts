// src/app/api/history/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BRAND_CONFIG } from "@/config/brand";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Tizimga kiring", isGuest: true },
        { status: 401 }
      );
    }

    const records = await prisma.scanHistory.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        scannedAt: "desc",
      },
      take: 60,
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Guruhlarga ajratish
    const groups: {
      title: string;
      items: Array<{
        id: string;
        scannedAt: string;
        timeFormatted: string;
        product: {
          id: string;
          name: string;
          barcode: string;
          price: number;
          priceFormatted: string;
          discountPrice: number | null;
          discountPriceFormatted: string | null;
          imageUrl: string | null;
          category: string | null;
          storeName: string | null;
        };
      }>;
    }[] = [
      { title: "Bugun", items: [] },
      { title: "Kecha", items: [] },
      { title: "Oxirgi 7 kun", items: [] },
      { title: "Avvalroq", items: [] },
    ];

    for (const record of records) {
      const scanDate = new Date(record.scannedAt);
      const timeFormatted = scanDate.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const itemData = {
        id: record.id,
        scannedAt: record.scannedAt.toISOString(),
        timeFormatted,
        product: {
          id: record.product.id,
          name: record.product.name,
          barcode: record.product.barcode,
          price: record.product.price,
          priceFormatted: BRAND_CONFIG.currency.format(record.product.price),
          discountPrice: record.product.discountPrice,
          discountPriceFormatted: record.product.discountPrice
            ? BRAND_CONFIG.currency.format(record.product.discountPrice)
            : null,
          imageUrl: record.product.imageUrl,
          category: record.product.category,
          storeName: record.product.store?.name || null,
        },
      };

      if (scanDate >= today) {
        groups[0].items.push(itemData);
      } else if (scanDate >= yesterday) {
        groups[1].items.push(itemData);
      } else if (scanDate >= lastWeek) {
        groups[2].items.push(itemData);
      } else {
        groups[3].items.push(itemData);
      }
    }

    // Bo'sh guruhlarni olib tashlash
    const populatedGroups = groups.filter((g) => g.items.length > 0);

    return NextResponse.json({
      success: true,
      groups: populatedGroups,
      totalCount: records.length,
    });
  } catch (error) {
    console.error("Tarixni olishda xatolik:", error);
    return NextResponse.json(
      { success: false, message: "Serverda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Tizimga kiring" },
        { status: 401 }
      );
    }

    await prisma.scanHistory.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Skanerlash tarixi tozalandi",
    });
  } catch (error) {
    console.error("Tarixni tozalashda xatolik:", error);
    return NextResponse.json(
      { success: false, message: "Serverda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

