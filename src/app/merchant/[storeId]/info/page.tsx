"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const CATEGORY_OPTIONS = ["อาหารไทย", "อาหารทานเล่น", "เครื่องดื่ม", "ของหวาน"];

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function StoreInfoPage() {
  const [name, setName] = useState("อมยิ้ม ตามสั่ง");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">ข้อมูลร้าน</h1>
          <p className="mt-1 text-sm text-stone-400">อัปเดตโปรไฟล์ร้านค้าและตำแหน่งที่ตั้ง</p>
        </div>
        <div className="flex gap-3">
          <button className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium text-stone-500 transition hover:text-stone-800">
            ยกเลิก
          </button>
          <button className="cursor-pointer rounded-full bg-orange-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800">
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-semibold text-stone-800">ข้อมูลพื้นฐาน</p>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-stone-500">
                ชื่อร้านค้า (Store Name)
              </span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-stone-500">
                รายละเอียด (Description)
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="รายละเอียด"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-stone-500">
                หมวดหมู่ (Category)
              </span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="mb-4 flex items-center gap-2 font-semibold text-stone-800">
            <MapPin size={16} className="text-orange-600" />
            ตำแหน่งบูธ (Fair Location)
          </p>

          <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
            <div>
              <p className="text-xs text-stone-400">โซน/บูธ</p>
              <p className="font-semibold text-stone-800">Zone A - Booth 42</p>
            </div>
            <button className="cursor-pointer rounded-full border border-orange-200 px-4 py-1.5 text-xs font-medium text-orange-600 transition hover:bg-orange-50">
              แก้ไขตำแหน่ง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
