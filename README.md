# NarxBil — Smart Shtrix Kod Skaneri va Narx Tekshirgich (PWA)

> **"Kassaga bormasdan narxni biling"**  
> Do'konlarda narxi yozilmagan tovarlar shtrix kodini telefon kamerasi orqali 1 soniyada skanerlab, uning rasmi, nomi, do'kondagi aniq narxi va chegirmasini ko'rsatuvchi mobil-first PWA veb-ilova.

---

## 🚀 Tezkor Ishga Tushirish (Quick Start)

Loyihani kompyuteringizda ishga tushirish uchun quyidagi ketma-ketlikni bajaring:

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Muhit o'zgaruvchilari faylini nusxalash
cp .env.example .env

# 3. Bazani ishga tushirish (Docker orqali)
docker compose up -d

# 4. Prisma jadvallarini bazada yaratish
npx prisma migrate dev --name init

# 5. Boshlang'ich 20 ta mahsulot va admin hisobini yuklash
npx prisma db seed

# 6. Dasturni ishlab chiqish rejimida yoqish
npm run dev
```

Brauzerda oching: [http://localhost:3000](http://localhost:3000)  
Skaner sahifasi: [http://localhost:3000/scan](http://localhost:3000/scan)  
Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🗄️ PostgreSQL Ma'lumotlar Bazasini Sozlash (3 ta Yo'l)

Lokal PostgreSQL o'rnatish shart emas. Quyidagi **3 ta variant**dan o'zingizga qulayini tanlang:

### 1-yo'l: Docker orqali lokal ishga tushirish (Tavsiya etiladi)
Loyiha ildizida tayyor `docker-compose.yml` mavjud. Kompyuteringizda Docker Desktop o'rnatilgan bo'lsa:
```bash
docker compose up -d
```
`.env` faylida quyidagi qatorni qoldiring:
```env
DATABASE_URL="postgresql://narxbil_user:narxbil_secret_2026@localhost:5432/narxbil_db?schema=public"
```

---

### 2-yo'l: Neon Serverless PostgreSQL (Bepul bulutli baza)
Agar Docker bo'lmasa, eng tezkor bepul yechim:
1. [neon.tech](https://neon.tech) saytiga kiring va bepul ro'yxatdan o'ting.
2. Yangi loyiha yarating (masalan, `narxbil-db`).
3. Neon Dashboard'da sizga **Connection String** (ulanish satri) taqdim etiladi.
4. Ushbu satrni nusxalang va `.env` faylingizdagi `DATABASE_URL` ga qo'ying:
   ```env
   DATABASE_URL="postgresql://username:password@ep-cool-fog-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   ```
5. `npx prisma migrate dev` va `npx prisma db seed` buyruqlarini bajaring.

---

