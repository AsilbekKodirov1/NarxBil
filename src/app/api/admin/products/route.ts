// src/app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().trim().min(2, "Mahsulot nomi kamida 2 ta belgidan iborat bo'lishi kerak"),
  barcode: z.string().trim().min(4, "Shtrix kod kamida 4 ta raqam bo'lishi kerak"),
  price: z.coerce.number().int().positive("Narx musbat son bo'lishi kerak"),
  discountPrice: z.coerce.number().int().positive().nullable().optional(),
  category: z.string().trim().nullable().optional(),
  imageUrl: z.string().trim().nullable().optional(),
  storeId: z.string().optional(),
});

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search } },
      ];
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    const [total, products, categories] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          store: {
            select: { id: true, name: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.findMany({
        where: { category: { not: null } },
        select: { category: true },
        distinct: ["category"],
      }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      availableCategories: categories.map((c) => c.category).filter(Boolean),
    });
  } catch (error) {
    console.error("Mahsulotlarni olishda xatolik:", error);
    return NextResponse.json(
      { error: "Mahsulotlarni olishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.errorResponse;

  try {
    const body = await req.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Ma'lumotlar noto'g'ri" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Do'konni topish yoki yaratish
    let storeId = data.storeId;
    if (!storeId) {
      const defaultStore = await prisma.store.findFirst();
      if (defaultStore) {
        storeId = defaultStore.id;
      } else {
        const newStore = await prisma.store.create({
          data: {
            name: "Markaziy Do'kon",
            ownerId: auth.session!.user.id,
          },
        });
        storeId = newStore.id;
      }
    }

    // Dublikat shtrix kodni tekshirish
    const existing = await prisma.product.findUnique({
      where: {
        storeId_barcode: {
          storeId: storeId,
          barcode: data.barcode,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `"${data.barcode}" shtrix kodli tovar allaqachon mavjud (${existing.name}). Iltimos, boshqa kod kiriting yoki mavjudini tahrirlang.`,
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        storeId,
        name: data.name,
        barcode: data.barcode,
        price: data.price,
        discountPrice: data.discountPrice || null,
        category: data.category || null,
        imageUrl: data.imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Mahsulot qo'shishda xatolik:", error);
    return NextResponse.json(
      { error: "Mahsulot qo'shishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

