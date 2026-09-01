"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createMenuItem,
  deleteMenuItem,
  listMenuForShop,
  updateMenuItem,
  uploadMenuImage,
} from "@/features/menu";
import type { MenuCategory, MenuItem } from "@/lib/types";

const CATEGORIES: MenuCategory[] = ["เมนูหลัก", "ของทานเล่น", "เครื่องดื่ม", "ของหวาน"];

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function MenuInfoPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "ทั้งหมด">("ทั้งหมด");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MenuItem | "new" | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [category, setCategory] = useState<MenuCategory>("เมนูหลัก");
  const [pending, setPending] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const load = async () => {
    const next = await listMenuForShop(storeId);
    setItems(next);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [storeId]);

  const visible = items.filter(
    (item) => activeCategory === "ทั้งหมด" || item.category === activeCategory,
  );

  const openCreate = () => {
    setEditing("new");
    setName("");
    setDescription("");
    setPrice("0");
    setCategory("เมนูหลัก");
    setIsAvailable(true);
    setImageUrl("");
    setImageFile(null);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description ?? "");
    setPrice(String(item.price));
    setCategory(item.category);
    setIsAvailable(item.isAvailable !== false);
    setImageUrl(item.image);
    setImageFile(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      const uploaded = imageFile ? await uploadMenuImage(storeId, imageFile) : imageUrl;
      if (editing === "new") {
        await createMenuItem({
          shopId: storeId,
          name: name.trim(),
          description: description.trim(),
          price: Number(price) || 0,
          category,
          image: uploaded,
          isAvailable,
        });
      } else if (editing) {
        await updateMenuItem(editing.id, {
          name: name.trim(),
          description: description.trim(),
          price: Number(price) || 0,
          category,
          image: uploaded,
          isAvailable,
        });
      }
      setEditing(null);
      await load();
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    await deleteMenuItem(itemId);
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">ข้อมูลเมนู</h1>
          <p className="mt-1 text-sm text-stone-400">จัดการเมนูอาหารและราคาของร้านค้า</p>
        </div>
        <button
          onClick={openCreate}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
        >
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

      {loading ? (
        <p className="text-sm text-stone-400">กำลังโหลดเมนู...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <div key={item.id} className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
              <div
                className="mb-3 h-28 w-full rounded-xl bg-stone-100 bg-cover bg-center"
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              />
              <p className="font-semibold text-stone-900">{item.name}</p>
              <p className="mt-0.5 text-xs text-stone-400">{item.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-orange-700">฿{item.price.toFixed(2)}</span>
                <div className="flex items-center gap-2 text-stone-400">
                  <button
                    type="button"
                    onClick={() =>
                      void updateMenuItem(item.id, { isAvailable: item.isAvailable === false }).then(load)
                    }
                    className={
                      "rounded-full px-2 py-0.5 text-[11px] font-medium " +
                      (item.isAvailable === false
                        ? "bg-stone-100 text-stone-500"
                        : "bg-emerald-50 text-emerald-600")
                    }
                  >
                    {item.isAvailable === false ? "หมด" : "มีขาย"}
                  </button>
                  <button
                    aria-label="แก้ไข"
                    onClick={() => openEdit(item)}
                    className="cursor-pointer transition hover:text-orange-600"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    aria-label="ลบ"
                    onClick={() => void handleDelete(item.id)}
                    className="cursor-pointer transition hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="absolute right-4 top-4 text-stone-400"
              aria-label="ปิด"
            >
              <X size={18} />
            </button>
            <h2 className="mb-4 text-lg font-bold text-stone-900">
              {editing === "new" ? "เพิ่มเมนู" : "แก้ไขเมนู"}
            </h2>
            <div className="space-y-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อเมนู"
                className={inputClass}
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="คำอธิบาย"
                className={inputClass}
              />
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MenuCategory)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="text-xs text-stone-500"
              />
              {(imageFile || imageUrl) && (
                <p className="text-xs text-stone-400">
                  {imageFile ? imageFile.name : "ใช้รูปเดิมของเมนูนี้"}
                </p>
              )}
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
                มีขายอยู่ตอนนี้
              </label>
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-orange-700 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pending ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
