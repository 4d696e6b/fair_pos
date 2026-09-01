"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { firestore } from "@/lib/firebase";
import type { ShopCosts } from "@/lib/types";

const DEFAULT_COSTS: Omit<ShopCosts, "shopId"> = {
  boothRent: 15000,
  wages: 25000,
  ingredients: 40000,
  misc: 5000,
};

export async function getShopCosts(shopId: string): Promise<ShopCosts> {
  const snapshot = await getDoc(doc(firestore, COLLECTIONS.shopCosts, shopId));
  if (!snapshot.exists()) {
    await setDoc(doc(firestore, COLLECTIONS.shopCosts, shopId), {
      ...DEFAULT_COSTS,
      updatedAt: serverTimestamp(),
    });
    return { shopId, ...DEFAULT_COSTS };
  }
  const data = snapshot.data();
  return {
    shopId,
    boothRent: Number(data.boothRent ?? DEFAULT_COSTS.boothRent),
    wages: Number(data.wages ?? DEFAULT_COSTS.wages),
    ingredients: Number(data.ingredients ?? DEFAULT_COSTS.ingredients),
    misc: Number(data.misc ?? DEFAULT_COSTS.misc),
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
