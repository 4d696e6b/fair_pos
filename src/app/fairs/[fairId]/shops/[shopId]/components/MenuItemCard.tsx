import Image from "next/image";
import { Plus } from "lucide-react";
import { MenuItem } from "@/lib/types";

export default function MenuItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
      <div className="relative h-28 w-full">
        <Image src={item.image || "/emptyImage.png"} alt={item.name} fill className="object-cover" />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-stone-900">
          {item.name}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-orange-700">
            {item.price} บาท
          </span>
          <button
            onClick={() => onAdd(item)}
            aria-label={`เพิ่ม ${item.name}`}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-orange-700 text-white transition hover:bg-orange-800"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}