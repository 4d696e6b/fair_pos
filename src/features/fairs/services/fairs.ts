"use client";

import {
  addDoc,
  collection,
  deleteDoc,
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
import type { Fair, FairCategory } from "@/lib/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
    mapImage: data.mapImage ? String(data.mapImage) : undefined,
    badge: data.badge ? String(data.badge) : undefined,
    category: (data.category as FairCategory) ?? "ตลาดนัด",
    ownerUserId: data.ownerUserId ? String(data.ownerUserId) : undefined,
  };
}

export async function listFairs(): Promise<Fair[]> {
  const snapshot = await getDocs(fairsCol());
  return snapshot.docs
    .map((item) => toFair(item.id, item.data()))
    .sort((a, b) => a.name.localeCompare(b.name, "th"));
}

export async function getFair(fairId: string): Promise<Fair | null> {
  const snapshot = await getDoc(fairDoc(fairId));
  if (!snapshot.exists()) return null;
  return toFair(snapshot.id, snapshot.data());
}

export async function listFairsByOwner(ownerUserId: string): Promise<Fair[]> {
  const snapshot = await getDocs(query(fairsCol(), where("ownerUserId", "==", ownerUserId)));
  return snapshot.docs
    .map((item) => toFair(item.id, item.data()))
    .sort((a, b) => a.name.localeCompare(b.name, "th"));
}

export async function upsertFair(fair: Fair): Promise<void> {
  await setDoc(
    fairDoc(fair.id),
    {
      name: fair.name,
      dateRange: fair.dateRange,
      location: fair.location,
      image: fair.image,
      mapImage: fair.mapImage ?? null,
      badge: fair.badge ?? null,
      category: fair.category,
      ownerUserId: fair.ownerUserId ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateFair(
  fairId: string,
  patch: Partial<Omit<Fair, "id">>,
): Promise<void> {
  await updateDoc(fairDoc(fairId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFair(fairId: string): Promise<void> {
  await deleteDoc(fairDoc(fairId));
}

export async function uploadFairImage(fairId: string, file: File): Promise<string> {
  const path = `fairs/${fairId}/map-${Date.now()}-${file.name}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

export async function createFair(input: {
  name: string;
  dateRange: string;
  location: string;
  category: FairCategory;
  image?: string;
  mapImage?: string;
  ownerUserId?: string;
}): Promise<Fair> {
  const ref = await addDoc(fairsCol(), {
    name: input.name,
    dateRange: input.dateRange,
    location: input.location,
    image: input.image ?? "",
    mapImage: input.mapImage ?? "",
    category: input.category,
    ownerUserId: input.ownerUserId ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const created = await getFair(ref.id);
  if (!created) {
    throw new Error("Failed to create fair.");
  }
  return created;
}
