"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { CartLine } from "@/lib/types";

export default function CartLineItem({
  line,
  onUpdateQty,
  onUpdateNote,
}: {
  line: CartLine;
  onUpdateQty: (itemId: string, qty: number) => void;
  onUpdateNote: (itemId: string, note: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(line.note ?? "");

  const saveNote = () => {
    onUpdateNote(line.item.id, draft.trim());
    setEditing(false);
  };

  return (
    <div className="flex items-start justify-between gap-2 rounded-xl border border-stone-100 p-3">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={line.item.image}
            alt={line.item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-900">
            {line.item.name}
          </p>

          {editing ? (
            <div className="mt-1 flex items-center gap-1.5">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveNote()}
                onBlur={saveNote}
                placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย..."
                maxLength={80}
                className="w-full max-w-[160px] rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 outline-none focus:border-orange-400"
              />
            </div>
          ) : line.note ? (
            <button
              onClick={() => setEditing(true)}
              className="mt-0.5 flex cursor-pointer items-center gap-1 text-xs text-stone-500 hover:text-orange-700"
            >
              <Pencil size={10} />
              <span className="truncate max-w-[160px]">{line.note}</span>
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="mt-0.5 cursor-pointer text-xs text-stone-400 hover:text-orange-700"
            >
              + เพิ่มโน้ต
            </button>
          )}

          <p className="mt-1 text-xs text-orange-700">
            ฿{(line.item.price * line.qty).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => onUpdateQty(line.item.id, line.qty - 1)}
          aria-label="ลดจำนวน"
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-stone-400"
        >
          {line.qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
        </button>
        <span className="w-4 text-center text-sm font-medium">{line.qty}</span>
        <button
          onClick={() => onUpdateQty(line.item.id, line.qty + 1)}
          aria-label="เพิ่มจำนวน"
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-stone-400"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}