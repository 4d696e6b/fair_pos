"use client";

import { useRouter } from "next/navigation";

export default function ShopTabs({
  isOrdersTab,
  menuHref,
  ordersHref,
}: {
  isOrdersTab: boolean;
  menuHref: string;
  ordersHref: string;
}) {
  const router = useRouter();

  const tabClass = (active: boolean) =>
    "cursor-pointer border-b-2 py-1 " +
    (active
      ? "border-orange-600 text-orange-600"
      : "border-transparent text-stone-500 hover:text-stone-800");

  return (
    <div className="flex h-16 items-center gap-5 pl-4 text-sm font-medium">
      <button onClick={() => router.push(menuHref)} className={tabClass(!isOrdersTab)}>
        เมนูอาหาร
      </button>
      <button onClick={() => router.push(ordersHref)} className={tabClass(isOrdersTab)}>
        ออเดอร์ของคุณ
      </button>
    </div>
  );
}