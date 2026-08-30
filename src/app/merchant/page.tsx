"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Store as StoreIcon } from "lucide-react";
import Header from "@/components/shared/Header";
import { useStore } from "@/lib/store-context";
import CreateStoreModal from "./components/CreateStoreModal";

export default function MerchantStoresPage() {
  const { stores } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Header variant="site" />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-900">ร้านค้าของฉัน</h1>
            <p className="mt-1 text-sm text-stone-400">เลือกสาขาเพื่อเข้าสู่ระบบจัดการ</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
          >
            <Plus size={16} />
            สร้างร้านค้าใหม่
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/merchant/${store.id}/orders`}
              className="rounded-2xl border border-stone-100 bg-white p-6 text-left shadow-sm transition hover:border-orange-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <StoreIcon size={22} />
              </div>
              <p className="font-bold text-stone-900">{store.name}</p>
              <p className="mt-1 text-xs text-stone-400">{store.category}</p>
              {store.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-stone-500">
                  {store.description}
                </p>
              ) : null}
            </Link>
          ))}

          <button
            onClick={() => setModalOpen(true)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white p-6 text-center transition hover:border-orange-300 hover:bg-orange-50/40"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
              <StoreIcon size={22} />
            </div>
            <p className="font-bold text-stone-900">เปิดร้านสาขาใหม่</p>
            <p className="mt-1 max-w-[220px] text-xs text-stone-400">
              เพิ่มร้านค้าหรือสาขาใหม่เพื่อเริ่มการจัดการผ่านระบบ
            </p>
          </button>
        </div>
      </div>

      <CreateStoreModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
