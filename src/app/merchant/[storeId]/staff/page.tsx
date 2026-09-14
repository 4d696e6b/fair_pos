"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import {
  createStaffMember,
  deleteStaffMember,
  listStaffForShop,
  updateStaffMember,
} from "@/features/staff";
import type { StaffMember, StaffStatus } from "@/lib/types";

const STAFF_ROLES = [
  { value: "แคชเชียร์", hint: "รับออเดอร์และชำระเงิน" },
  { value: "ครัว", hint: "จัดการคิวครัว" },
  { value: "ผู้จัดการ", hint: "ดูรายงานและจัดการร้าน" },
] as const;

const inputClass =
  "rounded-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400";

export default function StaffPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>(STAFF_ROLES[0].value);
  const [status, setStatus] = useState<StaffStatus>("active");

  const load = async () => {
    setMembers(await listStaffForShop(storeId));
  };

  useEffect(() => {
    void load();
  }, [storeId]);

  const staff = members.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(search.toLowerCase()),
  );

  const resetForm = () => {
    setName("");
    setRole(STAFF_ROLES[0].value);
    setStatus("active");
    setAdding(false);
    setEditing(null);
  };

  const openEdit = (member: StaffMember) => {
    setAdding(false);
    setEditing(member);
    setName(member.name);
    setRole(member.role);
    setStatus(member.status);
  };

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    await createStaffMember({
      shopId: storeId,
      name: name.trim(),
      employeeId: `EMP-${Math.floor(Math.random() * 900) + 100}`,
      role,
    });
    resetForm();
    await load();
  };

  const handleEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    await updateStaffMember(editing.id, {
      name: name.trim(),
      role,
      status,
    });
    resetForm();
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">พนักงานและสิทธิ์</h1>
          <p className="mt-1 text-sm text-stone-400">จัดการทีมงานและบทบาทในร้าน (ยังไม่ได้ผูกกับบัญชีล็อกอิน)</p>
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
          <button
            onClick={() => {
              setEditing(null);
              setAdding((open) => !open);
              setName("");
              setRole(STAFF_ROLES[0].value);
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
          >
            <Plus size={16} />
            เพิ่มพนักงาน
          </button>
        </div>
      </div>

      {adding || editing ? (
        <form
          onSubmit={editing ? handleEdit : handleAdd}
          className="mb-4 flex flex-wrap items-end gap-2 rounded-2xl border border-stone-100 bg-white p-4"
        >
          <label className="text-xs text-stone-500">
            ชื่อ
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อพนักงาน"
              className={`mt-1 block ${inputClass}`}
            />
          </label>
          <label className="text-xs text-stone-500">
            บทบาท
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`mt-1 block ${inputClass}`}
            >
              {STAFF_ROLES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value} — {item.hint}
                </option>
              ))}
              {role && !STAFF_ROLES.some((item) => item.value === role) ? (
                <option value={role}>{role}</option>
              ) : null}
            </select>
          </label>
          {editing ? (
            <label className="text-xs text-stone-500">
              สถานะ
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StaffStatus)}
                className={`mt-1 block ${inputClass}`}
              >
                <option value="active">ACTIVE</option>
                <option value="inactive">INACTIVE</option>
              </select>
            </label>
          ) : null}
          <button type="submit" className="rounded-full bg-orange-700 px-4 py-2 text-sm font-semibold text-white">
            บันทึก
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full px-3 py-2 text-stone-400 hover:text-stone-700"
            aria-label="ยกเลิก"
          >
            <X size={16} />
          </button>
        </form>
      ) : null}

      <div className="rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-6 py-4">
          <p className="font-bold text-stone-900">Team Members</p>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-stone-400">
              <th className="px-6 py-3 font-medium">พนักงาน</th>
              <th className="px-6 py-3 font-medium">บทบาท</th>
              <th className="px-6 py-3 font-medium">สิทธิ์</th>
              <th className="px-6 py-3 font-medium">สถานะ</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => {
              const roleMeta = STAFF_ROLES.find((item) => item.value === member.role);
              return (
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
                  <td className="px-6 py-4 text-xs text-stone-400">{roleMeta?.hint ?? "กำหนดเอง"}</td>
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
                      <button
                        aria-label="แก้ไข"
                        onClick={() => openEdit(member)}
                        className="cursor-pointer transition hover:text-orange-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label="ลบ"
                        onClick={() => void deleteStaffMember(member.id).then(load)}
                        className="cursor-pointer transition hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
