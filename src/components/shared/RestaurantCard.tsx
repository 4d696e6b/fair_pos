import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Shop } from "@/lib/types";
import { shopAddress } from "@/lib/shop-address";
import { activeTags } from "@/lib/shop-tags";

const PLACEHOLDER = "/emptyImage.png";

export default function RestaurantCard({
  shop,
  fairName,
}: {
  shop: Shop;
  fairName?: string;
}) {
  const tags = activeTags(shop);
  const address = shopAddress(shop, fairName);
  const href = shop.fairId
    ? `/fairs/${shop.fairId}/shops/${shop.id}`
    : `/shops/${shop.id}`;

  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={shop.image || PLACEHOLDER}
          alt={shop.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {shop.category ? (
          <span className="absolute right-3 top-3 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {shop.category}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-base font-bold text-stone-900">{shop.name}</h3>
        {address ? (
          <div className="flex items-center gap-1.5 text-sm text-stone-500">
            <MapPin size={14} />
            <span>{address}</span>
          </div>
        ) : null}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700"
              >
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}

        <Link
          href={href}
          className="mt-2 flex w-full items-center justify-center rounded-full bg-orange-700 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
        >
          ดูเมนู
        </Link>
      </div>
    </div>
  );
}
