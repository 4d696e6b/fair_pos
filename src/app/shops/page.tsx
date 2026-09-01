"use client";

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import RestaurantCard from "@/components/shared/RestaurantCard";
import { listAllShops } from "@/features/fairs";
import type { Shop } from "@/lib/types";

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listAllShops()
      .then(setShops)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header variant="site" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-6 text-xl font-bold text-stone-900">ร้านอาหารทั้งหมด</h1>
        {loading ? (
          <p className="text-sm text-stone-400">กำลังโหลดร้านอาหาร...</p>
        ) : shops.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-400">
            ยังไม่มีร้านอาหาร
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <RestaurantCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
