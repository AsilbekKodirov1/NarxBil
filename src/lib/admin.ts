// src/lib/admin.ts
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export type AdminAuthResult =
  | { authorized: false; errorResponse: NextResponse }
  | { authorized: true; session: Session };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: "Tizimga kirilmagan. Avtorizatsiyadan o'ting." },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: "Ruxsat etilmagan. Faqat administratorlar kirishi mumkin." },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, session };
}
