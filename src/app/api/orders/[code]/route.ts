// src/app/api/orders/[code]/route.ts
import { NextResponse } from "next/server";
import { getOrder, markOrderAsPaid } from "@/lib/ordersStore";

export async function GET(
  _req: Request,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const cleanCode = code?.trim().toUpperCase();

    if (!cleanCode) {
      return NextResponse.json(
        { success: false, message: "Kassa kodi ko'rsatilmadi" },
        { status: 400 }
      );
    }

    const order = getOrder(cleanCode);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: `Kassa kodi #${cleanCode} bo'yicha buyurtma topilmadi yoki muddati o'tgan`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Buyurtmani qidirishda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await props.params;
    const body = await req.json().catch(() => ({}));
    const cleanCode = code?.trim().toUpperCase();

    if (!cleanCode) {
      return NextResponse.json(
        { success: false, message: "Kassa kodi ko'rsatilmadi" },
        { status: 400 }
      );
    }

    if (body.action === "pay") {
      const updated = markOrderAsPaid(cleanCode);
      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Buyurtma topilmadi" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "To'lov qabul qilindi va chek yopildi",
        order: updated,
      });
    }

    return NextResponse.json(
      { success: false, message: "Noma'lum amal" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { success: false, message: "Buyurtmani yangilashda xatolik" },
      { status: 500 }
    );
  }
}

