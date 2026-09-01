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
  const tables = snapshot.docs.map((item) => toTable(item.id, item.data()));
  if (tables.length > 0) {
    return tables.sort((a, b) => a.label.localeCompare(b.label, "th"));
  }

  await Promise.all(
    Array.from({ length: 8 }, (_, index) =>
      addDoc(tablesCol(), {
        shopId,
        label: `โต๊ะ ${index + 1}`,
        status: "empty",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ),
  );

  const seeded = await getDocs(query(tablesCol(), where("shopId", "==", shopId)));
  return seeded.docs
    .map((item) => toTable(item.id, item.data()))
    .sort((a, b) => a.label.localeCompare(b.label, "th"));
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
