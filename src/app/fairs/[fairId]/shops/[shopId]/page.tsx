"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getShop } from "@/features/fairs";
import { listMenuForShop } from "@/features/menu";
import { createOrder } from "@/features/orders";
import { listTablesForShop } from "@/features/tables";
import { useAuth } from "@/lib/auth-context";
import { useOrder } from "@/lib/order-context";
import { MenuCategory, MenuItem, OrderType, Shop, ShopTable } from "@/lib/types";
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
  const [tables, setTables] = useState<ShopTable[]>([]);
  const [category, setCategory] = useState<MenuCategory>("เมนูหลัก");
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [tableLabel, setTableLabel] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const { cart, addItem, updateQty, updateNote, clearCart, subtotal, tax, total } = useOrder();
  const { user, openLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    void Promise.all([getShop(shopId), listMenuForShop(shopId), listTablesForShop(shopId)]).then(
      ([nextShop, nextMenu, nextTables]) => {
        setShop(nextShop);
        setMenu(nextMenu);
        setTables(nextTables);
        if (nextShop?.sellingStyle === "dine-in") {
          setOrderType("dine-in");
        }
      },
    );
  }, [shopId]);

  const items = menu.filter((m) => m.category === category && m.isAvailable !== false);
  const allowDineIn = shop?.sellingStyle !== "takeaway";
  const allowTakeaway = shop?.sellingStyle !== "dine-in";
  const needsTable = orderType === "dine-in";
  const checkoutBlocked =
    cart.length === 0 || checkingOut || (needsTable && (!tableLabel || tables.length === 0));

  const handleCheckout = async () => {
    if (!shop || cart.length === 0) return;
    if (!user) {
      openLogin();
      return;
    }
    if (needsTable && !tableLabel) return;
    setCheckingOut(true);
    try {
      await createOrder({
        fairId,
        shopId,
        lines: cart,
        subtotal,
        tax,
        total,
        type: orderType,
        tableLabel: orderType === "dine-in" ? tableLabel : undefined,
      });
      clearCart();
      router.push(`/fairs/${fairId}/shops/${shopId}/orders`);
    } finally {
      setCheckingOut(false);
    }
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
        checkoutDisabled={checkoutBlocked && Boolean(user)}
        checkoutLabel={user ? (checkingOut ? "กำลังสร้างออเดอร์..." : "เพิ่มออเดอร์") : "เข้าสู่ระบบเพื่อสั่ง"}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        tables={tables}
        tableLabel={tableLabel}
        onTableLabelChange={setTableLabel}
        allowDineIn={allowDineIn}
        allowTakeaway={allowTakeaway}
      />
    </div>
  );
}
