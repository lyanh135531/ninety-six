"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type SortOption = "latest" | "price-asc" | "price-desc";
const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
];

export default function SortDropdown({
  current,
  category,
  query,
}: {
  current: SortOption;
  category: string;
  query?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentLabel = OPTIONS.find(o => o.value === current)?.label ?? "Mới nhất";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const select = (value: SortOption) => {
    setOpen(false);
    const qs = new URLSearchParams({ sort: value });
    if (query) qs.set("search", query);
    router.push(`/collections/${category}?${qs.toString()}`);
  };

  const isBaby = category !== "mom";
  const theme = {
    button: isBaby
      ? "bg-white border-rose-100 text-rose-900 hover:border-rose-400"
      : "bg-white border-gray-200 text-teal-800 hover:border-teal-600",
    chevron: isBaby ? "text-rose-800/40" : "text-teal-800/40",
    itemSelected: isBaby ? "bg-rose-50 text-rose-900 font-bold" : "bg-teal-50 text-teal-900 font-bold",
    itemDefault: isBaby ? "text-rose-800/60 hover:bg-rose-50/50 font-medium" : "text-teal-800 hover:bg-gray-50 font-medium",
    checkmark: isBaby ? "text-rose-900" : "text-teal-600",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2.5 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95 ${theme.button}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${theme.chevron} ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="animate-scale-in absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden py-1"
          role="listbox"
        >
          {OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              role="option"
              aria-selected={current === value}
              onClick={() => select(value)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors cursor-pointer text-left ${current === value ? theme.itemSelected : theme.itemDefault
                }`}
            >
              {label}
              {current === value && <Check className={`w-4 h-4 ${theme.checkmark}`} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
