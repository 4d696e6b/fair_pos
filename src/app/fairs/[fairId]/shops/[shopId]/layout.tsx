"use client";

import { use } from "react";
import { notFound, usePathname } from "next/navigation";
import { OrderProvider } from "@/lib/order-context";
import Header from "@/components/Header";
import ShopTabs from "@/components/shops/ShopTabs";
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
          showSettings
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