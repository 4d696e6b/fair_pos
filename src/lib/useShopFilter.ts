import { useState } from "react";
import { Shop } from "./types";

export function useShopFilter(shops: Shop[]) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");

  const filtered = shops.filter((shop) => {
    const matchesCategory = category === "ทั้งหมด" || shop.category === category;
    const matchesQuery = shop.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return { query, setQuery, category, setCategory, filtered };
}