"use client";

import { useState } from "react";
import Image from "next/image";
import { Map, X } from "lucide-react";
import { Fair } from "@/lib/types";

export default function FairBanner({ fair }: { fair: Fair }) {
  const [mapOpen, setMapOpen] = useState(false);
  const mapSrc = fair.mapImage || fair.image || "/emptyImage.png";

  return (
    <>
    <section className="relative h-64 w-full overflow-hidden sm:h-80">
      <Image
        src={fair.image || "/emptyImage.png"}
        alt={fair.name}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-5 sm:px-10">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {fair.name}
          </h1>
          <p className="text-sm text-stone-100">
            {fair.dateRange} @ {fair.location}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-orange-800"
        >
          <Map size={16} />
          แผนที่งาน
        </button>
      </div>
    </section>

      {mapOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setMapOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3">
              <p className="font-semibold text-stone-800">แผนที่งาน · {fair.name}</p>
              <button
                type="button"
                aria-label="ปิด"
                onClick={() => setMapOpen(false)}
                className="cursor-pointer text-stone-400 transition hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative h-[70vh] min-h-[280px] w-full bg-stone-100">
              <Image src={mapSrc} alt={`แผนที่ ${fair.name}`} fill className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
