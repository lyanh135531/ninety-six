"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-teal-700 hover:border-teal-700 transition-all cursor-pointer hover:-translate-x-0.5 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-100 text-gray-200">
          <ChevronLeft className="w-4 h-4" />
        </div>
      )}

      {/* Pages */}
      {showPages.map((page, idx) => {
        const prev = showPages[idx - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="text-gray-300 text-sm font-bold">...</span>
            )}
            <Link
              href={getPageUrl(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
                page === currentPage
                  ? "bg-teal-700 text-white shadow-lg shadow-teal-200"
                  : "border border-gray-200 bg-white text-gray-500 hover:text-teal-700 hover:border-teal-700"
              }`}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-teal-700 hover:border-teal-700 transition-all cursor-pointer hover:translate-x-0.5 active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-100 text-gray-200">
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
