"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, ChevronDown, Check, LayoutGrid, Star } from "lucide-react";
import { useCallback, useTransition, useState, useRef, useEffect } from "react";

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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const featured = searchParams.get("featured") || "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const selectedCategoryName = categories.find(c => c.id === categoryId)?.name || "Tất cả danh mục";
  const hasFilters = q || categoryId || featured;

  return (
    <div className={`flex flex-wrap items-center gap-4 transition-all ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Tìm kiếm */}
      <div className="relative flex-1 min-w-[280px] group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-teal-700 transition-colors" />
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          defaultValue={q}
          onChange={(e) => updateParam("q", e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 focus:bg-white focus:border-teal-700 focus:ring-4 focus:ring-teal-700/5 rounded-2xl outline-none text-sm font-medium text-gray-900 placeholder:text-gray-300 transition-all shadow-sm"
        />
      </div>

      {/* Lọc Danh mục Custom */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className={`flex items-center gap-3 px-5 py-3 bg-white border transition-all rounded-2xl outline-none cursor-pointer shadow-sm min-w-[200px] justify-between ${
            isCategoryOpen ? "border-teal-700 ring-4 ring-teal-700/5" : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutGrid className={`w-4 h-4 ${categoryId ? "text-teal-700" : "text-gray-400"}`} />
            <span className={`text-sm font-bold truncate max-w-[150px] ${categoryId ? "text-gray-900" : "text-gray-500"}`}>
              {selectedCategoryName}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isCategoryOpen ? "rotate-180 text-teal-700" : ""}`} />
        </button>

        {isCategoryOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-50 rounded-2xl shadow-xl p-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 min-w-[240px]">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => {
                  updateParam("categoryId", "");
                  setIsCategoryOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all mb-1 last:mb-0 text-left ${
                  !categoryId ? "bg-teal-50 text-teal-700 font-extrabold" : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <span className="text-sm">Tất cả danh mục</span>
                {!categoryId && <Check className="w-4 h-4" />}
              </button>
              <div className="h-px bg-gray-50 my-1" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    updateParam("categoryId", cat.id);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all mb-1 last:mb-0 text-left ${
                    categoryId === cat.id ? "bg-teal-50 text-teal-700 font-extrabold" : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <span className="text-sm">{cat.name}</span>
                  {categoryId === cat.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lọc Nổi bật */}
      <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl gap-1.5 border border-gray-100 shadow-sm">
        {[
          { value: "", label: "Tất cả", icon: null },
          { value: "true", label: "Nổi bật", icon: Star },
          { value: "false", label: "Thường", icon: null },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => updateParam("featured", value)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              featured === value
                ? "bg-white text-teal-700 shadow-sm border border-gray-100"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${featured === value ? "fill-teal-700" : ""}`} />}
            {label}
          </button>
        ))}
      </div>

      {/* Nút Làm mới - Luôn giữ chỗ để tránh giật màn hình */}
      <div className={`ml-auto transition-all duration-300 ${hasFilters ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}`}>
        <button
          onClick={clearAll}
          className="flex items-center gap-2 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-rose-100 bg-white shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
        >
          <X className="w-4 h-4" /> Làm mới
        </button>
      </div>
    </div>
  );
}
