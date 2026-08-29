"use client";

import { use, useState } from "react";
import Image from "next/image";
import { Map, Search } from "lucide-react";
import FlowHeader from "@/components/FlowHeader";
import FilterPill from "@/components/FilterPill";
import ShopTile from "@/components/ShopTile";
import { getFair, getShopsForFair } from "@/lib/mock-data";
import { notFound } from "next/navigation";

const CATEGORIES = ["ทั้งหมด", "อาหารไทย", "อาหารตะวันตก", "เครื่องดื่ม", "ของหวาน"];

export default function FairDetailPage({
  params,
}: {
  params: Promise<{ fairId: string }>;
}) {
  const { fairId } = use(params);
  const fair = getFair(fairId);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");

  if (!fair) notFound();

  const shops = getShopsForFair(fairId).filter((shop) => {
    const matchesCategory = category === "ทั้งหมด" || shop.category === category;
    const matchesQuery = shop.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <FlowHeader backHref="/" crumbs={[{ label: fair.name, active: true }]} />

      {/* Banner */}
      <section className="relative h-64 w-full overflow-hidden sm:h-80">
        <Image src={fair.image} alt={fair.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-5 sm:px-10">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {fair.name}
            </h1>
            <p className="text-sm text-stone-100">
              {fair.dateRange} @ {fair.location}
            </p>
          </div>
          <button className="flex shrink-0 items-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-800">
            <Map size={16} />
            แผนที่งาน
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <div className="mb-6 rounded-2xl bg-stone-100 p-4">
          <div className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm">
            <Search size={16} className="shrink-0 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาร้านค้าหรือเมนู..."
              className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <FilterPill
                key={c}
                label={c}
                active={category === c}
                onClick={() => setCategory(c)}
              />
            ))}
          </div>
        </div>

        <h2 className="mb-4 text-lg font-bold text-stone-900">
          ร้านค้าที่เข้าร่วมรายการ
        </h2>

        {shops.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-400">
            ไม่พบร้านค้าที่ตรงกับการค้นหาของคุณ
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {shops.map((shop) => (
              <ShopTile key={shop.id} fairId={fairId} shop={shop} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
