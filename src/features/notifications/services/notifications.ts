"use client";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { asRecord, toDate } from "@/lib/firestore";
import { firestore } from "@/lib/firebase";

export type AppNotification = {
  id: string;
  userId: string;
  shopId?: string;
  orderId?: string;
  title: string;
  detail: string;
  href: string;
  createdAt: string;
};

function notificationsCol() {
  return collection(firestore, COLLECTIONS.notifications);
}

function toNotification(id: string, data: Record<string, unknown>): AppNotification {
  return {
    id,
    userId: String(data.userId ?? ""),
    shopId: data.shopId ? String(data.shopId) : undefined,
    orderId: data.orderId ? String(data.orderId) : undefined,
    title: String(data.title ?? ""),
    detail: String(data.detail ?? ""),
    href: String(data.href ?? "/"),
    createdAt: toDate(data.createdAt).toISOString(),
  };
}

export async function listNotificationsForUser(userId: string): Promise<AppNotification[]> {
  const snapshot = await getDocs(query(notificationsCol(), where("userId", "==", userId)));
  return snapshot.docs
    .map((item) => toNotification(item.id, asRecord(item.data())))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createNudgeNotification(input: {
  userId: string;
  shopId: string;
  orderId: string;
  queueNumber: string;
}): Promise<void> {
  await addDoc(notificationsCol(), {
    userId: input.userId,
    shopId: input.shopId,
    orderId: input.orderId,
    title: "ลูกค้าทวงออเดอร์",
    detail: `คิว ${input.queueNumber} รอการดำเนินการ`,
    href: `/merchant/${input.shopId}/orders`,
    createdAt: serverTimestamp(),
  });
}
