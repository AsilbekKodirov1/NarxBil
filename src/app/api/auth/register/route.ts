// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak")
      .max(100, "Ism juda uzun"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Yaroqli email manzilini kiriting"),
    password: z
      .string()
      .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      .max(100, "Parol juda uzun"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar bir xil emas",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Ma'lumotlar noto'g'ri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { fullName, email, password } = result.data;

    // Mavjud foydalanuvchini tekshirish
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email bilan allaqachon ro'yxatdan o'tilgan" },
        { status: 400 }
      );
    }

    // Parolni heshlash
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Bazaga saqlash
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi!",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ro'yxatdan o'tishda xatolik:", error);
    return NextResponse.json(
      { error: "Serverda kutilmagan xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}

