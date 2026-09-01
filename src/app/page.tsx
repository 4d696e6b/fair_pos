"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Header from "@/components/shared/Header";
import FilterPill from "@/components/shared/FilterPill";
import RestaurantCard from "@/components/shared/RestaurantCard";
import { listAllShops } from "@/features/fairs";
import { activeTags, uniqueActiveTagLabels } from "@/lib/shop-tags";
import type { Shop } from "@/lib/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("ทั้งหมด");

  useEffect(() => {
    void listAllShops()
      .then(setShops)
      .finally(() => setLoading(false));
  }, []);

  const tagLabels = useMemo(() => uniqueActiveTagLabels(shops), [shops]);

  const filtered = shops.filter((shop) => {
    const tags = activeTags(shop);
    const haystack = [shop.name, shop.category, shop.location, ...tags.map((tag) => tag.label)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const matchesTag =
      activeTag === "ทั้งหมด" || tags.some((tag) => tag.label === activeTag);
    return matchesQuery && matchesTag;
  });

  return (
    <div>
      <Header variant="site" />

      <section className="relative overflow-hidden">
        <div className="relative flex min-h-[340px] flex-col items-center justify-center gap-6 px-6 py-20 text-center">
          <Image
            src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1600&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

          <div className="relative z-10 space-y-3">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              ค้นหาร้านอาหารใกล้คุณ
            </h1>
            <p className="text-stone-100">
              ค้นด้วยชื่อร้าน หมวดหมู่ หรือแท็กโปรโมชั่นที่ร้านตั้งไว้
            </p>
          </div>

          <div className="relative z-10 flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-lg">
            <Search size={18} className="ml-3 shrink-0 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อร้าน หรือแท็ก เช่น โปร 1 แถม 1"
              className="w-full bg-transparent px-1 py-2 text-sm text-stone-700 outline-none placeholder:text-stone-400"
            />
            <button className="shrink-0 cursor-pointer rounded-full bg-orange-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800">
              ค้นหา
            </button>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-2">
            {["ทั้งหมด", ...tagLabels].map((label) => (
              <FilterPill
                key={label}
                label={label}
                active={activeTag === label}
                onClick={() => setActiveTag(label)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-stone-900">ร้านอาหาร</h2>
          <p className="mt-1 text-sm text-stone-400">
            แท็กจะโชว์บนหน้าแรกเฉพาะช่วงเวลาที่ร้านตั้งไว้
          </p>
        </div>

        {loading ? (
          <p className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-400">
            กำลังโหลดร้านอาหาร...
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-400">
            ไม่พบร้านหรือแท็กที่ตรงกับการค้นหาของคุณ
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((shop) => (
              <RestaurantCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
