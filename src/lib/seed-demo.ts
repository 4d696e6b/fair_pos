"use client";

import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/collections";
import { firestore } from "@/lib/firebase";
import { FAIRS, MENU_ITEMS, SHOPS } from "@/lib/mock-data";

let seeding: Promise<void> | null = null;

export async function seedDemoCatalog(): Promise<void> {
  if (seeding) {
    return seeding;
  }

  seeding = (async () => {
    const snapshot = await getDocs(collection(firestore, COLLECTIONS.fairs));
    if (!snapshot.empty) {
      return;
    }

    const now = serverTimestamp();

    await Promise.all(
      FAIRS.map((fair) =>
        setDoc(doc(firestore, COLLECTIONS.fairs, fair.id), {
          name: fair.name,
          dateRange: fair.dateRange,
          location: fair.location,
          image: fair.image,
          badge: fair.badge ?? null,
          category: fair.category,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    );

    await Promise.all(
      SHOPS.map((shop) =>
        setDoc(doc(firestore, COLLECTIONS.shops, shop.id), {
          fairId: shop.fairId,
          ownerUserId: null,
          name: shop.name,
          category: shop.category,
          image: shop.image,
          icon: shop.icon,
          boothNumber: shop.boothNumber,
          description: null,
          location: null,
          taxRate: 0,
          serviceCharge: 0,
          sellingStyle: "both",
          tags: [
            {
              id: `${shop.id}-lunch`,
              label: shop.category,
              startAt: new Date(Date.now() - 86400000).toISOString(),
              endAt: new Date(Date.now() + 365 * 86400000).toISOString(),
            },
          ],
          createdAt: now,
          updatedAt: now,
        }),
      ),
    );

    await Promise.all(
      MENU_ITEMS.map((item) =>
        setDoc(doc(firestore, COLLECTIONS.menuItems, item.id), {
          shopId: item.shopId,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          description: "",
          isAvailable: true,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    );
  })();

  try {
    await seeding;
  } finally {
    seeding = null;
  }
}
