import type { Shop } from "@/lib/types";

export function shopAddress(shop: Shop, fairName?: string) {
  const place = shop.location?.trim() || fairName?.trim() || "";
  const booth = shop.boothNumber?.trim() || "";
  return [place, booth].filter(Boolean).join(" ");
}
