"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { asRecord, toDate } from "@/lib/firestore";
import { auth, firestore } from "@/lib/firebase";
import type { CartLine, MenuItem, Order, OrderStatus, OrderType } from "@/lib/types";

const GUEST_ORDER_KEY = "fair-pos-guest-orders";

function ordersCol() {
  return collection(firestore, COLLECTIONS.orders);
}

function orderDoc(id: string) {
  return doc(firestore, COLLECTIONS.orders, id);
}

function randomQueueNumber() {
  return `A${Math.floor(Math.random() * 900) + 100}`;
}

function randomRefCode() {
  const digits = Math.floor(Math.random() * 90000) + 10000;
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const suffix =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)];
  return `REF-${digits}-${suffix}`;
}

function toMenuItem(data: Record<string, unknown>): MenuItem {
  return {
    id: String(data.id ?? ""),
    shopId: String(data.shopId ?? ""),
    name: String(data.name ?? ""),
    price: Number(data.price ?? 0),
    image: String(data.image ?? ""),
    category: (data.category as MenuItem["category"]) ?? "เมนูหลัก",
  };
}

function toOrder(id: string, data: Record<string, unknown>): Order {
  const lines = Array.isArray(data.lines)
    ? (data.lines as Record<string, unknown>[]).map((line) => ({
        item: toMenuItem(asRecord(line.item)),
        qty: Number(line.qty ?? 1),
        note: line.note ? String(line.note) : undefined,
      }))
    : [];

  const created = toDate(data.createdAt);

  return {
    id,
    queueNumber: String(data.queueNumber ?? ""),
    refCode: String(data.refCode ?? ""),
    fairId: String(data.fairId ?? ""),
    shopId: String(data.shopId ?? ""),
    userId: data.userId ? String(data.userId) : undefined,
    tableLabel: data.tableLabel ? String(data.tableLabel) : undefined,
    type: (data.type as OrderType) ?? "takeaway",
    lines,
    subtotal: Number(data.subtotal ?? 0),
    tax: Number(data.tax ?? 0),
    total: Number(data.total ?? 0),
    status: (data.status as OrderStatus) ?? "received",
    createdAt: created.toISOString(),
    completedAt: data.completedAt ? toDate(data.completedAt).toISOString() : undefined,
    handledBy: data.handledBy ? String(data.handledBy) : undefined,
    estimatedMinutes: String(data.estimatedMinutes ?? "5 - 10 นาที"),
  };
}

export function rememberGuestOrder(orderId: string) {
  if (typeof window === "undefined") return;
  const ids = new Set(JSON.parse(sessionStorage.getItem(GUEST_ORDER_KEY) ?? "[]") as string[]);
  ids.add(orderId);
  sessionStorage.setItem(GUEST_ORDER_KEY, JSON.stringify([...ids]));
}

export function guestOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(sessionStorage.getItem(GUEST_ORDER_KEY) ?? "[]") as string[];
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const snapshot = await getDoc(orderDoc(orderId));
  if (!snapshot.exists()) return null;
  return toOrder(snapshot.id, snapshot.data());
}

export async function createOrder(input: {
  fairId: string;
  shopId: string;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  total: number;
  type?: OrderType;
  tableLabel?: string;
}): Promise<Order> {
  const userId = auth.currentUser?.uid ?? null;
  if (!userId) {
    throw new Error("กรุณาเข้าสู่ระบบก่อนสั่งอาหาร");
  }
  const payload = {
    fairId: input.fairId,
    shopId: input.shopId,
    userId,
    tableLabel: input.tableLabel ?? null,
    type: input.type ?? "takeaway",
    queueNumber: randomQueueNumber(),
    refCode: randomRefCode(),
    lines: input.lines,
    subtotal: input.subtotal,
    tax: input.tax,
    total: input.total,
    status: "received" as OrderStatus,
    estimatedMinutes: "5 - 10 นาที",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(ordersCol(), payload);
  const created = await getOrder(ref.id);
  if (!created) {
    throw new Error("Failed to create order.");
  }
  return created;
}

export async function listOrdersForShop(shopId: string): Promise<Order[]> {
  const snapshot = await getDocs(query(ordersCol(), where("shopId", "==", shopId)));
  return snapshot.docs
    .map((item) => toOrder(item.id, item.data()))
    .sort((a, b) => b.refCode.localeCompare(a.refCode));
}

export async function listOrdersForUser(userId: string): Promise<Order[]> {
  const snapshot = await getDocs(query(ordersCol(), where("userId", "==", userId)));
  return snapshot.docs.map((item) => toOrder(item.id, item.data()));
}

export async function listOrdersForShopCustomer(
  shopId: string,
  fairId: string,
): Promise<Order[]> {
  const userId = auth.currentUser?.uid;
  if (userId) {
    const snapshot = await getDocs(query(ordersCol(), where("userId", "==", userId)));
    return snapshot.docs
      .map((item) => toOrder(item.id, item.data()))
      .filter((order) => order.shopId === shopId && order.fairId === fairId);
  }

  const guests = await Promise.all(guestOrderIds().map((id) => getOrder(id)));
  return guests.filter((order): order is Order => {
    if (!order) return false;
    return order.shopId === shopId && order.fairId === fairId;
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  handledBy?: string,
): Promise<void> {
  const patch: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };
  if (handledBy) {
    patch.handledBy = handledBy;
  }
  if (status === "completed") {
    patch.completedAt = serverTimestamp();
  }
  await updateDoc(orderDoc(orderId), patch);
}

export function isOpenKitchenStatus(status: OrderStatus) {
  return status === "received" || status === "preparing" || status === "ready";
}

export async function completeOpenOrdersForTable(
  shopId: string,
  tableLabel: string,
  handledBy?: string,
): Promise<void> {
  const orders = await listOrdersForShop(shopId);
  await Promise.all(
    orders
      .filter((order) => order.tableLabel === tableLabel && isOpenKitchenStatus(order.status))
      .map((order) => updateOrderStatus(order.id, "completed", handledBy)),
  );
}

export function listenOrdersForShop(
  shopId: string,
  onChange: (orders: Order[]) => void,
): Unsubscribe {
  return onSnapshot(query(ordersCol(), where("shopId", "==", shopId)), (snapshot) => {
    onChange(snapshot.docs.map((item) => toOrder(item.id, item.data())));
  });
}
