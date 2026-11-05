// src/app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { uploadImage } from "@/lib/storage";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Rasm fayli yuborilmadi" },
        { status: 400 }
      );
    }

    const result = await uploadImage(file);
    return NextResponse.json({ success: true, url: result.url });
  } catch (error: unknown) {
    console.error("Rasm yuklashda xatolik:", error);
    const msg = error instanceof Error ? error.message : "Rasm yuklashda xatolik";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

