"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getShop } from "@/features/fairs";
import { listMenuForShop } from "@/features/menu";
import { useOrder } from "@/lib/order-context";
import { MenuCategory, MenuItem, Shop } from "@/lib/types";
import CategoryTabs from "./components/CategoryTabs";
import MenuGrid from "./components/MenuGrid";
import CartSidebar from "./components/CartSidebar";

const CATEGORIES: MenuCategory[] = [
  "เมนูหลัก",
  "ของทานเล่น",
  "เครื่องดื่ม",
  "ของหวาน",
];

export default function ShopMenuPage({
  params,
}: {
  params: Promise<{ fairId: string; shopId: string }>;
}) {
  const { fairId, shopId } = use(params);
  const [shop, setShop] = useState<Shop | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [category, setCategory] = useState<MenuCategory>("เมนูหลัก");
  const { cart, addItem, updateQty, updateNote, subtotal, tax, total, placeOrder } = useOrder();
  const router = useRouter();

  useEffect(() => {
    void Promise.all([getShop(shopId), listMenuForShop(shopId)]).then(
      ([nextShop, nextMenu]) => {
        setShop(nextShop);
        setMenu(nextMenu);
      },
    );
  }, [shopId]);

  const items = menu.filter((m) => m.category === category && m.isAvailable !== false);

  const handleCheckout = () => {
    if (!shop || cart.length === 0) return;
    placeOrder(fairId, shopId, shop.boothNumber);
    router.push(`/fairs/${fairId}/shops/${shopId}/orders`);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 lg:flex-row lg:px-10">
      <div className="flex-1">
        <CategoryTabs categories={CATEGORIES} active={category} onChange={setCategory} />
        <MenuGrid items={items} onAdd={addItem} />
      </div>

      <CartSidebar
        cart={cart}
        onUpdateQty={updateQty}
        onUpdateNote={updateNote}
        onClearAll={() => cart.forEach((l) => updateQty(l.item.id, 0))}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
