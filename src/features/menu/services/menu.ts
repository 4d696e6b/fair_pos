"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { firestore } from "@/lib/firebase";
import { seedDemoCatalog } from "@/lib/seed-demo";
import type { MenuCategory, MenuItem } from "@/lib/types";

function menuCol() {
  return collection(firestore, COLLECTIONS.menuItems);
}

function menuDoc(id: string) {
  return doc(firestore, COLLECTIONS.menuItems, id);
}

function toMenuItem(id: string, data: Record<string, unknown>): MenuItem {
  return {
    id,
    shopId: String(data.shopId ?? ""),
    name: String(data.name ?? ""),
    price: Number(data.price ?? 0),
    image: String(data.image ?? ""),
    category: (data.category as MenuCategory) ?? "เมนูหลัก",
    description: data.description ? String(data.description) : undefined,
    isAvailable: data.isAvailable !== false,
  };
}

export async function listMenuForShop(shopId: string): Promise<MenuItem[]> {
  await seedDemoCatalog();
  const snapshot = await getDocs(query(menuCol(), where("shopId", "==", shopId)));
  return snapshot.docs.map((item) => toMenuItem(item.id, item.data()));
}

export async function upsertMenuItem(item: MenuItem): Promise<void> {
  await setDoc(
    menuDoc(item.id),
    {
      shopId: item.shopId,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description ?? "",
      isAvailable: item.isAvailable ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function createMenuItem(input: {
  shopId: string;
  name: string;
  price: number;
  category: MenuCategory;
  description?: string;
  image?: string;
}): Promise<MenuItem> {
  const ref = await addDoc(menuCol(), {
    shopId: input.shopId,
    name: input.name,
    price: input.price,
    image: input.image ?? "",
    category: input.category,
    description: input.description ?? "",
    isAvailable: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    shopId: input.shopId,
    name: input.name,
    price: input.price,
    image: input.image ?? "",
    category: input.category,
    description: input.description,
    isAvailable: true,
  };
}

export async function updateMenuItem(
  itemId: string,
  patch: Partial<Omit<MenuItem, "id" | "shopId">>,
): Promise<void> {
  await updateDoc(menuDoc(itemId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMenuItem(itemId: string): Promise<void> {
  await deleteDoc(menuDoc(itemId));
}
