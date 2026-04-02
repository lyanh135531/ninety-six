"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useTransition } from "react";

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const featured = searchParams.get("featured") || "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset về trang 1 khi filter
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = q || categoryId || featured;

  return (
    <div className={`flex flex-wrap items-center gap-3 transition-opacity ${isPending ? "opacity-50" : ""}`}>
      {/* Tìm kiếm */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          defaultValue={q}
          onChange={(e) => updateParam("q", e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 rounded-2xl outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300 transition-all"
        />
      </div>

      {/* Lọc Danh mục */}
      <div className="relative">
        <select
          value={categoryId}
          onChange={(e) => updateParam("categoryId", e.target.value)}
          className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-gray-200 focus:border-teal-700 rounded-2xl outline-none text-sm font-medium text-gray-700 cursor-pointer transition-all"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Lọc Nổi bật */}
      <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 gap-1">
        {[
          { value: "", label: "Tất cả" },
          { value: "true", label: "⭐ Nổi bật" },
          { value: "false", label: "Thường" },
        ].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => updateParam("featured", value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              featured === value
                ? "bg-teal-700 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Clear Filter */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl text-xs font-bold transition-all border border-dashed border-gray-200 hover:border-red-200 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" /> Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
