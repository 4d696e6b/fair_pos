export default function RecommendedShopCard({
  name,
  category,
  icon,
}: {
  name: string;
  category: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-900">{name}</p>
        <p className="text-xs text-stone-400">{category}</p>
      </div>
    </div>
  );
}
