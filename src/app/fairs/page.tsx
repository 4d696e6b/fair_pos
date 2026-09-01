"use client";

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import FairCard from "@/components/shared/FairCard";
import { listFairs } from "@/features/fairs";
import type { Fair } from "@/lib/types";

export default function FairsPage() {
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listFairs()
      .then(setFairs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header variant="site" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-6 text-xl font-bold text-stone-900">
          งานแฟร์ทั้งหมด
        </h1>
        {loading ? (
          <p className="text-sm text-stone-400">กำลังโหลดงานแฟร์...</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fairs.map((fair) => (
              <FairCard key={fair.id} fair={fair} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
