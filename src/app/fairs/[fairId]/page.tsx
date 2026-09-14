"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/shared/Header";
import FairBanner from "./components/FairBanner";
import ShopSearchFilter from "./components/ShopSearchFilter";
import ShopGrid from "./components/ShopGrid";
import { getFair, listShopsForFair } from "@/features/fairs";
import { useShopFilter } from "@/lib/useShopFilter";
import type { Fair, Shop } from "@/lib/types";

export default function FairDetailPage({
  params,
}: {
  params: Promise<{ fairId: string }>;
}) {
  const { fairId } = use(params);
  const [fair, setFair] = useState<Fair | null | undefined>(undefined);
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    void Promise.all([getFair(fairId), listShopsForFair(fairId)]).then(
      ([nextFair, nextShops]) => {
        setFair(nextFair);
        setShops(nextShops);
      },
    );
  }, [fairId]);

  const { query, setQuery, category, setCategory, filtered } = useShopFilter(shops);

  if (fair === undefined) {
    return (
      <div>
        <Header variant="flow" backHref="/" crumbs={[{ label: "กำลังโหลด...", active: true }]} />
        <p className="px-6 py-10 text-center text-sm text-stone-500">กำลังโหลดงานแฟร์...</p>
      </div>
    );
  }

  if (!fair) notFound();

  return (
    <div>
      <Header variant="flow" backHref="/" crumbs={[{ label: fair.name, active: true }]} />
      <FairBanner fair={fair} />
      <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <ShopSearchFilter
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
        />
        <ShopGrid fairId={fairId} shops={filtered} />
      </section>
    </div>
  );
}
