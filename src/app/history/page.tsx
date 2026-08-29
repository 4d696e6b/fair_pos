import SiteHeader from "@/components/SiteHeader";

export default function HistoryPage() {
  return (
    <div>
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-xl font-bold text-stone-900">ประวัติการสั่งซื้อ</h1>
        <p className="mt-2 text-sm text-stone-400">
          ยังไม่มีประวัติการสั่งซื้อ เริ่มค้นหางานแฟร์เพื่อสั่งอาหารได้เลย
        </p>
      </div>
    </div>
  );
}
