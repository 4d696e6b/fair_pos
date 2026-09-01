import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Shop } from "@/lib/types";
import { activeTags } from "@/lib/shop-tags";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop";

export default function RestaurantCard({ shop }: { shop: Shop }) {
  const tags = activeTags(shop);
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
        {tags[0] ? (
          <span className="absolute right-3 top-3 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {tags[0].label}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-base font-bold text-stone-900">{shop.name}</h3>
        <p className="text-sm text-stone-500">{shop.category}</p>
        {shop.location ? (
          <div className="flex items-center gap-1.5 text-sm text-stone-500">
            <MapPin size={14} />
            <span>{shop.location}</span>
          </div>
        ) : null}
        {tags.length > 1 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(1).map((tag) => (
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
