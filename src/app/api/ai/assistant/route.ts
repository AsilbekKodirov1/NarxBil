// src/app/api/ai/assistant/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CartItemDto {
  name: string;
  category?: string;
  price: number;
  quantity: number;
}

// Lokal aqlli retsept va maslahat generatori (Gemini kaliti bo'lmaganda ishlaydi)
function generateSmartFallback(type: string, items: CartItemDto[], prompt?: string): string {
  const itemNames = items.map((i) => i.name.toLowerCase());
  const hasMeat = itemNames.some((n) => n.includes("go'sht") || n.includes("gosht") || n.includes("lahm") || n.includes("farsh") || n.includes("tovuq"));
  const hasRice = itemNames.some((n) => n.includes("guruch") || n.includes("alanga") || n.includes("lazer"));
  const hasFlour = itemNames.some((n) => n.includes("un") || n.includes("makfa"));
  const hasMilk = itemNames.some((n) => n.includes("sut") || n.includes("musaffo") || n.includes("tvorog"));
  const hasOil = itemNames.some((n) => n.includes("yog'") || n.includes("yog") || n.includes("semechka"));
  const hasSugar = itemNames.some((n) => n.includes("shakar") || n.includes("qand"));
  const hasVegetable = itemNames.some((n) => n.includes("kartoshka") || n.includes("piyoz") || n.includes("sabzi") || n.includes("pomidor"));

  if (type === "recipe") {
    if (hasRice && (hasMeat || hasOil)) {
      return `### 🍲 Tavsiya: Mazali O'zbekcha Osh (Palov)
Savatingizda palovning asosiy masalliqlari mavjud!

**📋 Kerakli masalliqlar:**
- Guruch, Go'sht, Sabzi, Piyoz, Yog'
- *Do'kondan olish tavsiya etiladi:* Zira, mosh yoki no'xat, mayiz

**👨‍🍳 Tayyorlash ketma-ketligi:**
1. Qozonda yog'ni qizdirib, go'shtni tillarang bo'lguncha qovuring.
2. Piyoz va somoncha to'g'ralgan sabzini qo'shib, zirvakni 20-25 daqiqa past olovda qaynating.
3. Yuvilgan guruchni solib, suvini tortgach, 20 daqiqa dimlab qo'ying.
Yoqimli ishtaha!`;
    }

    if (hasMeat && hasVegetable) {
      return `### 🥘 Tavsiya: Qovurma Sho'rva yoki Dimlama
Savatingizdagi go'sht va sabzavotlardan to'yimli va foydali kechki ovqat tayyorlash mumkin.

**📋 Kerakli masalliqlar:**
- Go'sht, Kartoshka, Sabzi, Piyoz
- *Do'kondan olish tavsiya etiladi:* Ko'katlar (kashnich, ukrop), tomat pastasi

**👨‍🍳 Tayyorlash ketma-ketligi:**
1. Go'sht va piyozni qizigan yog'da 10 daqiqa qovuring.
2. Yirik to'g'ralgan kartoshka va sabzini solib, biroz aralashtiring.
3. Qozon qopqog'ini zich yopib, past olovda 40-50 daqiqa dimlang.
Dasturxonga yangi uzilgan non va ko'katlar bilan torting!`;
    }

    if (hasFlour && (hasMilk || hasSugar)) {
      return `### 🥞 Tavsiya: Mayin Qatlama yoki Blinchik
Savatingizdagi sut va un mahsulotlaridan oilaviy nonushta uchun ajoyib yegulik tayyorlasa bo'ladi!

**📋 Masalliqlar:**
- Un, Sut, Shakar, Yog'
- *Do'kondan olish tavsiya etiladi:* Tuxum (agar savatda bo'lmasa), asal yoki murabbo

**👨‍🍳 Tayyorlash:**
1. Sut, un va shakarni aralashtirib quyuqroq suyuq xamir hosil qiling.
2. Qizdirilgan tovada ikkala tomonini 1-2 daqiqadan qizartirib oling.
3. Issiq choy yoki qahva bilan dasturxonga torting!`;
    }

    return `### 🥗 Tavsiya: Foydali va Yengil Kechki Taom
Savatingizdagi mahsulotlar asosida ajoyib taom tayyorlash mumkin!

**💡 Tavsiyalar:**
- Mahsulotlarni me'yorida aralashtirib, yangi ko'katlar va ziravorlar qo'shsangiz ta'mi yanada boy bo'ladi.
- Supermarketdan yangi sabzavotlar yoki sevimli sousingizni qo'shib olishni unutmang.
- Tayyorlash jarayonida ortiqcha yog' ishlatmaslik organizm uchun juda foydali!`;
  }

  if (type === "budget_advice") {
    return `### 💡 Smart Tejamkorlik Tahlili
Savatingizdagi xaridlar tahlil qilindi:

1. **Aksiyali tovarlar:** Chegirmadagi mahsulotlarni tanlaganingiz uchun pulingiz tejalmoqda.
2. **Katta qadoq tejamkorligi:** Un, shakar va yog' kabi mahsulotlarni 1 kg emas, 5 kg yoki 5 litrlik qadoqda olish har bir kilogramm uchun 10-15% tejaydi.
3. **Mavsumiy tovarlar:** Mavsumiy meva va sabzavotlar narxi doimo arzonroq va vitaminlarga boy bo'ladi.
4. **Ro'yxat bo'yicha xarid:** Belgilangan byudjet doirasida qolish uchun faqat rejadagi tovarlarni oling.`;
  }

  // Custom prompt
  return `### 🤖 NarxBil AI Yordamchisi
Sizning savolingiz: *"${prompt || "Xaridlar bo'yicha maslahat"}"*

**💡 Maslahat:**
- Supermarketda xarid qilayotganda doimo mahsulotning yaroqlilik muddati va qadog'ining butunligiga e'tibor bering.
- Narxlarni solishtirish uchun mahsulot shtrix kodini NarxBil skaneridan o'tkazing.
- O'zingiz qidirayotgan mahsulot haqida ko'proq ma'lumot olish uchun admin yoki do'kon xodimlaridan ham so'rashingiz mumkin!`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type = "recipe", items = [], budget, prompt } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Agar Gemini API kaliti mavjud bo'lsa, haqiqiy Gemini modeliga so'rov yuborish
    if (apiKey && apiKey.trim() !== "") {
      const itemsText = items.map((i: CartItemDto) => `${i.name} (${i.quantity} dona, ${i.price} so'm)`).join(", ");
      
      const systemPrompt = "Siz O'zbekistondagi OPTOVIK.UZ supermarket ilovasining aqlli oshpaz va xarid yordamchisisiz. Javoblarni faqat o'zbek tilida, do'stona, aniq va chiroyli Markdown formatida bering.";
      let userQuery = "";

      if (type === "recipe") {
        userQuery = `Mening savatimda quyidagi tovarlar bor: ${itemsText}. Ushbu tovarlardan o'zbek oshxonasi yoki zamonaviy mazali qanday taom pishirish mumkin? Kerakli masalliqlar, tayyorlash qadamlari va supermarketdan yana nimalar qo'shib olish kerakligini yozing.`;
      } else if (type === "budget_advice") {
        userQuery = `Mening savatimdagi tovarlar: ${itemsText}. Belgilangan byudjet: ${budget || "ko'rsatilmagan"} so'm. Pulingizni tejash bo'yicha amaliy maslahatlar bering.`;
      } else {
        userQuery = prompt || "Xaridlar bo'yicha foydali maslahat bering.";
      }

      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemPrompt}\n\n${userQuery}` }] }],
            }),
          }
        );

        const geminiData = await geminiRes.json();
        const aiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiText) {
          return NextResponse.json({ success: true, text: aiText, source: "gemini" });
        }
      } catch (geminiErr) {
        console.warn("Gemini so'rovida xatolik, fallback ishlatiladi:", geminiErr);
      }
    }

    // Zaxira aqlli o'zbekcha javob generatori
    const fallbackText = generateSmartFallback(type, items, prompt);
    return NextResponse.json({ success: true, text: fallbackText, source: "smart_assistant" });
  } catch (err) {
    console.error("AI Assistant API xatosi:", err);
    return NextResponse.json(
      { success: false, message: "AI xizmati bilan aloqada xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

