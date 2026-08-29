"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getMenuForShop, getShop } from "@/lib/mock-data";
import { useOrder } from "@/lib/order-context";
import { MenuCategory } from "@/lib/types";

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
  const shop = getShop(shopId);
  const menu = getMenuForShop(shopId);
  const [category, setCategory] = useState<MenuCategory>("เมนูหลัก");
  const { cart, addItem, updateQty, subtotal, tax, total, placeOrder } =
    useOrder();
  const router = useRouter();

  const items = menu.filter((m) => m.category === category);

  const handleCheckout = () => {
    if (!shop || cart.length === 0) return;
    placeOrder(fairId, shopId, shop.boothNumber);
    router.push(`/fairs/${fairId}/shops/${shopId}/orders`);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 lg:flex-row lg:px-10">
      {/* Menu */}
      <div className="flex-1">
        <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition " +
                (category === c
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-brand-300")
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm"
            >
              <div className="relative h-28 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-stone-900">
                  {item.name}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-700">
                    {item.price} บาท
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    aria-label={`เพิ่ม ${item.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <aside className="w-full shrink-0 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm lg:w-80">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-stone-900">รายการอาหาร</h2>
          {cart.length > 0 && (
            <button
              onClick={() => cart.forEach((l) => updateQty(l.item.id, 0))}
              className="text-xs font-medium text-stone-400 hover:text-red-500"
            >
              ลบทั้งหมด
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="py-10 text-center text-sm text-stone-400">
            ยังไม่มีรายการอาหารในตะกร้า
          </p>
        ) : (
          <div className="space-y-3">
            {cart.map((line) => (
              <div
                key={line.item.id}
                className="flex items-start justify-between gap-2 rounded-xl border border-stone-100 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={line.item.image}
                      alt={line.item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {line.item.name}
                    </p>
                    <p className="text-xs text-brand-700">
                      ฿{(line.item.price * line.qty).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(line.item.id, line.qty - 1)}
                    aria-label="ลดจำนวน"
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-stone-400"
                  >
                    {line.qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                  </button>
                  <span className="w-4 text-center text-sm font-medium">
                    {line.qty}
                  </span>
                  <button
                    onClick={() => updateQty(line.item.id, line.qty + 1)}
                    aria-label="เพิ่มจำนวน"
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-stone-400"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 space-y-1 border-t border-stone-100 pt-4 text-sm">
          <div className="flex justify-between text-stone-500">
            <span>ยอดรวม</span>
            <span>฿{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>ภาษี</span>
            <span>฿{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-bold text-stone-900">
            <span>ยอดสุทธิ</span>
            <span>฿{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="mt-4 w-full rounded-full bg-brand-700 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
        >
          ชำระเงิน
        </button>
      </aside>
    </div>
  );
}
