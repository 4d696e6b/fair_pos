"use client";

import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

type StaffStatus = "active" | "inactive";

type StaffMember = {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  status: StaffStatus;
};

const MOCK_STAFF: StaffMember[] = [
  { id: "1", name: "พนักงาน1", employeeId: "EMP-042", role: "Chef", status: "active" },
  { id: "2", name: "พนักงาน2", employeeId: "EMP-015", role: "Chef", status: "active" },
  { id: "3", name: "พนักงาน3", employeeId: "EMP-088", role: "Cashier", status: "inactive" },
  { id: "4", name: "พนักงาน4", employeeId: "EMP-063", role: "Financial", status: "active" },
];

export default function StaffPage() {
  const [search, setSearch] = useState("");

  const staff = MOCK_STAFF.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">พนักงานและสิทธิ์</h1>
          <p className="mt-1 text-sm text-stone-400">จัดการทีมงานและระดับการเข้าถึงระบบ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาพนักงาน..."
              className="w-56 rounded-full border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-orange-400"
            />
          </div>
          <button className="flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800">
            <Plus size={16} />
            เพิ่มพนักงาน
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-6 py-4">
          <p className="font-bold text-stone-900">Team Members</p>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-stone-400">
              <th className="px-6 py-3 font-medium">พนักงาน</th>
              <th className="px-6 py-3 font-medium">บทบาท</th>
              <th className="px-6 py-3 font-medium">สถานะ</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-t border-stone-100">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-stone-100" />
                    <div>
                      <p className="font-semibold text-stone-800">{member.name}</p>
                      <p className="text-xs text-stone-400">ID: {member.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-600">{member.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " +
                      (member.status === "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-stone-100 text-stone-500")
                    }
                  >
                    <span
                      className={
                        "h-1.5 w-1.5 rounded-full " +
                        (member.status === "active" ? "bg-emerald-500" : "bg-stone-400")
                      }
                    />
                    {member.status === "active" ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3 text-stone-400">
                    <button aria-label="แก้ไข" className="cursor-pointer transition hover:text-orange-600">
                      <Pencil size={16} />
                    </button>
                    <button aria-label="ลบ" className="cursor-pointer transition hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
