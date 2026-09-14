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
          src={shop.image || "/emptyImage.png"}
          alt={shop.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {shop.category ? (
          <span className="absolute right-2 top-2 rounded-full bg-orange-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
            {shop.category}
          </span>
        ) : null}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-stone-900">
          {shop.name}
        </p>
        {shop.boothNumber ? (
          <p className="text-xs text-stone-400">{shop.boothNumber}</p>
        ) : null}
      </div>
    </Link>
  );
}
