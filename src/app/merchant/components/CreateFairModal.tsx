"use client";

import { X, CalendarDays, ImagePlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { FAIR_FORMAT_CATEGORIES, type FairCategory } from "@/lib/types";
import Dropdown from "@/components/shared/Dropdown";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function CreateFairModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (input: {
    name: string;
    dateRange: string;
    location: string;
    category: FairCategory;
    mapFile?: File;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<FairCategory>("ตลาดนัด");
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [mapPreview, setMapPreview] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!open) return null;

  const reset = () => {
    setName("");
    setDateRange("");
    setLocation("");
    setCategory("ตลาดนัด");
    setMapFile(null);
    setMapPreview("");
    setError("");
    setPending(false);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !dateRange.trim() || !location.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setPending(true);
    try {
      await onCreated({
        name: name.trim(),
        dateRange: dateRange.trim(),
        location: location.trim(),
        category,
        mapFile: mapFile ?? undefined,
      });
      handleClose();
    } catch {
      setError("สร้างงานแฟร์ไม่สำเร็จ กรุณาลองใหม่");
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-orange-100 bg-white p-8 shadow-xl animate-popUp"
      >
        <button
          onClick={handleClose}
          aria-label="ปิด"
          className="absolute right-4 top-4 cursor-pointer text-stone-400 transition hover:text-stone-700"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <CalendarDays size={22} />
        </div>
        <h2 className="text-center text-xl font-bold text-orange-600">สร้างงานแฟร์</h2>
        <p className="mt-1 text-center text-sm text-stone-400">เพิ่มงานอีเวนต์ให้ร้านค้าไปร่วมได้</p>
        <div className="mx-auto my-5 h-px w-16 bg-orange-400" />

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่องาน เช่น ตลาดนัดเชียงราก"
            className={inputClass}
          />
          <input
            required
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="ช่วงวันที่ เช่น 1-3 ก.ย. 2569"
            className={inputClass}
          />
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="สถานที่ เช่น soi-joo"
            className={inputClass}
          />
          <Dropdown
            items={[...FAIR_FORMAT_CATEGORIES]}
            getKey={(item) => item}
            isSelected={(item) => item === category}
            onSelect={setCategory}
            renderTrigger={({ isOpen }) => (
              <div className={`${inputClass} flex cursor-pointer items-center justify-between`}>
                <span>{category}</span>
                <span className={`text-xs text-stone-400 ${isOpen ? "rotate-180" : ""}`}>▼</span>
              </div>
            )}
            renderItem={(item, { isSelected }) => (
              <span className={isSelected ? "font-semibold text-orange-600" : "text-stone-600"}>
                {item}
              </span>
            )}
          />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-stone-500">แผนที่งาน (ไม่บังคับ)</span>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 px-4 py-6 text-sm text-stone-500 hover:border-orange-300">
              <ImagePlus size={18} />
              {mapFile ? "เปลี่ยนรูปแผนที่" : "อัปโหลดรูปแผนที่"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setMapFile(file);
                  setMapPreview(file ? URL.createObjectURL(file) : "");
                }}
              />
            </label>
            {mapPreview ? (
              <img src={mapPreview} alt="แผนที่งาน" className="mt-2 h-32 w-full rounded-xl object-cover" />
            ) : null}
          </label>
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full cursor-pointer rounded-full bg-orange-700 py-3 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-60"
          >
            {pending ? "กำลังสร้าง..." : "สร้างงานแฟร์"}
          </button>
        </form>
      </div>
    </div>
  );
}
