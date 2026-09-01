"use client";

import { use, useEffect, useState } from "react";
import { notFound, usePathname } from "next/navigation";
import { OrderProvider } from "@/lib/order-context";
import Header from "@/components/shared/Header";
import ShopTabs from "./components/ShopTabs";
import { getFair, getShop } from "@/features/fairs";
import type { Fair, Shop } from "@/lib/types";

export default function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ fairId: string; shopId: string }>;
}) {
  const { fairId, shopId } = use(params);
  const [fair, setFair] = useState<Fair | null | undefined>(undefined);
  const [shop, setShop] = useState<Shop | null | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    void Promise.all([getFair(fairId), getShop(shopId)]).then(([nextFair, nextShop]) => {
      setFair(nextFair);
      setShop(nextShop);
    });
  }, [fairId, shopId]);

  if (fair === undefined || shop === undefined) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header variant="flow" backHref={`/fairs/${fairId}`} crumbs={[{ label: "กำลังโหลด...", active: true }]} />
        <p className="px-6 py-10 text-center text-sm text-stone-500">กำลังโหลดร้านค้า...</p>
      </div>
    );
  }

  if (!fair || !shop) notFound();

  const isOrdersTab = pathname.endsWith("/orders");

  return (
    <OrderProvider>
      <div className="flex min-h-screen flex-col">
        <Header
          variant="flow"
          backHref={`/fairs/${fairId}`}
          crumbs={[
            { label: fair.name, href: `/fairs/${fairId}` },
            { label: shop.name, active: true },
          ]}
          tabs={
            <ShopTabs
              isOrdersTab={isOrdersTab}
              menuHref={`/fairs/${fairId}/shops/${shopId}`}
              ordersHref={`/fairs/${fairId}/shops/${shopId}/orders`}
            />
          }
        />
        <div className="flex-1">{children}</div>
      </div>
    </OrderProvider>
  );
}
