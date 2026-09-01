"use client";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { firestore } from "@/lib/firebase";
import type { ShopTable, TableStatus } from "@/lib/types";

function tablesCol() {
  return collection(firestore, COLLECTIONS.tables);
}

function toTable(id: string, data: Record<string, unknown>): ShopTable {
  return {
    id,
    shopId: String(data.shopId ?? ""),
    label: String(data.label ?? ""),
    status: (data.status as TableStatus) ?? "empty",
    total: typeof data.total === "number" ? data.total : undefined,
    seatedMinutes: typeof data.seatedMinutes === "number" ? data.seatedMinutes : undefined,
  };
}

export async function listTablesForShop(shopId: string): Promise<ShopTable[]> {
  const snapshot = await getDocs(query(tablesCol(), where("shopId", "==", shopId)));
  return snapshot.docs
    .map((item) => toTable(item.id, item.data()))
    .sort((a, b) => a.label.localeCompare(b.label, "th"));
}

export async function createTable(shopId: string, label: string): Promise<ShopTable> {
  const ref = await addDoc(tablesCol(), {
    shopId,
    label,
    status: "empty",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    shopId,
    label,
    status: "empty",
  };
}

export async function updateTable(
  tableId: string,
  patch: Partial<Pick<ShopTable, "status" | "total" | "seatedMinutes">>,
): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.tables, tableId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}
