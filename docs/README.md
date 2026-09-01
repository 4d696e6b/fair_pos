# Fair POS

Scaffold matching the provided screens: homepage, fair detail, shop menu/cart, and order tracking.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

- `app/page.tsx` — homepage (search restaurants and timed tags)
- `app/fairs/[fairId]/page.tsx` — fair detail (banner, search/filter, participating shops)
- `app/fairs/[fairId]/shops/[shopId]/layout.tsx` — shared header/tabs + cart context for a shop
- `app/fairs/[fairId]/shops/[shopId]/page.tsx` — menu + cart sidebar, checkout
- `app/fairs/[fairId]/shops/[shopId]/orders/page.tsx` — order status + e-ticket
- `lib/order-context.tsx` — cart state, scoped per shop
- `features/` — Firestore reads and writes for fairs, shops, menus, orders

Try it: `/` → click "ดูร้านค้า" on ตลาดนัดเชียงราก → click a shop → add items → "ชำระเงิน" to see the order-tracking screen.

## Changelog (Thai)

สรุปการเติม logic รอบ `feat/complete-pos-logic` อยู่ที่ [docs/changes/complete-pos-logic-th.md](changes/complete-pos-logic-th.md) และไฟล์ PDF [docs/changes/complete-pos-logic-th.pdf](changes/complete-pos-logic-th.pdf)
