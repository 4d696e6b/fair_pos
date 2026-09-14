import { MenuItem } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";

export default function MenuGrid({
  items,
  onAdd,
}: {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} onAdd={onAdd} />
      ))}
    </div>
  );
}