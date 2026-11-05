// src/lib/auth.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Yaroqli email manzilini kiriting"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

// Google kalitlari mavjudligini xavfsiz tekshirish
const isGoogleAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID.trim() !== "" &&
  process.env.GOOGLE_CLIENT_SECRET.trim() !== ""
);

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 kun
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    // 1. Email va Parol bilan kirish
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email va parolni kiriting");
        }

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message || "Noto'g'ri ma'lumotlar");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Email yoki parol noto'g'ri");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Email yoki parol noto'g'ri");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatarUrl,
          role: user.role,
        };
      },
    }),

    // 2. Google OAuth (faqat kalitlar to'liq bo'lsa faollashadi)
    ...(isGoogleAuthEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const email = user.email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          // Yangi foydalanuvchini bazada yaratish
          const newUser = await prisma.user.create({
            data: {
              email,
              fullName: user.name || "Foydalanuvchi",
              googleId: account.providerAccountId,
              avatarUrl: user.image,
              role: Role.CUSTOMER,
            },
          });
          user.id = newUser.id;
          (user as { role?: string }).role = newUser.role;
        } else {
          // Mavjud bo'lsa, googleId va rasmni yangilash
          if (!existingUser.googleId) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: account.providerAccountId,
                avatarUrl: existingUser.avatarUrl || user.image,
              },
            });
          }
          user.id = existingUser.id;
          (user as { role?: string }).role = existingUser.role;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = ((user as { role?: Role }).role || Role.CUSTOMER) as Role;
        token.fullName = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.name = (token.fullName as string) || session.user.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "narxbil_development_fallback_secret_key",
};

// Google OAuth yoqilgan yoki yo'qligini klientda bilish uchun yordamchi
export const checkGoogleAuthAvailable = () => isGoogleAuthEnabled;

