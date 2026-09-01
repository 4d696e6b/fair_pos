"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { firestore } from "@/lib/firebase";
import type { ShopCosts } from "@/lib/types";

const EMPTY_COSTS: Omit<ShopCosts, "shopId"> = {
  boothRent: 0,
  wages: 0,
  ingredients: 0,
  misc: 0,
};

export async function getShopCosts(shopId: string): Promise<ShopCosts> {
  const snapshot = await getDoc(doc(firestore, COLLECTIONS.shopCosts, shopId));
  if (!snapshot.exists()) {
    return { shopId, ...EMPTY_COSTS };
  }
  const data = snapshot.data();
  return {
    shopId,
    boothRent: Number(data.boothRent ?? 0),
    wages: Number(data.wages ?? 0),
    ingredients: Number(data.ingredients ?? 0),
    misc: Number(data.misc ?? 0),
  };
}

export async function saveShopCosts(
  shopId: string,
  costs: Omit<ShopCosts, "shopId">,
): Promise<void> {
  await setDoc(
    doc(firestore, COLLECTIONS.shopCosts, shopId),
    { ...costs, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
