"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { firestore } from "@/lib/firebase";
import { seedDemoCatalog } from "@/lib/seed-demo";
import type { Fair, FairCategory } from "@/lib/types";

function fairsCol() {
  return collection(firestore, COLLECTIONS.fairs);
}

function fairDoc(id: string) {
  return doc(firestore, COLLECTIONS.fairs, id);
}

function toFair(id: string, data: Record<string, unknown>): Fair {
  return {
    id,
    name: String(data.name ?? ""),
    dateRange: String(data.dateRange ?? ""),
    location: String(data.location ?? ""),
    image: String(data.image ?? ""),
    badge: data.badge ? String(data.badge) : undefined,
    category: (data.category as FairCategory) ?? "ตลาดนัด",
  };
}

export async function listFairs(): Promise<Fair[]> {
  await seedDemoCatalog();
  const snapshot = await getDocs(fairsCol());
  return snapshot.docs
    .map((item) => toFair(item.id, item.data()))
    .sort((a, b) => a.name.localeCompare(b.name, "th"));
}

export async function getFair(fairId: string): Promise<Fair | null> {
  await seedDemoCatalog();
  const snapshot = await getDoc(fairDoc(fairId));
  if (!snapshot.exists()) return null;
  return toFair(snapshot.id, snapshot.data());
}

export async function upsertFair(fair: Fair): Promise<void> {
  await setDoc(
    fairDoc(fair.id),
    {
      name: fair.name,
      dateRange: fair.dateRange,
      location: fair.location,
      image: fair.image,
      badge: fair.badge ?? null,
      category: fair.category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
