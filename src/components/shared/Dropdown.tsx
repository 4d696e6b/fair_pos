"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type DropdownProps<T> = {
  items: T[];
  getKey: (item: T) => string | number;
  isSelected?: (item: T) => boolean;
  onSelect: (item: T) => void;
  renderTrigger: (opts: { isOpen: boolean }) => ReactNode;
  renderItem: (item: T, opts: { isSelected: boolean }) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  panelClassName?: string;
};

export default function Dropdown<T>({
  items,
  getKey,
  isSelected,
  onSelect,
  renderTrigger,
  renderItem,
  align = "center",
  className = "",
  panelClassName = "",
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const alignClass =
    align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";

  return (
    <div ref={containerRef} className={`relative w-full flex items-center justify-center ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="cursor-pointer w-full flex items-center justify-center "
      >
        {renderTrigger({ isOpen })}
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className={`absolute top-full z-10 mt-2 w-40 overflow-hidden rounded-xl border border-stone-100 bg-white py-1 shadow-lg ${alignClass} ${panelClassName}`}
        >
          {items.map((item) => {
            const selected = isSelected?.(item) ?? false;
            return (
              <button
                key={getKey(item)}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-orange-50"
              >
                {renderItem(item, { isSelected: selected })}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}