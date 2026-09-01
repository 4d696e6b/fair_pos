"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { firestore, storage } from "@/lib/firebase";
import { seedDemoCatalog } from "@/lib/seed-demo";
import type { SellingStyle, Shop, ShopTag } from "@/lib/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function shopsCol() {
  return collection(firestore, COLLECTIONS.shops);
}

function shopDoc(id: string) {
  return doc(firestore, COLLECTIONS.shops, id);
}

function toTag(value: unknown): ShopTag | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const data = value as Record<string, unknown>;
  const label = String(data.label ?? "").trim();
  if (!label) {
    return null;
  }
  return {
    id: String(data.id ?? crypto.randomUUID()),
    label,
    startAt: String(data.startAt ?? ""),
    endAt: String(data.endAt ?? ""),
  };
}

function toShop(id: string, data: Record<string, unknown>): Shop {
  return {
    id,
    fairId: String(data.fairId ?? ""),
    ownerUserId: data.ownerUserId ? String(data.ownerUserId) : undefined,
    name: String(data.name ?? ""),
    category: String(data.category ?? ""),
    image: String(data.image ?? ""),
    icon: String(data.icon ?? "🏪"),
    boothNumber: String(data.boothNumber ?? ""),
    description: data.description ? String(data.description) : undefined,
    location: data.location ? String(data.location) : undefined,
    taxRate: typeof data.taxRate === "number" ? data.taxRate : undefined,
    serviceCharge: typeof data.serviceCharge === "number" ? data.serviceCharge : undefined,
    sellingStyle: data.sellingStyle as SellingStyle | undefined,
    tags: Array.isArray(data.tags)
      ? data.tags.map(toTag).filter((tag): tag is ShopTag => Boolean(tag))
      : [],
  };
}

export async function listAllShops(): Promise<Shop[]> {
  await seedDemoCatalog();
  const snapshot = await getDocs(shopsCol());
  return snapshot.docs
    .map((item) => toShop(item.id, item.data()))
    .sort((a, b) => a.name.localeCompare(b.name, "th"));
}

export async function listShopsForFair(fairId: string): Promise<Shop[]> {
  await seedDemoCatalog();
  const snapshot = await getDocs(query(shopsCol(), where("fairId", "==", fairId)));
  return snapshot.docs.map((item) => toShop(item.id, item.data()));
}

export async function listShopsByOwner(ownerUserId: string): Promise<Shop[]> {
  const snapshot = await getDocs(
    query(shopsCol(), where("ownerUserId", "==", ownerUserId)),
  );
  return snapshot.docs.map((item) => toShop(item.id, item.data()));
}

export async function getShop(shopId: string): Promise<Shop | null> {
  await seedDemoCatalog();
  const snapshot = await getDoc(shopDoc(shopId));
  if (!snapshot.exists()) return null;
  return toShop(snapshot.id, snapshot.data());
}

export async function upsertShop(shop: Shop): Promise<void> {
  await setDoc(
    shopDoc(shop.id),
    {
      fairId: shop.fairId,
      ownerUserId: shop.ownerUserId ?? null,
      name: shop.name,
      category: shop.category,
      image: shop.image,
      icon: shop.icon,
      boothNumber: shop.boothNumber,
      description: shop.description ?? null,
      location: shop.location ?? null,
      taxRate: shop.taxRate ?? 0,
      serviceCharge: shop.serviceCharge ?? 0,
      sellingStyle: shop.sellingStyle ?? "both",
      tags: shop.tags ?? [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function createShop(input: {
  ownerUserId: string;
  name: string;
  category: string;
  description?: string;
}): Promise<Shop> {
  const payload = {
    fairId: "",
    ownerUserId: input.ownerUserId,
    name: input.name,
    category: input.category,
    image: "",
    icon: "🏪",
    boothNumber: "",
    description: input.description ?? null,
    location: null,
    taxRate: 0,
    serviceCharge: 0,
    sellingStyle: "both",
    tags: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(shopsCol(), payload);
  const created = await getShop(ref.id);
  if (!created) {
    throw new Error("Failed to create shop.");
  }
  return created;
}

export async function updateShop(
  shopId: string,
  patch: Partial<Omit<Shop, "id">>,
): Promise<void> {
  await updateDoc(shopDoc(shopId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function uploadShopImage(shopId: string, file: File): Promise<string> {
  const path = `stores/${shopId}/cover-${Date.now()}-${file.name}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}