### 3-yo'l: Supabase PostgreSQL (Bepul bulutli baza)
1. [supabase.com](https://supabase.com) saytiga kiring va yangi loyiha yarating.
2. Baza parolini eslab qoling.
3. Chap menyudan **Project Settings** → **Database** bo'limiga o'ting.
4. **Connection string** bo'limidan **URI** ni tanlang (Mode: `Session` yoki `Transaction`).
5. Ulanish satrini nusxalang va parolingizni kiritib, `.env` ga yozing:
   ```env
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
6. `npx prisma migrate dev` va `npx prisma db seed` buyruqlarini bajaring.

---

## 🔑 Boshlang'ich Hisob Ma'lumotlari (Seed)

`npx prisma db seed` buyrug'i bajarilgach, bazada quyidagilar yaratiladi:

- **Bosh Administrator**:
  - **Email**: `admin@narxbil.uz`
  - **Parol**: `AdminPassword2026!` (yoki `.env` dagi `ADMIN_PASSWORD`)
  - **Roli**: `ADMIN`
- **Namunaviy Do'kon**: *NarxBil Markaziy Supermarket*
- **20 ta real EAN-13 shtrix kodli namunaviy tovarlar**:
  - *Musaffo Sut 1L* — `4780000150123` (11 900 so'm, chegirmada)
  - *Coca-Cola 1.5L* — `5449000000996` (12 900 so'm)
  - *Nestle KitKat 41.5g* — `7613035368545` (7 000 so'm)
  - *Buxanka Non* — `4780023456789` (3 500 so'm)
  - *Ahmad Tea 100g* — `0548810059380` (21 000 so'm)
  - *President Sariyog' 200g* — `3176571991008` (34 500 so'm)
  - *Barilla Spaghetti 500g* — `8076800195057` (18 900 so'm)
  - va boshqalar...

---

## 🌐 Google OAuth orqali Kirishni Sozlash

Ilova Google kalitlarisiz ham xavfsiz ishlayveradi (tugma "Tez orada" holatida ko'rinadi). Google OAuth ni to'liq yoqish uchun:

1. [console.cloud.google.com](https://console.cloud.google.com) manziliga kiring va yangi loyiha (Project) yarating.
2. **APIs & Services** → **OAuth consent screen** bo'limiga o'ting:
   - User Type: **External** tanlang.
   - App name: `NarxBil` (yoki o'z brendingiz).
   - User support email va Developer contact email manzilingizni kiriting.
   - Saqlang va davom eting.
3. **APIs & Services** → **Credentials** bo'limiga o'ting:
   - **Create Credentials** → **OAuth client ID** tugmasini bosing.
   - Application type: **Web application** tanlang.
   - Name: `NarxBil Web Client`.
4. **Authorized JavaScript origins** maydoniga qo'shing:
   - `http://localhost:3000`
5. **Authorized redirect URIs** maydoniga aynan quyidagini qo'shing:
   - `http://localhost:3000/api/auth/callback/google`
6. **Create** tugmasini bosing. Olingan `Client ID` va `Client Secret` ni `.env` faylingizga joylang:
   ```env
   GOOGLE_CLIENT_ID="123456789-xxxxxxxx.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxx"
   ```
7. *Eslatma*: Loyihani haqiqiy serverga (production) joylashtirganda, Google Cloud Console'ga o'zingizning haqiqiy domeningizni (masalan: `https://sizning-saytingiz.uz` va `https://sizning-saytingiz.uz/api/auth/callback/google`) qo'shish kerak bo'ladi.

---

## 🎨 Brend Nomini Oson Almashtirish

"NarxBil" ishchi nom hisoblanadi. Butun ilova bo'ylab brend nomini, logotip matnini, shiorni va ranglarni bir zumda o'zgartirish uchun **yagona markaziy fayl** mavjud:

👉 [`src/config/brand.ts`](src/config/brand.ts)

Ushbu fayldagi qiymatlarni tahrirlashingiz kifoya:

```typescript
export const BRAND_CONFIG = {
  name: "YangiNom",           // Ilova nomi (barcha sarlavhalar va logotip o'zgaradi)
  shortName: "YangiNom",      // PWA qisqa nomi
  domain: "yanginom.uz",      // Domen
  tagline: "Sizning shioringiz", 
  description: "Ilova tavsifi...",
  email: "admin@yanginom.uz", // Seed va xatlar uchun admin emaili
  
  // Ranglar va gradientlar
  colors: {
    primary: "#7C3AED",
    secondary: "#EC4899",
    accent: "#F59E0B",
    ...
  }
};
```

Boshqa hech qaysi faylni tahrirlash shart emas — barcha sahifalar, meta teglar, `manifest.json`, logotip va admin paneli ushbu fayldan avtomatik o'qiydi!

---

## 🛠️ Texnologiyalar To'plami

- **Fremvork**: Next.js 14/16 (App Router) + TypeScript
- **Stil va UI**: Tailwind CSS v4, Glassmorphism, Lucide-react
- **Animatsiyalar**: Framer Motion (sahifa o'tishlari, skaner lazeri, raqamlar hisoblagichi, 3D telefon mockup)
- **Ma'lumotlar bazasi**: PostgreSQL + Prisma ORM (indekslangan shtrix kodlar)
- **Autentifikatsiya**: NextAuth.js (bcryptjs bilan xavfsiz heshlangan parollar, Google OAuth, mehmon rejimi)
- **Shtrix kod skaneri**: `html5-qrcode` & `@zxing/browser` (EAN-13, EAN-8, Code128, UPC-A, fonar, kamera almashish)
- **Grafiklar**: Recharts (haftalik trendlar va top mahsulotlar)
- **Rasm yuklash**: Lokal `/public/uploads` (3MB cheklov, faqat JPG/PNG/WEBP, tasodifiy nomlash, S3/Cloudinary uchun ochiq abstraksiya)
- **PWA**: `manifest.json`, Service Worker kesh, `beforeinstallprompt` o'rnatish taklifi

---

## 📂 Loyiha Tuzilishi

```
price-checker/
├── prisma/
│   ├── schema.prisma          # PostgreSQL jadvallar sxemasi
│   └── seed.ts                # 20 ta namunaviy tovar va admin seed
├── public/
│   ├── icons/                 # PWA ikonkalar
│   ├── uploads/               # Yuklangan mahsulot rasmlari
│   ├── manifest.json          # PWA manifest fayli
│   └── sw.js                  # Service Worker oflayn kesh
├── src/
│   ├── app/
│   │   ├── (auth)/login/      # Tizimga kirish sahifasi
│   │   ├── (auth)/register/   # Ro'yxatdan o'tish sahifasi
│   │   ├── admin/             # Admin Dashboard va Mahsulotlar jadvali
│   │   ├── api/               # NextAuth, Skaner, Mahsulotlar, CSV va Upload API lari
│   │   ├── cart/              # Xarid savati va hisoblagich
│   │   ├── history/           # Skanerlash tarixi (kunlar bo'yicha)
│   │   ├── scan/              # Shtrix kod skanerlash sahifasi
│   │   ├── layout.tsx         # Asosiy layout, shriftlar va providerlar
│   │   └── page.tsx           # Bosh sahifa (Landing)
│   ├── components/
│   │   ├── admin/             # Admin sidebar, jadvallar, CSV import, Recharts grafiklar
│   │   ├── brand/             # Markaziy Logo komponenti
│   │   ├── home/              # 3D Animatsiyali Telefon Mockup
│   │   ├── layout/            # Navbar va Mobil pastki dock (BottomNav)
│   │   ├── pwa/               # PwaManager (o'rnatish taklifi)
│   │   ├── scanner/           # BarcodeScanner, BottomSheet, ManualInput
│   │   └── ui/                # AnimatedCounter, Toast bildirishnomalar
│   ├── config/
│   │   └── brand.ts           # Yagona markaziy brend sozlamalari
│   ├── lib/
│   │   ├── admin.ts           # Admin rolini serverda himoyalash
│   │   ├── audio.ts           # Web Audio API skaner tovushi (chime)
│   │   ├── auth.ts            # NextAuth konfiguratsiyasi
│   │   ├── cart.ts            # LocalStorage savat boshqaruvi
│   │   ├── prisma.ts          # Singleton Prisma mijoz
│   │   └── storage.ts         # Rasm yuklash va tekshirish abstraksiyasi
├── docker-compose.yml         # PostgreSQL 16 Docker konteyneri
├── .env.example               # Muhit o'zgaruvchilari namunasi
└── package.json
```

---

## 👨‍💻 Ishlab Chiqish va Sinov

```bash
# Kod sifatini tekshirish
npm run lint

# Loyihani production uchun yig'ish
npm run build

# Yig'ilgan loyihani ishga tushirish
npm run start
```
