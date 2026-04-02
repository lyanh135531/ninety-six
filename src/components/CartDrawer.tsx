"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, totalPrice, isDrawerOpen, setDrawerOpen, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Giỏ Hàng</h2>
          </div>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90 cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <p className="text-gray-500 font-medium">Giỏ hàng của bạn đang trống</p>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="text-teal-700 font-bold hover:underline cursor-pointer"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden relative flex-shrink-0 border border-gray-100">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">Không có ảnh</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight group-hover:text-teal-700 transition-colors">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-teal-700 font-black text-sm mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 h-8">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 h-full text-gray-400 hover:text-teal-700 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 h-full text-gray-400 hover:text-teal-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-black text-gray-400">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Tổng cộng:</span>
              <span className="text-xl font-black text-teal-700">{formatCurrency(totalPrice)}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center italic">Phí vận chuyển sẽ được tính tại trang thanh toán.</p>
            <div className="grid grid-cols-1 gap-3">
              <Link 
                href="/checkout" 
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-teal-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-teal-200 hover:bg-teal-800 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Thanh Toán Ngay <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/cart" 
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-white text-teal-700 font-bold py-3 rounded-2xl border border-teal-100 hover:bg-teal-50 transition-all text-center text-sm cursor-pointer"
              >
                Xem chi tiết giỏ hàng
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
