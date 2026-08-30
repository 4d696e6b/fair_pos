"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import Header from "@/components/shared/Header";
import FilterPill from "@/components/shared/FilterPill";
import FairCard from "@/components/shared/FairCard";
import RecommendedShopCard from "./components/RecommendedShopCard";
import { FAIRS, RECOMMENDED_SHOPS } from "@/lib/mock-data";
import { FairCategory } from "@/lib/types";

const CATEGORIES: (FairCategory | "ทั้งหมด")[] = [
  "ทั้งหมด",
  "ตลาดนัด",
  "ของกิน",
  "ของใช้",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(
    "ทั้งหมด"
  );

  const fairs = FAIRS.filter((fair) => {
    const matchesCategory = category === "ทั้งหมด" || fair.category === category;
    const matchesQuery = fair.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <Header variant="site" />

      {/* Hero */}
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
              ค้นหางานแฟร์อาหารใกล้คุณ
            </h1>
            <p className="text-stone-100">
              รวมร้านอร่อย งานอีเวนต์ และประสบการณ์การกินที่ดีที่สุด
            </p>
          </div>

          <div className="relative z-10 flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-lg">
            <Search size={18} className="ml-3 shrink-0 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหา 'งานแฟร์' หรือ 'ร้านอาหาร'..."
              className="w-full bg-transparent px-1 py-2 text-sm text-stone-700 outline-none placeholder:text-stone-400"
            />
            <button className="shrink-0 cursor-pointer rounded-full bg-orange-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800">
              ค้นหา
            </button>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-2">
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
      </section>

      {/* Upcoming fairs */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">
            งานแฟร์ที่กำลังจะมาถึง
          </h2>
          <Link
            href="/fairs"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            ดูทั้งหมด
          </Link>
        </div>

        {fairs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-400">
            ไม่พบงานแฟร์ที่ตรงกับการค้นหาของคุณ
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fairs.map((fair) => (
              <FairCard key={fair.id} fair={fair} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended shops */}
      {/* <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-5 text-xl font-bold text-stone-900">
          ร้านค้าแนะนำ
        </h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {RECOMMENDED_SHOPS.map((shop) => (
            <RecommendedShopCard
              key={shop.id}
              name={shop.name}
              category={shop.category}
              icon={shop.icon}
            />
          ))}
        </div>
      </section> */}
    </div>
  );
}
