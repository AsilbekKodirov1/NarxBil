// src/lib/scanHistory.ts
// Mahalliy skanerlash tarixi (Mehmon va tizimga kirgan foydalanuvchilar uchun)

export interface HistoryProduct {
  id: string;
  name: string;
  barcode: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string | null;
  category?: string | null;
  storeName?: string | null;
  store?: { name?: string | null };
}

export interface HistoryItemRecord {
  id: string;
  scannedAt: string;
  timeFormatted: string;
  product: {
    id: string;
    name: string;
    barcode: string;
    price: number;
    priceFormatted: string;
    discountPrice: number | null;
    discountPriceFormatted: string | null;
    imageUrl: string | null;
    category: string | null;
    storeName: string | null;
  };
}

export interface HistoryGroupRecord {
  title: string;
  items: HistoryItemRecord[];
}

const LOCAL_HISTORY_KEY = "narxbil_scan_history_v1";

export function getLocalScanHistory(): HistoryItemRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalScanHistory(product: HistoryProduct): HistoryItemRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getLocalScanHistory();
    const now = new Date();
    const storeName = product.storeName || product.store?.name || null;

    const newItem: HistoryItemRecord = {
      id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      scannedAt: now.toISOString(),
      timeFormatted: now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
      product: {
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        priceFormatted: `${product.price.toLocaleString("uz-UZ")} so'm`,
        discountPrice: product.discountPrice ?? null,
        discountPriceFormatted: product.discountPrice
          ? `${product.discountPrice.toLocaleString("uz-UZ")} so'm`
          : null,
        imageUrl: product.imageUrl ?? null,
        category: product.category ?? null,
        storeName,
      },
    };

    // Filter out duplicate if scanned within last 3 minutes, then unshift
    const filtered = current.filter(
      (item) => item.product.id !== product.id || (Date.now() - new Date(item.scannedAt).getTime() > 180000)
    );

    const updated = [newItem, ...filtered].slice(0, 100);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("scan-history-updated"));
    return updated;
  } catch (err) {
    console.warn("Local scan history save error:", err);
    return [];
  }
}

export function clearLocalScanHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_HISTORY_KEY);
    window.dispatchEvent(new Event("scan-history-updated"));
  } catch (err) {
    console.warn("Local history clear error:", err);
  }
}

export function groupHistoryRecords(
  items: HistoryItemRecord[],
  titles = { today: "Bugun", yesterday: "Kecha", week: "Oxirgi 7 kun", earlier: "Avvalroq" }
): HistoryGroupRecord[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const weekStart = todayStart - 7 * 86400000;

  const groups: Record<string, HistoryItemRecord[]> = {
    [titles.today]: [],
    [titles.yesterday]: [],
    [titles.week]: [],
    [titles.earlier]: [],
  };

  for (const item of items) {
    const time = new Date(item.scannedAt).getTime();
    if (time >= todayStart) {
      groups[titles.today].push(item);
    } else if (time >= yesterdayStart) {
      groups[titles.yesterday].push(item);
    } else if (time >= weekStart) {
      groups[titles.week].push(item);
    } else {
      groups[titles.earlier].push(item);
    }
  }

  return Object.entries(groups)
    .filter(([_, list]) => list.length > 0)
    .map(([title, list]) => ({ title, items: list }));
}
