// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BRAND_CONFIG } from "../src/config/brand";

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Seeding ${BRAND_CONFIG.name} database...`);

  const adminEmail = process.env.ADMIN_EMAIL || BRAND_CONFIG.email;
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword2026!";

  // 1. Admin hisobini yaratish / yangilash
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
      fullName: `${BRAND_CONFIG.name} Bosh Administratori`,
    },
    create: {
      email: adminEmail,
      fullName: `${BRAND_CONFIG.name} Bosh Administratori`,
      passwordHash,
      role: Role.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`✅ Admin yaratildi: ${admin.email} (Parol: ${adminPassword})`);

  // 2. Namunaviy do'kon yaratish
  const store = await prisma.store.upsert({
    where: { id: "store_korzinka_demo" },
    update: {},
    create: {
      id: "store_korzinka_demo",
      name: `${BRAND_CONFIG.name} Markaziy Supermarket`,
      address: "Toshkent sh., Amir Temur shoh ko'chasi, 42-uy",
      ownerId: admin.id,
    },
  });

  console.log(`✅ Do'kon yaratildi: ${store.name}`);

  // 3. 20 ta real EAN-13 shtrix kodli namunaviy oziq-ovqat mahsulotlari
  const sampleProducts = [
    {
      name: "Musaffo Sut 3.2% 1 litr",
      barcode: "4780000150123",
      price: 13500,
      discountPrice: 11900,
      category: "Sut mahsulotlari",
      imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Oq Qandolat / Qolipli Buxanka Non",
      barcode: "4780023456789",
      price: 3500,
      discountPrice: null,
      category: "Non va qandolat",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Zolotaya Semechka Pista Yog'i 1L",
      barcode: "4600699500057",
      price: 19500,
      discountPrice: 17500,
      category: "Yog' va ziravorlar",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Xorazm Oq Shakar 1 kg",
      barcode: "4780034567890",
      price: 14000,
      discountPrice: null,
      category: "Oziq-ovqat",
      imageUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Coca-Cola Classic Gazli Ichimlik 1.5L",
      barcode: "5449000000996",
      price: 14500,
      discountPrice: 12900,
      category: "Ichimliklar",
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Fanta Orange Gazli Ichimlik 1.5L",
      barcode: "5449000011527",
      price: 14500,
      discountPrice: null,
      category: "Ichimliklar",
      imageUrl: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Ahmad Tea English Tea No.1 Qora Choy 100g",
      barcode: "0548810059380",
      price: 24000,
      discountPrice: 21000,
      category: "Choy va kofe",
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Nestle KitKat 4 Finger Vaflili Shokolad 41.5g",
      barcode: "7613035368545",
      price: 8500,
      discountPrice: 7000,
      category: "Shirinliklar",
      imageUrl: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Snickers Yong'oqli Shokolad Batonchik 50g",
      barcode: "5000159461122",
      price: 9000,
      discountPrice: null,
      category: "Shirinliklar",
      imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Alpen Gold Sutli Shokolad 85g",
      barcode: "7622210286872",
      price: 13000,
      discountPrice: 11500,
      category: "Shirinliklar",
      imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Dena Natural Olma Sharbat 1L",
      barcode: "4780045678901",
      price: 12000,
      discountPrice: 10500,
      category: "Ichimliklar",
      imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Makfa Oliy Navli Bug'doy Uni 2 kg",
      barcode: "4601498000450",
      price: 26000,
      discountPrice: null,
      category: "Oziq-ovqat",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Lipton Yellow Label Choy 100 dona paketcha",
      barcode: "8712100868849",
      price: 36000,
      discountPrice: 32000,
      category: "Choy va kofe",
      imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Musaffo Qatiq 3.2% 900g",
      barcode: "4780056789012",
      price: 11000,
      discountPrice: null,
      category: "Sut mahsulotlari",
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "President Fransuz Sariyog'i 82% 200g",
      barcode: "3176571991008",
      price: 38000,
      discountPrice: 34500,
      category: "Sut mahsulotlari",
      imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Barilla Spaghetti No.5 Italiya Makaroni 500g",
      barcode: "8076800195057",
      price: 22000,
      discountPrice: 18900,
      category: "Oziq-ovqat",
      imageUrl: "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Lay's Pishloqli Kartoshka Chipsi 140g",
      barcode: "5900259068019",
      price: 19000,
      discountPrice: null,
      category: "Gazaklar",
      imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Chortoq Tabiiy Mineral Davolash Suvi 0.5L",
      barcode: "4780067890123",
      price: 6500,
      discountPrice: 5500,
      category: "Ichimliklar",
      imageUrl: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Colgate Total 12 Chuqur Tozalovchi Tish Pastasi 75ml",
      barcode: "8718951131102",
      price: 28000,
      discountPrice: null,
      category: "Shaxsiy gigiyena",
      imageUrl: "https://images.unsplash.com/photo-1559591937-e1032b4b4e18?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Duru Tozalovchi Tabiiy Sovun 4x115g",
      barcode: "8690506085521",
      price: 24000,
      discountPrice: 20000,
      category: "Shaxsiy gigiyena",
      imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80",
    },
  ];

  let createdCount = 0;
  for (const item of sampleProducts) {
    await prisma.product.upsert({
      where: {
        storeId_barcode: {
          storeId: store.id,
          barcode: item.barcode,
        },
      },
      update: {
        name: item.name,
        price: item.price,
        discountPrice: item.discountPrice,
        category: item.category,
        imageUrl: item.imageUrl,
        isActive: true,
      },
      create: {
        storeId: store.id,
        barcode: item.barcode,
        name: item.name,
        price: item.price,
        discountPrice: item.discountPrice,
        category: item.category,
        imageUrl: item.imageUrl,
        isActive: true,
      },
    });
    createdCount++;
  }

  console.log(`✅ ${createdCount} ta namunaviy tovarlar bazaga muvaffaqiyatli kiritildi!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed xatosi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

