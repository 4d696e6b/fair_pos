# Fair POS

Scaffold matching the provided screens: homepage, fair detail, shop menu/cart, and order tracking.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

- `app/page.tsx` — homepage (search, category filter, upcoming fairs, recommended shops)
- `app/fairs/[fairId]/page.tsx` — fair detail (banner, search/filter, participating shops)
- `app/fairs/[fairId]/shops/[shopId]/layout.tsx` — shared header/tabs + cart context for a shop
- `app/fairs/[fairId]/shops/[shopId]/page.tsx` — menu + cart sidebar, checkout
- `app/fairs/[fairId]/shops/[shopId]/orders/page.tsx` — order status + e-ticket
- `lib/mock-data.ts` — mock fairs/shops/menu items (swap for a real API later)
- `lib/order-context.tsx` — cart + order state, scoped per shop
- `components/` — SiteHeader, FlowHeader, FairCard, ShopTile, RecommendedShopCard, FilterPill

Try it: `/` → click "ดูร้านค้า" on ตลาดนัดเชียงราก → click a shop → add items → "ชำระเงิน" to see the order-tracking screen.
