import { MenuCategory } from "@/lib/types";

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: MenuCategory[];
  active: MenuCategory;
  onChange: (c: MenuCategory) => void;
}) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={
            "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition " +
            (active === c
              ? "border-orange-700 bg-orange-700 text-white"
              : "cursor-pointer border-stone-200 bg-white text-stone-600 hover:border-orange-300")
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
}