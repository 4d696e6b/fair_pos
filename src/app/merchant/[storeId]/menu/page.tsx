"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import Dropdown from "@/components/shared/Dropdown";
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
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

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
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description ?? "");
    setPrice(String(item.price));
    setCategory(item.category);
    setImageUrl(item.image);
    setImageFile(null);
    setImagePreview(item.image || "");
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
          isAvailable: true,
        });
      } else if (editing) {
        await updateMenuItem(editing.id, {
          name: name.trim(),
          description: description.trim(),
          price: Number(price) || 0,
          category,
          image: uploaded,
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
              <div className="relative mb-3 h-48 w-full overflow-hidden rounded-xl bg-stone-100">
                <img
                  src={item.image || "/emptyImage.png"}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                {activeCategory === "ทั้งหมด" ? (
                  <span className="absolute right-3 top-3 rounded-full bg-orange-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                    {item.category}
                  </span>
                ) : null}
              </div>
              <p className="font-semibold text-stone-900">{item.name}</p>
              <p className="mt-0.5 text-xs text-stone-400">{item.description}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="font-bold text-orange-700">฿{item.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      void updateMenuItem(item.id, { isAvailable: item.isAvailable === false }).then(load)
                    }
                    className={
                      "cursor-pointer rounded-full px-3 py-1 text-xs font-semibold " +
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
                    className="cursor-pointer rounded-full bg-stone-100 p-2 text-stone-500 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    aria-label="ลบ"
                    onClick={() => void handleDelete(item.id)}
                    className="cursor-pointer rounded-full bg-stone-100 p-2 text-stone-500 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setEditing(null)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="absolute right-4 top-4 cursor-pointer text-stone-400 hover:text-stone-700"
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
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400">฿</span>
                <input
                  type="number"
                  min={0}
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`${inputClass} pl-8`}
                />
              </div>
              <Dropdown
                items={CATEGORIES}
                getKey={(item) => item}
                isSelected={(item) => item === category}
                onSelect={setCategory}
                renderTrigger={({ isOpen }) => (
                  <div className={`${inputClass} flex cursor-pointer items-center justify-between`}>
                    <span>{category}</span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                )}
                renderItem={(item, { isSelected }) => (
                  <span className={isSelected ? "font-semibold text-orange-600" : "text-stone-600"}>
                    {item}
                  </span>
                )}
              />
              <div>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 px-4 py-6 text-sm text-stone-500 transition hover:border-orange-300 hover:text-orange-600">
                  <ImagePlus size={22} />
                  {imageFile || imageUrl ? "เปลี่ยนรูปเมนู" : "อัปโหลดรูปเมนู"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setImageFile(file);
                      setImagePreview(file ? URL.createObjectURL(file) : imageUrl);
                    }}
                  />
                </label>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="พรีวิวเมนู"
                    className="mt-3 h-40 w-full rounded-xl object-cover"
                  />
                ) : (
                  <img
                    src="/emptyImage.png"
                    alt="ยังไม่มีรูป"
                    className="mt-3 h-40 w-full rounded-xl object-cover"
                  />
                )}
              </div>
              <button
                type="submit"
                disabled={pending}
                className="w-full cursor-pointer rounded-full bg-orange-700 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
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
