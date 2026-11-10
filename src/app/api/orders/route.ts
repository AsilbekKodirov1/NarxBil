// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { saveOrder, listRecentOrders } from "@/lib/ordersStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderCode, items, totalSum, totalSavings, totalItems } = body;

    if (!orderCode || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Buyurtma ma'lumotlari to'liq emas" },
        { status: 400 }
      );
    }

    const order = saveOrder({
      orderCode,
      items,
      totalSum: Number(totalSum) || 0,
      totalSavings: Number(totalSavings) || 0,
      totalItems: Number(totalItems) || items.length,
    });

    return NextResponse.json({
      success: true,
      message: "Buyurtma kassa tizimida saqlandi",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Serverda buyurtmani saqlashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = listRecentOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Order list error:", error);
    return NextResponse.json(
      { success: false, message: "Buyurtmalarni olishda xatolik" },
      { status: 500 }
    );
  }
}

