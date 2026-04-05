"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { AlertCircle, Ruler } from "lucide-react";
import Link from "next/link";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    sizes?: string | null;
    stockBySizes?: string | null;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const availableSizes = product.sizes
    ? product.sizes.split(",").map(s => s.trim()).filter(s => s !== "")
    : [];

  const stock = (() => {
    try { return JSON.parse(product.stockBySizes || "{}"); }
    catch { return {}; }
  })();

  const hasSizes = availableSizes.length > 0;

  const totalStock =
    stock["_total"] !== undefined
      ? stock["_total"]

      : (Object.values(stock).reduce((a: number, b: unknown) => a + ((b as number) || 0), 0) as number);

  const isProductOutOfStock = !hasSizes && totalStock <= 0;

  const handleAddAttempt = () => {
    if (hasSizes && !selectedSize) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3500);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Size Selector ── */}
      {hasSizes && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-teal-900 uppercase tracking-wider">
              Kích thước
              {selectedSize && (
                <span className="ml-2 text-[11px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 normal-case tracking-normal">
                  Đã chọn: {selectedSize}
                </span>
              )}
            </span>
            <Link
              href="/pages/size-guide"
              className="flex items-center gap-1 text-[11px] font-bold text-teal-800/40 hover:text-teal-900 transition-colors cursor-pointer"
            >
              <Ruler className="w-3 h-3" />
              Hướng dẫn size
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {availableSizes.map((size) => {
              const itemStock = stock[size] !== undefined ? stock[size] : 0;
              const isOut = itemStock <= 0;
              const isLow = itemStock > 0 && itemStock <= 3;
              const isSelected = selectedSize === size;

              return (
                <div key={size} className="relative">
                  <button
                    disabled={isOut}
                    onClick={() => { setSelectedSize(size); setShowError(false); }}
                    className={`relative min-w-[56px] h-12 px-3 rounded-2xl font-bold text-sm border-2 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${isSelected
                      ? "bg-teal-700 border-teal-700 text-white shadow-lg shadow-teal-100 scale-105"
                      : isOut
                        ? "bg-gray-50 border-gray-100 text-teal-800/30 cursor-not-allowed opacity-60"
                        : "bg-white border-gray-200 text-teal-800 hover:border-teal-600 hover:text-teal-900 hover:scale-105"
                      }`}
                    aria-pressed={isSelected}
                    aria-label={`Size ${size}${isOut ? " - Hết hàng" : ""}`}
                  >
                    {size}
                    {isOut && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="block w-[calc(100%-12px)] h-px bg-gray-300 rotate-45" />
                      </span>
                    )}
                  </button>

                  {/* Low stock warning badge */}
                  {isLow && !isOut && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow border border-white whitespace-nowrap">
                      Còn {itemStock}
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-teal-700 border-2 border-white rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 8 8" className="w-2 h-2" fill="none">
                        <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error message */}
          {showError && (
            <div className="flex items-center gap-2.5 text-rose-600 text-sm font-semibold bg-rose-50 px-4 py-3 rounded-2xl border border-rose-100 animate-fade-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Vui lòng chọn kích cỡ trước khi thêm vào giỏ!</span>
            </div>
          )}
        </div>
      )}

      {/* ── Add to Cart Button ── */}
      <AddToCartButton
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          size: selectedSize || undefined,
        }}
        disabled={(hasSizes && !selectedSize) || isProductOutOfStock}
        onAddAttempt={handleAddAttempt}
      />

      {/* Out of stock notice */}
      {isProductOutOfStock && (
        <div className="flex items-center gap-2.5 text-rose-600 text-sm font-semibold bg-rose-50 px-4 py-3.5 rounded-2xl border border-rose-100 text-center justify-center">
          📍 Sản phẩm hiện đã hết hàng. Vui lòng quay lại sau!
        </div>
      )}
    </div>
  );
}
