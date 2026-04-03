"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/Admin/ToastProvider";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    slug: string;
    isFeatured: boolean;
    sizes?: string | null;
    stockBySizes?: string | null;
    category: {
      name: string;
    };
    createdAt: string | Date;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const availableSizes = product.sizes 
    ? product.sizes.split(",").map(s => s.trim()).filter(s => s !== "") 
    : [];
  
  const hasSizes = availableSizes.length > 0;
  
  const stock = (() => {
    try {
      return JSON.parse(product.stockBySizes || "{}");
    } catch {
      return {};
    }
  })();

  const totalStock = stock["_total"] !== undefined 
    ? stock["_total"] 
    : Object.values(stock).reduce((a: any, b: any) => a + (b || 0), 0) as number;

  const isOutOfStock = totalStock <= 0;
  const isNew = (new Date().getTime() - new Date(product.createdAt).getTime()) < 14 * 24 * 60 * 60 * 1000;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasSizes) {
      setIsModalOpen(true);
    } else {
      setIsAdding(true);
      setTimeout(() => {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
        });
        showToast(`Đã thêm ${product.name} vào giỏ hàng!`);
        setIsAdding(false);
      }, 500);
    }
  };

  const handleDirectAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        size: size,
      });
      showToast(`Đã thêm ${product.name} (Size: ${size}) vào giỏ hàng!`);
      setIsAdding(false);
    }, 500);
  };

  return (
    <>
      <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 active:scale-[0.98] transition-all duration-500 border border-transparent hover:border-teal-100 flex flex-col h-full">
        {/* Image Section */}
        <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.name} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Không có ảnh</div>
          )}
          
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20 transition-all duration-500">
              <div className="bg-rose-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-2xl tracking-[0.2em] animate-pulse">
                HẾT HÀNG
              </div>
            </div>
          )}
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isFeatured && (
              <div className="bg-teal-700 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-white" /> NỔI BẬT
              </div>
            )}
            {isNew && (
              <div className="bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                MỚI ✨
              </div>
            )}
          </div>

          {/* QUICK ACTION OVERLAY (DESKTOP) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 hidden md:block">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/20">
              {hasSizes ? (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">Chọn kích cỡ của bạn</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {availableSizes.map(size => {
                      const itemStock = stock[size] !== undefined ? stock[size] : 0;
                      const sizeOutOfStock = itemStock <= 0;
                      
                      return (
                        <button
                          key={size}
                          disabled={isAdding || sizeOutOfStock}
                          onClick={(e) => handleDirectAdd(e, size)}
                          className={`min-w-[40px] h-9 flex items-center justify-center rounded-xl border text-xs font-bold transition-all cursor-pointer disabled:opacity-40 relative group/btn ${
                            sizeOutOfStock 
                              ? "bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed" 
                              : "bg-white border-gray-100 text-gray-700 hover:bg-teal-700 hover:border-teal-700 hover:text-white"
                          }`}
                        >
                          {size}
                          {sizeOutOfStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1px] bg-gray-300 rotate-45" /></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleQuickAdd}
                  disabled={isAdding || isOutOfStock}
                  className="w-full py-3 bg-teal-700 text-white font-black text-xs rounded-xl shadow-lg hover:bg-teal-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 disabled:bg-gray-400"
                >
                  <ShoppingBag className={`w-4 h-4 ${isAdding ? 'animate-bounce' : ''}`} /> 
                  {isAdding ? "ĐANG THÊM..." : isOutOfStock ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
                </button>
              )}
            </div>
          </div>
        </Link>

        {/* Info Section */}
        <div className="p-5 flex-1 flex flex-col">
          <Link href={`/product/${product.slug}`} className="flex-1 cursor-pointer">
            <span className="text-[10px] font-black text-teal-600 tracking-[0.2em] uppercase bg-teal-50 px-2.5 py-1 rounded-md inline-block">
              {product.category.name}
            </span>
            <h3 className="mt-3 text-gray-900 font-bold line-clamp-1 group-hover:text-teal-700 transition-colors text-base">
              {product.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-xl font-black text-teal-700">
                {formatCurrency(product.price)}
              </p>
              {hasSizes && (
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {availableSizes.length} Sizes
                </span>
              )}
            </div>
          </Link>
          
          {/* Action Label (DESKTOP) */}
          <div className="mt-4 pt-4 border-t border-gray-50 hidden md:flex items-center justify-between">
             <button 
               onClick={handleQuickAdd}
               disabled={isAdding || (isOutOfStock && !hasSizes)}
               className="text-[11px] font-black text-teal-700 hover:underline flex items-center gap-1.5 cursor-pointer uppercase tracking-wider disabled:opacity-50 disabled:text-gray-400 disabled:no-underline"
             >
                <ShoppingBag className="w-3.5 h-3.5" /> {isOutOfStock && !hasSizes ? "Hết hàng" : hasSizes ? "Chọn Size" : "Thêm vào giỏ"}
             </button>
             <Link href={`/product/${product.slug}`} className="text-[11px] font-bold text-gray-400 hover:text-teal-700 cursor-pointer">
               Chi tiết →
             </Link>
          </div>

          {/* MOBILE PRIMARY ACTION (Always Visible) */}
          <div className="mt-4 md:hidden">
            <button 
              onClick={handleQuickAdd}
              disabled={isAdding || (isOutOfStock && !hasSizes)}
              className={`w-full py-3.5 text-white font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 ${
                isOutOfStock && !hasSizes ? "bg-gray-400" : "bg-teal-700"
              }`}
            >
              {isOutOfStock && !hasSizes ? (
                <>HẾT HÀNG</>
              ) : hasSizes ? (
                <>CHỌN KÍCH CỠ</>
              ) : (
                <>
                  <ShoppingBag className={`w-4 h-4 ${isAdding ? 'animate-bounce' : ''}`} /> 
                  {isAdding ? "ĐANG THÊM..." : "THÊM VÀO GIỎ"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* QUICK SIZE SELECTION MODAL (FALLBACK & MOBILE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-gray-900 uppercase">Chọn Kích Thước</h4>
              <p className="text-sm text-gray-400 mt-1">{product.name}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {availableSizes.map(size => {
                const itemStock = stock[size] !== undefined ? stock[size] : 0;
                const sizeOutOfStock = itemStock <= 0;

                return (
                  <button
                    key={size}
                    disabled={isAdding || sizeOutOfStock}
                    onClick={(e) => {
                      handleDirectAdd(e, size);
                      setIsModalOpen(false);
                    }}
                    className={`h-12 rounded-2xl font-bold border-2 transition-all flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-40 ${
                      sizeOutOfStock
                        ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                        : "border-gray-100 text-gray-500 hover:border-teal-700 hover:bg-teal-50 hover:text-teal-700"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Giao hàng nhanh toàn quốc
            </p>
          </div>
        </div>
      )}
    </>
  );
}
