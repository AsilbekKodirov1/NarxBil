// src/lib/cart.ts
// Mijoz savatini boshqarish (LocalStorage asosida)

export interface CartProduct {
  id: string;
  name: string;
  barcode: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string | null;
  category: string | null;
}

export interface CartItem extends CartProduct {
  quantity: number;
  addedAt: string;
}

const CART_STORAGE_KEY = "narxbil_cart_v1";

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  } catch (err) {
    console.error("Savatni saqlashda xatolik:", err);
  }
}

export function addToCart(product: CartProduct, quantity: number = 1): CartItem[] {
  const current = getCartFromStorage();
  const existingIndex = current.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    current[existingIndex].quantity += quantity;
  } else {
    current.push({
      ...product,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }

  saveCartToStorage(current);
  return current;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  let current = getCartFromStorage();
  if (quantity <= 0) {
    current = current.filter((item) => item.id !== productId);
  } else {
    current = current.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
  }
  saveCartToStorage(current);
  return current;
}

export function removeFromCart(productId: string): CartItem[] {
  const current = getCartFromStorage().filter((item) => item.id !== productId);
  saveCartToStorage(current);
  return current;
}

export function clearCart(): void {
  saveCartToStorage([]);
}

export function calculateCartTotal(items: CartItem[]): {
  totalItems: number;
  totalSum: number;
  totalSavings: number;
} {
  return items.reduce(
    (acc, item) => {
      const activePrice = item.discountPrice ?? item.price;
      const savingsPerItem = item.discountPrice ? item.price - item.discountPrice : 0;
      return {
        totalItems: acc.totalItems + item.quantity,
        totalSum: acc.totalSum + activePrice * item.quantity,
        totalSavings: acc.totalSavings + savingsPerItem * item.quantity,
      };
    },
    { totalItems: 0, totalSum: 0, totalSavings: 0 }
  );
}

