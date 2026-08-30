import Image from "next/image";
import { Map } from "lucide-react";
import { Fair } from "@/lib/types";

export default function FairBanner({ fair }: { fair: Fair }) {
  return (
    <section className="relative h-64 w-full overflow-hidden sm:h-80">
      <Image src={fair.image} alt={fair.name} fill className="object-cover" />
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
        <button className="flex shrink-0 items-center gap-2 rounded-full bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-orange-800">
          <Map size={16} />
          แผนที่งาน
        </button>
      </div>
    </section>
  );
}