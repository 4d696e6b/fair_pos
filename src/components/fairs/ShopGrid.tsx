import { Shop } from "@/lib/types";
import ShopTile from "@/components/ShopTile";

export default function ShopGrid({
  fairId,
  shops,
}: {
  fairId: string;
  shops: Shop[];
}) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-stone-900">
        ร้านค้าที่เข้าร่วมรายการ
      </h2>

      {shops.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-400">
          ไม่พบร้านค้าที่ตรงกับการค้นหาของคุณ
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {shops.map((shop) => (
            <ShopTile key={shop.id} fairId={fairId} shop={shop} />
          ))}
        </div>
      )}
    </>
  );
}