import Image from "next/image";
import Link from "next/link";
import { Shop } from "@/lib/types";

export default function ShopTile({
  fairId,
  shop,
}: {
  fairId: string;
  shop: Shop;
}) {
  return (
    <Link
      href={`/fairs/${fairId}/shops/${shop.id}`}
      className="group overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-28 cursor-pointer w-full overflow-hidden">
        <Image
          src={shop.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop"}
          alt={shop.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-stone-900">
          {shop.name}
        </p>
        <p className="text-xs text-stone-400">{shop.category}</p>
      </div>
    </Link>
  );
}
