// src/app/api/products/barcode/[code]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BRAND_CONFIG } from "@/config/brand";

export async function GET(
  req: Request,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const params = await props.params;
    const barcode = params.code?.trim();

    if (!barcode) {
      return NextResponse.json(
        { success: false, message: "Shtrix kod kiritilmadi" },
        { status: 400 }
      );
    }

    // Bazadan mahsulotni qidirish
    const product = await prisma.product.findFirst({
      where: {
        barcode: barcode,
        isActive: true,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Ushbu shtrix kodli mahsulot bazada topilmadi",
          barcode,
        },
        { status: 404 }
      );
    }

    // Foydalanuvchi tizimga kirgan bo'lsa, skanerlash tarixiga yozish
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      try {
        await prisma.scanHistory.create({
          data: {
            productId: product.id,
            userId: session.user.id,
          },
        });
      } catch (historyErr) {
        console.warn("Scan history yozishda xatolik:", historyErr);
      }
    }

    // Chegirma foizini hisoblash
    let discountPercent: number | null = null;
    if (product.discountPrice && product.discountPrice < product.price) {
      discountPercent = Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        priceFormatted: BRAND_CONFIG.currency.format(product.price),
        discountPrice: product.discountPrice,
        discountPriceFormatted: product.discountPrice
          ? BRAND_CONFIG.currency.format(product.discountPrice)
          : null,
        discountPercent,
        imageUrl: product.imageUrl,
        category: product.category,
        store: product.store,
        updatedAt: product.updatedAt,
      },
      disclaimer: BRAND_CONFIG.priceDisclaimer,
    });
  } catch (error) {
    console.error("Mahsulot qidirishda xatolik:", error);
    return NextResponse.json(
      { success: false, message: "Serverda kutilmagan xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

