// src/app/api/admin/import/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textContent = (formData.get("csvText") as string) || "";

    let rawData = "";

    if (file) {
      rawData = await file.text();
    } else if (textContent) {
      rawData = textContent;
    } else {
      return NextResponse.json(
        { error: "CSV fayl yoki matn yuborilmadi" },
        { status: 400 }
      );
    }

    const lines = rawData
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV kamida 1 ta sarlavha va 1 ta ma'lumot qatoridan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    // Sarlavhani tahlil qilish
    const headerLine = lines[0].toLowerCase();
    const delimiter = headerLine.includes(";") ? ";" : ",";
    const headers = headerLine.split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ""));

    const nameIdx = headers.findIndex((h) => h.includes("nom") || h.includes("name") || h.includes("mahsulot"));
    const barcodeIdx = headers.findIndex((h) => h.includes("shtrix") || h.includes("barcode") || h.includes("kod"));
    const priceIdx = headers.findIndex((h) => h.includes("narx") || h.includes("price"));
    const discountIdx = headers.findIndex((h) => h.includes("chegirma") || h.includes("discount"));
    const categoryIdx = headers.findIndex((h) => h.includes("kategoriya") || h.includes("category"));

    if (nameIdx === -1 || barcodeIdx === -1 || priceIdx === -1) {
      return NextResponse.json(
        {
          error:
            "CSV ustunlarida 'nom', 'shtrix kod' va 'narx' ustunlari bo'lishi shart. Masalan: nom,shtrix,narx,kategoriya",
        },
        { status: 400 }
      );
    }

    // Do'konni topish
    const store = await prisma.store.findFirst();
    if (!store) {
      return NextResponse.json({ error: "Do'kon topilmadi" }, { status: 404 });
    }

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));

      const name = cols[nameIdx];
      const barcode = cols[barcodeIdx]?.replace(/[^0-9A-Za-z]/g, "");
      const priceRaw = cols[priceIdx]?.replace(/[^0-9]/g, "");
      const price = priceRaw ? parseInt(priceRaw, 10) : 0;

      const discountRaw = discountIdx !== -1 ? cols[discountIdx]?.replace(/[^0-9]/g, "") : null;
      const discountPrice = discountRaw ? parseInt(discountRaw, 10) : null;
      const category = categoryIdx !== -1 ? cols[categoryIdx] : null;

      if (!name || !barcode || !price || isNaN(price)) {
        errors.push(`${i}-qator: Nomi, shtrix kodi yoki narxi yaroqsiz`);
        continue;
      }

      try {
        await prisma.product.upsert({
          where: {
            storeId_barcode: {
              storeId: store.id,
              barcode,
            },
          },
          update: {
            name,
            price,
            discountPrice,
            category: category || undefined,
            isActive: true,
          },
          create: {
            storeId: store.id,
            barcode,
            name,
            price,
            discountPrice,
            category: category || null,
            isActive: true,
          },
        });
        successCount++;
      } catch (err: unknown) {
        errors.push(`${i}-qator (${name}): Saqlashda xatolik (${err instanceof Error ? err.message : String(err)})`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${successCount} ta mahsulot muvaffaqiyatli import qilindi`,
      importedCount: successCount,
      errorCount: errors.length,
      errors: errors.slice(0, 15), // Eng muhim xatoliklar
    });
  } catch (error) {
    console.error("CSV import xatosi:", error);
    return NextResponse.json(
      { error: "CSV faylni qayta ishlashda kutilmagan xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

