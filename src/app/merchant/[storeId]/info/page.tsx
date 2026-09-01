"use client";

import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ImagePlus, ChevronDown, Loader2, X } from "lucide-react";
import Dropdown from "@/components/shared/Dropdown";
import FairSearchSelect, { type FairOption } from "./components/FairSearchSelect";
import { getShop, listFairs, updateShop, uploadShopImage } from "@/features/fairs";
import type { SellingStyle } from "@/lib/types";

const CATEGORY_OPTIONS = ["อาหารไทย", "อาหารทานเล่น", "เครื่องดื่ม", "ของหวาน", "อาหารนานาชาติ", "อาหารเพื่อสุขภาพ", "อาหารทะเล", "อาหารมังสวิรัติ"];

const SELLING_STYLE_OPTIONS = [
  { value: "takeaway", label: "ซื้อกลับเท่านั้น" },
  { value: "dine-in", label: "นั่งทานที่ร้านเท่านั้น" },
  { value: "both", label: "นั่งทาน + ซื้อกลับ" },
];

const inputClass =
  "w-full rounded-lg text-start border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function StoreInfoPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [name, setName] = useState("");
  const [tax, setTax] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [description, setDescription] = useState("");
  const [sellingStyle, setSellingStyle] = useState<SellingStyle>("both");
  const [fairs, setFairs] = useState<FairOption[]>([]);

  const [storeImageUrl, setStoreImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedFair, setSelectedFair] = useState<FairOption | null>(null);
  const [boothNumber, setBoothNumber] = useState("");

  useEffect(() => {
    void Promise.all([getShop(storeId), listFairs()]).then(([shop, nextFairs]) => {
      setFairs(
        nextFairs.map((fair) => ({
          id: fair.id,
          name: fair.name,
          venue: fair.location,
          isOpenNow: true,
        })),
      );
      if (!shop) return;
      setName(shop.name);
      setDescription(shop.description ?? "");
      setSelectedCategory(shop.category);
      setSellingStyle(shop.sellingStyle ?? "both");
      setTax(shop.taxRate ?? 0);
      setServiceCharge(shop.serviceCharge ?? 0);
      setStoreImageUrl(shop.image || null);
      setBoothNumber(shop.boothNumber);
      const fair = nextFairs.find((item) => item.id === shop.fairId);
      setSelectedFair(
        fair
          ? { id: fair.id, name: fair.name, venue: fair.location, isOpenNow: true }
          : null,
      );
    });
  }, [storeId]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadShopImage(storeId, file);
      setStoreImageUrl(url);
    } catch (err) {
      console.error("Failed to upload store image:", err);
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateShop(storeId, {
        name,
        description,
        category: selectedCategory ?? CATEGORY_OPTIONS[0],
        sellingStyle: sellingStyle,
        image: storeImageUrl ?? "",
        taxRate: tax,
        serviceCharge,
        fairId: selectedFair?.id ?? "",
        boothNumber,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // const [isOpenCategory, setIsOpenCategory] = useState(false);
  // const containerCategoryRef = useRef<HTMLDivElement>(null);
  //   useEffect(() => {
  //     if (!isOpenCategory) return;
  
  //     const handleClickOutside = (event: MouseEvent) => {
  //       if (containerCategoryRef.current && !containerCategoryRef.current.contains(event.target as Node)) {
  //         setIsOpenCategory(false);
  //       }
  //     };
  
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, [isOpenCategory]);

  // const [isOpenStyle, setIsOpenStyle] = useState(false);
  // const containerStyleRef = useRef<HTMLDivElement>(null);
  //   useEffect(() => {
  //     if (!isOpenStyle) return;
  
  //     const handleClickOutside = (event: MouseEvent) => {
  //       if (containerStyleRef.current && !containerStyleRef.current.contains(event.target as Node)) {
  //         setIsOpenStyle(false);
  //       }
  //     };
  
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, [isOpenStyle]);

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
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-orange-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Store image */}
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-semibold text-stone-800">รูปภาพร้าน</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {storeImageUrl ? (
            <div className="group relative h-40 w-full overflow-hidden rounded-xl border border-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={storeImageUrl} alt={name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-full bg-white px-4 py-2 text-xs font-medium text-stone-800"
                >
                  เปลี่ยนรูป
                </button>
                <button
                  onClick={() => setStoreImageUrl(null)}
                  className="cursor-pointer rounded-full bg-white p-2 text-stone-800"
                >
                  <X size={14} />
                </button>
              </div>
              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 size={20} className="animate-spin text-white" />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 text-stone-400 transition hover:border-orange-300 hover:text-orange-500 disabled:cursor-not-allowed"
            >
              {isUploadingImage ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <ImagePlus size={22} />
                  <span className="text-xs font-medium">อัปโหลดรูปภาพร้าน</span>
                </>
              )}
            </button>
          )}
          <p className="mt-2 text-xs text-stone-400">
            รูปนี้จะแสดงในหน้าร้านและหน้ารายการงานอีเวนต์ให้ทุกคนเห็น
          </p>
        </div>

        {/* Basic info + selling style + location, merged */}
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

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-stone-500">
                  หมวดหมู่ (Category)
                </span>
                <Dropdown
                  items={CATEGORY_OPTIONS}
                  getKey={(category) => category}
                  isSelected={(category) => category === selectedCategory}
                  onSelect={(category) => setSelectedCategory(category)}
                  renderTrigger={({ isOpen }) => (
                    <div className="flex w-full items-center gap-1.5 rounded-xl transition hover:bg-stone-50">
                      <span className={inputClass}>
                        {selectedCategory || "เลือกหมวดหมู่"}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`text-stone-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  )}
                  renderItem={(category, { isSelected }) => (
                    <>
                      <span
                        className={
                          isSelected
                            ? "font-semibold text-orange-600"
                            : "text-stone-600"
                        }
                      >
                        {category}
                      </span>
                
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      )}
                    </>
                  )}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-stone-500">
                  รูปแบบการขาย (Selling Style)
                </span>
                <Dropdown
                  items={SELLING_STYLE_OPTIONS}
                  getKey={(option) => option.value}
                  isSelected={(option) => option.value === sellingStyle}
                  onSelect={(option) => setSellingStyle(option.value as SellingStyle)}
                  renderTrigger={({ isOpen }) => (
                    <div className="flex w-full items-center gap-1.5 rounded-xl  py-1 transition hover:bg-stone-50">
                      <span className={inputClass}>
                        {SELLING_STYLE_OPTIONS.find(
                          (option) => option.value === sellingStyle
                        )?.label || "เลือกรูปแบบการขาย"}
                      </span>
                
                      <ChevronDown
                        size={20}
                        className={`text-stone-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  )}
                  renderItem={(option, { isSelected }) => (
                    <>
                      <span
                        className={
                          isSelected
                            ? "font-semibold text-orange-600"
                            : "text-stone-600"
                        }
                      >
                        {option.label}
                      </span>
                
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      )}
                    </>
                  )}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-stone-500">
                  ภาษี (Tax)
                </span>
                <div className="relative">
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                    className={`${inputClass} pr-10`}
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    %
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-stone-500">
                  ค่าบริการ (Service Charge)
                </span>
                <div className="relative">
                  <input
                    type="number"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(Number(e.target.value))}
                    className={`${inputClass} pr-10`}
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    %
                  </span>
                </div>
              </label>
            </div>
            <div>
             <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-500">
               งานอีเวนต์ (Fair)
             </span>
             <FairSearchSelect value={selectedFair} onChange={setSelectedFair} fairs={fairs} />
           </div>
           
           <label className="block">
             <span className="mb-1.5 block text-xs font-medium text-stone-500">
               หมายเลขบูธ (Booth Number)
             </span>
             <input
               value={boothNumber}
               onChange={(e) => setBoothNumber(e.target.value)}
               placeholder="เช่น Zone A - 42"
               className={inputClass}
             />
           </label>
          </div>
        </div>
      </div>
    </div>
  );
}