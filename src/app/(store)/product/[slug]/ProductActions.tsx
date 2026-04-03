"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { AlertCircle } from "lucide-react";

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

  // Parse sizes string: "S, M, L" -> ["S", "M", "L"]
  const availableSizes = product.sizes 
    ? product.sizes.split(",").map(s => s.trim()).filter(s => s !== "") 
    : [];

  const stock = (() => {
    try {
      return JSON.parse(product.stockBySizes || "{}");
    } catch {
      return {};
    }
  })();

  const hasSizes = availableSizes.length > 0;

  const handleAddAttempt = () => {
    if (hasSizes && !selectedSize) {
      setShowError(true);
      // Auto-hide error after 3s
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {hasSizes && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Chọn Kích Thước:</span>
            {selectedSize && (
              <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                Đã chọn: {selectedSize}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => {
              const itemStock = stock[size] !== undefined ? stock[size] : 0;
              const isOutOfStock = itemStock <= 0;
              const isLowStock = itemStock > 0 && itemStock <= 3;

              return (
                <div key={size} className="relative">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowError(false);
                    }}
                    className={`min-w-[64px] h-12 flex flex-col items-center justify-center rounded-2xl font-bold transition-all border-2 cursor-pointer relative ${
                      selectedSize === size
                        ? "bg-teal-700 border-teal-700 text-white shadow-lg shadow-teal-100 scale-105"
                        : isOutOfStock
                        ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60"
                        : "bg-white border-gray-100 text-gray-600 hover:border-teal-700 hover:text-teal-700"
                    }`}
                  >
                    <span>{size}</span>
                    {isOutOfStock && <span className="text-[8px] absolute bottom-1 uppercase font-black opacity-40">Hết</span>}
                  </button>
                  {isLowStock && !isOutOfStock && (
                    <div className="absolute -top-2 -right-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-pulse border border-white">
                       CÒN {itemStock}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showError && (
            <div className="flex items-center gap-2 text-rose-500 text-sm font-bold animate-bounce bg-rose-50 p-3 rounded-xl border border-rose-100">
              <AlertCircle className="w-4 h-4" />
              <span>Vui lòng chọn kích cỡ bạn mong muốn!</span>
            </div>
          )}
        </div>
      )}

      <AddToCartButton
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          size: selectedSize || undefined,
        }}
        disabled={(hasSizes && !selectedSize) || (!hasSizes && (stock["_total"] || 0) <= 0)}
        onAddAttempt={handleAddAttempt}
      />
      
      {!hasSizes && (stock["_total"] || 0) <= 0 && (
        <p className="text-center text-rose-500 font-bold text-sm bg-rose-50 p-4 rounded-2xl border border-rose-100">
          📍 Sản phẩm này hiện đã hết hàng. Vui lòng quay lại sau!
        </p>
      )}
    </div>
  );
}
