"use client";

import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "@/lib/firebase";
import type { User } from "@/types/user";

const USERS_COLLECTION = "users";

function usersDoc(userId: string) {
  return doc(firestore, USERS_COLLECTION, userId);
}

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return new Date();
}

function toUser(id: string, data: Record<string, unknown>): User {
  return {
    id,
    username: String(data.username ?? ""),
    email: String(data.email ?? ""),
    isVerified: Boolean(data.isVerified),
    firstName: data.firstName ? String(data.firstName) : "",
    lastName: data.lastName ? String(data.lastName) : "",
    phone: data.phone ? String(data.phone) : "",
    notifyEmail: data.notifyEmail !== false,
    notifySalesSummary: Boolean(data.notifySalesSummary),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function createUserProfile(user: Omit<User, "createdAt" | "updatedAt">): Promise<User> {
  const now = serverTimestamp();

  await setDoc(usersDoc(user.id), {
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    createdAt: now,
    updatedAt: now,
  });

  const created = await getUserProfile(user.id);

  if (!created) {
    throw new Error("Failed to create user profile.");
  }

  return created;
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const snapshot = await getDoc(usersDoc(userId));

  if (!snapshot.exists()) {
    return null;
  }

  return toUser(snapshot.id, snapshot.data());
}

export async function updateUserProfile(
  userId: string,
  patch: Partial<
    Pick<
      User,
      | "username"
      | "email"
      | "isVerified"
      | "firstName"
      | "lastName"
      | "phone"
      | "notifyEmail"
      | "notifySalesSummary"
    >
  >,
): Promise<void> {
  await updateDoc(usersDoc(userId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserProfile(userId: string): Promise<void> {
  await deleteDoc(usersDoc(userId));
}
