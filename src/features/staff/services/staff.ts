"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { firestore } from "@/lib/firebase";
import type { StaffMember, StaffStatus } from "@/lib/types";

function staffCol() {
  return collection(firestore, COLLECTIONS.staff);
}

function toStaff(id: string, data: Record<string, unknown>): StaffMember {
  return {
    id,
    shopId: String(data.shopId ?? ""),
    name: String(data.name ?? ""),
    employeeId: String(data.employeeId ?? ""),
    role: String(data.role ?? ""),
    status: (data.status as StaffStatus) ?? "active",
  };
}

export async function listStaffForShop(shopId: string): Promise<StaffMember[]> {
  const snapshot = await getDocs(query(staffCol(), where("shopId", "==", shopId)));
  return snapshot.docs.map((item) => toStaff(item.id, item.data()));
}

export async function createStaffMember(input: {
  shopId: string;
  name: string;
  employeeId: string;
  role: string;
}): Promise<StaffMember> {
  const ref = await addDoc(staffCol(), {
    ...input,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: ref.id, ...input, status: "active" };
}

export async function updateStaffMember(
  staffId: string,
  patch: Partial<Pick<StaffMember, "name" | "role" | "status" | "employeeId">>,
): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.staff, staffId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteStaffMember(staffId: string): Promise<void> {
  await deleteDoc(doc(firestore, COLLECTIONS.staff, staffId));
}
