"use client";

import { X, Store as StoreIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { useStore, StoreCategory } from "@/lib/store-context";

const CATEGORIES: StoreCategory[] = ["เมนูหลัก", "ของทานเล่น", "เครื่องดื่ม", "ของหวาน"];

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function CreateStoreModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (storeId: string) => void;
}) {
  const { createStore } = useStore();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<StoreCategory>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!open) return null;

  const reset = () => {
    setName("");
    setCategory(CATEGORIES[0]);
    setDescription("");
    setError("");
    setPending(false);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("กรุณากรอกชื่อร้านค้า");
      return;
    }

    setPending(true);
    const store = createStore({
      name: name.trim(),
      category,
      description: description.trim() || undefined,
    });
    onCreated?.(store.id);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-orange-100 bg-white p-8 shadow-xl"
      >
        <button
          onClick={handleClose}
          aria-label="ปิด"
          className="absolute right-4 top-4 cursor-pointer text-stone-400 transition hover:text-stone-700"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <StoreIcon size={22} />
        </div>

        <h2 className="text-center text-xl font-bold text-orange-600">สร้างร้านค้าใหม่</h2>
        <p className="mt-1 text-center text-sm text-stone-400">
          เพิ่มร้านค้าหรือสาขาใหม่เพื่อเริ่มการจัดการผ่านระบบ
        </p>

        <div className="mx-auto my-5 h-px w-16 bg-orange-400" />

        <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-500">
              ชื่อร้านค้า
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="เช่น ร้านส้มตำป้านิด"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-500">
              ประเภทร้านค้า
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as StoreCategory)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-500">
              คำอธิบายร้านค้า
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="บอกเล่าเกี่ยวกับร้านค้าของคุณสั้น ๆ"
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full cursor-pointer rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "กำลังสร้าง..." : "สร้างร้านค้า"}
          </button>
        </form>
      </div>
    </div>
  );
}
