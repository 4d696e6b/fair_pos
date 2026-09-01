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
import { firestore, storage } from "@/lib/firebase";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
  isAvailable?: boolean;
}): Promise<MenuItem> {
  const ref = await addDoc(menuCol(), {
    shopId: input.shopId,
    name: input.name,
    price: input.price,
    image: input.image ?? "",
    category: input.category,
    description: input.description ?? "",
    isAvailable: input.isAvailable ?? true,
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
    isAvailable: input.isAvailable ?? true,
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

export async function uploadMenuImage(shopId: string, file: File): Promise<string> {
  const path = `stores/${shopId}/menu-${Date.now()}-${file.name}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}
