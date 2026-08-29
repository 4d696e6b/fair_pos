"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import FairBanner from "@/components/fairs/FairBanner";
import ShopSearchFilter from "@/components/fairs/ShopSearchFilter";
import ShopGrid from "@/components/fairs/ShopGrid";
import { getFair, getShopsForFair } from "@/lib/mock-data";
import { useShopFilter } from "@/lib/useShopFilter";

export default function FairDetailPage({
  params,
}: {
  params: Promise<{ fairId: string }>;
}) {
  const { fairId } = use(params);
  const fair = getFair(fairId);
  if (!fair) notFound();

  const { query, setQuery, category, setCategory, filtered } = useShopFilter(
    getShopsForFair(fairId)
  );

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