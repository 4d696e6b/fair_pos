import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Fair } from "@/lib/types";

export default function FairCard({ fair }: { fair: Fair }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={fair.image}
          alt={fair.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {fair.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow">
            {fair.badge}
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-base font-bold text-stone-900">{fair.name}</h3>
        <div className="space-y-1 text-sm text-stone-500">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            <span>{fair.dateRange}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{fair.location}</span>
          </div>
        </div>

        <Link
          href={`/fairs/${fair.id}`}
          className="mt-2 flex w-full items-center justify-center rounded-full bg-orange-700 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
        >
          ดูร้านค้า
        </Link>
      </div>
    </div>
  );
}
