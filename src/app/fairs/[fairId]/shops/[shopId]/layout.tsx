"use client";

import { use } from "react";
import { notFound, usePathname, useRouter } from "next/navigation";
import { OrderProvider } from "@/lib/order-context";
import FlowHeader from "@/components/FlowHeader";
import { getFair, getShop } from "@/lib/mock-data";

export default function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ fairId: string; shopId: string }>;
}) {
  const { fairId, shopId } = use(params);
  const fair = getFair(fairId);
  const shop = getShop(shopId);
  const pathname = usePathname();
  const router = useRouter();

  if (!fair || !shop) notFound();

  const isOrdersTab = pathname.endsWith("/orders");
  const menuHref = `/fairs/${fairId}/shops/${shopId}`;
  const ordersHref = `/fairs/${fairId}/shops/${shopId}/orders`;

  return (
    <OrderProvider>
      <div className="flex min-h-screen flex-col">
        <FlowHeader
          backHref={`/fairs/${fairId}`}
          crumbs={[
            { label: fair.name, href: `/fairs/${fairId}` },
            { label: shop.name, active: true },
          ]}
          showSettings
          tabs={
            <div className="flex h-16 items-center gap-5 pl-4 text-sm font-medium">
              <button
                onClick={() => router.push(menuHref)}
                className={
                  !isOrdersTab
                    ? "border-b-2 border-brand-600 py-1 text-brand-600"
                    : "border-b-2 border-transparent py-1 text-stone-500 hover:text-stone-800"
                }
              >
                เมนูอาหาร
              </button>
              <button
                onClick={() => router.push(ordersHref)}
                className={
                  isOrdersTab
                    ? "border-b-2 border-brand-600 py-1 text-brand-600"
                    : "border-b-2 border-transparent py-1 text-stone-500 hover:text-stone-800"
                }
              >
                ออเดอร์ของคุณ
              </button>
            </div>
          }
        />
        <div className="flex-1">{children}</div>
      </div>
    </OrderProvider>
  );
}
