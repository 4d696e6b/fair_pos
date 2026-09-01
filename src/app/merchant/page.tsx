"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Plus, Store as StoreIcon, Tag } from "lucide-react";
import Header from "@/components/shared/Header";
import { createFair, createShop, listShopsByOwner } from "@/features/fairs";
import { useAuth } from "@/lib/auth-context";
import type { Shop } from "@/lib/types";
import CreateStoreModal from "./components/CreateStoreModal";
import CreateFairModal from "./components/CreateFairModal";

export default function MerchantStoresPage() {
  const { user, loading: authLoading, openLogin } = useAuth();
  const [stores, setStores] = useState<Shop[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fairModalOpen, setFairModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async (uid: string) => {
    setStores(await listShopsByOwner(uid));
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      openLogin();
      setLoading(false);
      return;
    }
    void load(user.uid);
  }, [authLoading, user, openLogin]);

  return (
    <div>
      <Header variant="site" />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-900">ร้านค้าของฉัน</h1>
            <p className="mt-1 text-sm text-stone-400">เลือกสาขาเพื่อเข้าสู่ระบบจัดการ</p>
          </div>
          <div className="flex flex-wrap gap-2">
          <button
            onClick={() => (user ? setModalOpen(true) : openLogin())}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
          >
            <Plus size={16} />
            สร้างร้านค้าใหม่
          </button>
          <button
            onClick={() => (user ? setFairModalOpen(true) : openLogin())}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-orange-200"
          >
            <Calendar size={16} />
            สร้างงานแฟร์
          </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-stone-400">กำลังโหลดร้านค้า...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Link
                key={store.id}
                href={`/merchant/${store.id}/orders`}
                className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-md"
              >
                <div className="h-36 w-full bg-stone-100">
                  {store.image ? (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-300">
                      <StoreIcon size={32} />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="font-bold text-stone-900">{store.name}</p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
                    <Tag size={13} className="shrink-0 text-stone-400" />
                    {store.category}
                  </div>

                  {store.fairId ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
                      <Calendar size={13} className="shrink-0 text-stone-400" />
                      {store.fairId}
                    </div>
                  ) : null}

                  {store.location ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
                      <MapPin size={13} className="shrink-0 text-stone-400" />
                      {store.location}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}

            <button
              onClick={() => (user ? setModalOpen(true) : openLogin())}
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
        )}
      </div>

      <CreateStoreModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={async (name, category, description) => {
          if (!user) return "";
          const store = await createShop({
            ownerUserId: user.uid,
            name,
            category,
            description,
          });
          await load(user.uid);
          return store.id;
        }}
      />
      <CreateFairModal
        open={fairModalOpen}
        onClose={() => setFairModalOpen(false)}
        onCreated={async (input) => {
          await createFair(input);
        }}
      />
    </div>
  );
}
