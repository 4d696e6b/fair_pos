import type { Shop, ShopTag } from "@/lib/types";

export function isTagActive(tag: ShopTag, now = new Date()): boolean {
  const start = new Date(tag.startAt).getTime();
  const end = new Date(tag.endAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return false;
  }
  const current = now.getTime();
  return current >= start && current <= end;
}

export function activeTags(shop: Shop, now = new Date()): ShopTag[] {
  return (shop.tags ?? []).filter((tag) => isTagActive(tag, now));
}

export function uniqueActiveTagLabels(shops: Shop[], now = new Date()): string[] {
  const labels = new Set<string>();
  shops.forEach((shop) => {
    activeTags(shop, now).forEach((tag) => labels.add(tag.label));
  });
  return [...labels].sort((a, b) => a.localeCompare(b, "th"));
}
