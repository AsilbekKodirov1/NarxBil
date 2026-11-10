// src/lib/ordersStore.ts

export interface OrderItemRecord {
  id: string;
  name: string;
  barcode: string;
  price: number;
  discountPrice?: number | null;
  quantity: number;
  category?: string | null;
}

export interface OrderRecord {
  orderCode: string;
  items: OrderItemRecord[];
  totalSum: number;
  totalSavings: number;
  totalItems: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  paidAt?: string | null;
}

// Global orders in-memory cache (persists during server lifetime)
declare global {
  var __narxbil_orders: Map<string, OrderRecord> | undefined;
}

const ordersMap = globalThis.__narxbil_orders || new Map<string, OrderRecord>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__narxbil_orders = ordersMap;
} else if (!globalThis.__narxbil_orders) {
  globalThis.__narxbil_orders = ordersMap;
}

export function saveOrder(order: Omit<OrderRecord, "status" | "createdAt">): OrderRecord {
  const newOrder: OrderRecord = {
    ...order,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  ordersMap.set(order.orderCode.toUpperCase(), newOrder);
  return newOrder;
}

export function getOrder(orderCode: string): OrderRecord | null {
  const code = orderCode.trim().toUpperCase();
  return ordersMap.get(code) || null;
}

export function markOrderAsPaid(orderCode: string): OrderRecord | null {
  const order = getOrder(orderCode);
  if (!order) return null;
  order.status = "PAID";
  order.paidAt = new Date().toISOString();
  ordersMap.set(order.orderCode, order);
  return order;
}

export function listRecentOrders(): OrderRecord[] {
  return Array.from(ordersMap.values()).reverse().slice(0, 50);
}

