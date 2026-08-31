"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MapPin, X } from "lucide-react";

export type FairOption = {
  id: string;
  name: string;
  venue?: string;
  isOpenNow: boolean;
};

// TODO: replace with a Firestore query, e.g. fairs where status == "ongoing"
const MOCK_FAIRS: FairOption[] = [
  { id: "fair-1", name: "งานกาชาดจตุจักร", venue: "สวนจตุจักร", isOpenNow: true },
  { id: "fair-2", name: "ตลาดนัดกลางคืน RCA", venue: "RCA", isOpenNow: true },
  { id: "fair-3", name: "เทศกาลอาหารทะเลระยอง", venue: "ระยอง", isOpenNow: false },
];

export default function FairSearchSelect({
  value,
  onChange,
  fairs = MOCK_FAIRS,
  placeholder = "ค้นหางานอีเวนต์ที่เปิดอยู่ตอนนี้",
}: {
  value: FairOption | null;
  onChange: (fair: FairOption | null) => void;
  fairs?: FairOption[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filtered = fairs.filter((f) =>
    `${f.name} ${f.venue ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const openFairs = filtered.filter((f) => f.isOpenNow);
  const closedFairs = filtered.filter((f) => !f.isOpenNow);

  const handleSelect = (fair: FairOption) => {
    onChange(fair);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-stone-800">{value.name}</p>
              {value.venue && <p className="text-xs text-stone-400">{value.venue}</p>}
            </div>
            {value.isOpenNow && (
              <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                เปิดอยู่ตอนนี้
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="cursor-pointer rounded-full p-1.5 text-stone-400 transition hover:bg-white hover:text-stone-700"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white"
          />
        </div>
      )}

      {isOpen && !value ? (
        <div className="absolute top-full z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-stone-100 bg-white py-1.5 shadow-lg">
          {openFairs.length > 0 && (
            <div>
              <p className="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-stone-400">
                เปิดอยู่ตอนนี้
              </p>
              {openFairs.map((fair) => (
                <button
                  key={fair.id}
                  type="button"
                  onClick={() => handleSelect(fair)}
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-orange-50"
                >
                  <span>
                    <span className="font-medium text-stone-800">{fair.name}</span>
                    {fair.venue && <span className="ml-1.5 text-xs text-stone-400">{fair.venue}</span>}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </button>
              ))}
            </div>
          )}

          {closedFairs.length > 0 && (
            <div>
              <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-stone-400">
                ไม่ได้เปิดอยู่ตอนนี้
              </p>
              {closedFairs.map((fair) => (
                <button
                  key={fair.id}
                  type="button"
                  onClick={() => handleSelect(fair)}
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm text-stone-400 transition hover:bg-stone-50"
                >
                  <span>
                    {fair.name}
                    {fair.venue && <span className="ml-1.5 text-xs">{fair.venue}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <p className="px-3 py-3 text-center text-sm text-stone-400">ไม่พบงานอีเวนต์ที่ตรงกัน</p>
          )}
        </div>
      ) : null}
    </div>
  );
}