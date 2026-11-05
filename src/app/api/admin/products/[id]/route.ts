// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().trim().min(2, "Mahsulot nomi kamida 2 ta belgidan iborat bo'lishi kerak"),
  barcode: z.string().trim().min(4, "Shtrix kod kamida 4 ta raqam bo'lishi kerak"),
  price: z.coerce.number().int().positive("Narx musbat son bo'lishi kerak"),
  discountPrice: z.coerce.number().int().positive().nullable().optional(),
  category: z.string().trim().nullable().optional(),
  imageUrl: z.string().trim().nullable().optional(),
});

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.errorResponse;

  try {
    const params = await props.params;
    const id = params.id;
    const body = await req.json();

    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Ma'lumotlar noto'g'ri" },
        { status: 400 }
      );
    }

    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
    }

    const data = result.data;

    // Agar shtrix kod o'zgartirilgan bo'lsa, boshqa tovar bilan dublikat emasligini tekshirish
    if (data.barcode !== current.barcode) {
      const duplicate = await prisma.product.findFirst({
        where: {
          storeId: current.storeId,
          barcode: data.barcode,
          id: { not: id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: `"${data.barcode}" shtrix kodli boshqa mahsulot mavjud` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        barcode: data.barcode,
        price: data.price,
        discountPrice: data.discountPrice || null,
        category: data.category || null,
        imageUrl: data.imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Mahsulotni yangilashda xatolik:", error);
    return NextResponse.json(
      { error: "Mahsulotni yangilashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.errorResponse;

  try {
    const params = await props.params;
    const id = params.id;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Mahsulot muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error("Mahsulotni o'chirishda xatolik:", error);
    return NextResponse.json(
      { error: "Mahsulotni o'chirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

