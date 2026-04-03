"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function AdminSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQuery = params.get("q") || "";

    if (debouncedQuery !== currentQuery) {
      if (debouncedQuery) {
        params.set("q", debouncedQuery);
      } else {
        params.delete("q");
      }
      // Reset to page 1 when searching
      params.set("page", "1");
      
      const newSearch = params.toString();
      router.push(newSearch ? `?${newSearch}` : window.location.pathname);
    }
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="relative group w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className={`w-4 h-4 transition-colors duration-300 ${query ? "text-teal-600" : "text-gray-400"}`} />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm tên, SĐT hoặc mã đơn..."
        className="w-full bg-white/80 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-10 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/50 transition-all shadow-sm group-hover:shadow-md"
      />

      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-rose-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Glass Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition-opacity duration-500 pointer-events-none`} />
    </div>
  );
}
