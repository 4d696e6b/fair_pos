import { Search } from "lucide-react";
import FilterPill from "@/components/FilterPill";

const CATEGORIES = ["ทั้งหมด", "อาหารไทย", "อาหารตะวันตก", "เครื่องดื่ม", "ของหวาน"];

export default function ShopSearchFilter({
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
}) {
  return (
    <div className="mb-6 rounded-2xl bg-stone-100 p-4">
      <div className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm">
        <Search size={16} className="shrink-0 text-stone-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="ค้นหาร้านค้าหรือเมนู..."
          className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <FilterPill
            key={c}
            label={c}
            active={category === c}
            onClick={() => onCategoryChange(c)}
          />
        ))}
      </div>
    </div>
  );
}