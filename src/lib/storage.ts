// src/lib/storage.ts
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  // 1. Hajmni tekshirish
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Rasm hajmi 3 MB dan oshmasligi kerak");
  }

  // 2. Formatni tekshirish
  const ext = ALLOWED_MIME_TYPES[file.type];
  if (!ext) {
    throw new Error("Faqat JPG, PNG yoki WEBP formatidagi rasmlar qabul qilinadi");
  }

  // 3. Tasodifiy unikal nom yaratish
  const randomName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Jild mavjudligini ta'minlash
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, randomName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // Lokal URL (kelajakda Cloudinary / S3 ga almashtirish mumkin)
  const publicUrl = `/uploads/${randomName}`;

  return {
    url: publicUrl,
    filename: randomName,
    size: file.size,
  };
}

