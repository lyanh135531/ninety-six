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
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Parse sizes string: "S, M, L" -> ["S", "M", "L"]
  const availableSizes = product.sizes 
    ? product.sizes.split(",").map(s => s.trim()).filter(s => s !== "") 
    : [];

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
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setShowError(false);
                }}
                className={`min-w-[56px] h-12 flex items-center justify-center rounded-2xl font-bold transition-all border-2 cursor-pointer ${
                  selectedSize === size
                    ? "bg-teal-700 border-teal-700 text-white shadow-lg shadow-teal-100 scale-105"
                    : "bg-white border-gray-100 text-gray-600 hover:border-teal-700 hover:text-teal-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {showError && (
            <div className="flex items-center gap-2 text-rose-500 text-sm font-bold animate-pulse">
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
        disabled={hasSizes && !selectedSize}
        onAddAttempt={handleAddAttempt}
      />
    </div>
  );
}
