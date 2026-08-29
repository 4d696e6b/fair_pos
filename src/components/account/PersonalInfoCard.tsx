import { User as UserIcon } from "lucide-react";

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  phone: string;
};

export default function PersonalInfoCard({
  info,
  onChange,
}: {
  info: PersonalInfo;
  onChange: (info: PersonalInfo) => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-4">
        <UserIcon size={18} className="text-orange-700" />
        <h2 className="font-bold text-stone-900">ข้อมูลส่วนตัว</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-stone-500">
            ชื่อ
          </span>
          <input
            type="text"
            value={info.firstName}
            onChange={(e) => onChange({ ...info, firstName: e.target.value })}
            placeholder="ชื่อ"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-stone-500">
            นามสกุล
          </span>
          <input
            type="text"
            value={info.lastName}
            onChange={(e) => onChange({ ...info, lastName: e.target.value })}
            placeholder="นามสกุล"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-stone-500">
            เบอร์โทรศัพท์
          </span>
          <input
            type="tel"
            value={info.phone}
            onChange={(e) => onChange({ ...info, phone: e.target.value })}
            placeholder="เบอร์โทรศัพท์"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white"
          />
        </label>
      </div>
    </div>
  );
}