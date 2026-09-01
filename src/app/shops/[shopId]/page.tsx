"use client";

import { useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { getShop } from "@/features/fairs";

export default function ShopShortcutPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = use(params);
  const router = useRouter();

  useEffect(() => {
    void getShop(shopId).then((shop) => {
      if (shop?.fairId) {
        router.replace(`/fairs/${shop.fairId}/shops/${shop.id}`);
        return;
      }
      router.replace("/");
    });
  }, [router, shopId]);

  return (
    <p className="px-6 py-16 text-center text-sm text-stone-500">กำลังเปิดร้านค้า...</p>
  );
}
