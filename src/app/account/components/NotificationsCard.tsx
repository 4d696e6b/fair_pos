import { Bell } from "lucide-react";

export type NotificationPrefs = {
  email: boolean;
  salesSummary: boolean;
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={
        "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition " +
        (checked ? "bg-orange-700" : "bg-stone-200")
      }
    >
      <span
        className={
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition " +
          (checked ? "left-5" : "left-0.5")
        }
      />
    </button>
  );
}

export default function NotificationsCard({
  prefs,
  onChange,
}: {
  prefs: NotificationPrefs;
  onChange: (prefs: NotificationPrefs) => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-4">
        <Bell size={18} className="text-orange-700" />
        <h2 className="font-bold text-stone-900">การแจ้งเตือน</h2>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-800">
              การแจ้งเตือนทางอีเมล
            </p>
            <p className="text-xs text-stone-400">รับข่าวสารและโปรโมชั่น</p>
          </div>
          <Toggle
            checked={prefs.email}
            onChange={(v) => onChange({ ...prefs, email: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-800">
              การแจ้งเตือนยอดขาย
            </p>
            <p className="text-xs text-stone-400">รับสรุปยอดขายรายวัน</p>
          </div>
          <Toggle
            checked={prefs.salesSummary}
            onChange={(v) => onChange({ ...prefs, salesSummary: v })}
          />
        </div>
      </div>
    </div>
  );
}