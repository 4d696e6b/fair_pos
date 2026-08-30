"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

type MenuCategory = "เมนูหลัก" | "ของทานเล่น" | "เครื่องดื่ม" | "ของหวาน";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
};

const CATEGORIES: MenuCategory[] = ["เมนูหลัก", "ของทานเล่น", "เครื่องดื่ม", "ของหวาน"];

const MOCK_MENU: MenuItem[] = [
  { id: "1", name: "ข้าวกะเพราเนื้อ", description: "ไม่เผ็ด ไข่ดาวสุก", price: 60, category: "เมนูหลัก" },
  { id: "2", name: "ข้าวหน้าเนื้อ", description: "ไข่ออนเซ็น", price: 80, category: "เมนูหลัก" },
  { id: "3", name: "ชาไทยเย็น", description: "หวานน้อย", price: 35, category: "เครื่องดื่ม" },
  { id: "4", name: "ข้าวเหนียวมะม่วง", description: "มะม่วงสุก", price: 65, category: "ของหวาน" },
];

export default function MenuInfoPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "ทั้งหมด">("ทั้งหมด");

  const items = MOCK_MENU.filter(
    (item) => activeCategory === "ทั้งหมด" || item.category === activeCategory,
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">ข้อมูลเมนู</h1>
          <p className="mt-1 text-sm text-stone-400">จัดการเมนูอาหารและราคาของร้านค้า</p>
        </div>
        <button className="flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800">
          <Plus size={16} />
          เพิ่มเมนู
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["ทั้งหมด", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={
              "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition " +
              (activeCategory === cat
                ? "border-orange-700 bg-orange-700 text-white"
                : "border-stone-200 bg-white text-stone-500 hover:border-orange-200")
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
            <div className="mb-3 h-28 w-full rounded-xl bg-stone-100" />
            <p className="font-semibold text-stone-900">{item.name}</p>
            <p className="mt-0.5 text-xs text-stone-400">{item.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-orange-700">฿{item.price.toFixed(2)}</span>
              <div className="flex gap-2 text-stone-400">
                <button aria-label="แก้ไข" className="cursor-pointer transition hover:text-orange-600">
                  <Pencil size={15} />
                </button>
                <button aria-label="ลบ" className="cursor-pointer transition hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
