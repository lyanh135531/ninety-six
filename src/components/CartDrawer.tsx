"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const FREE_SHIP_THRESHOLD = 300_000; // 300k

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, totalPrice, isDrawerOpen, setDrawerOpen, updateQuantity, removeItem } = useCartStore();

  useEffect(() => { const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t); }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  if (!mounted) return null;

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - totalPrice);
  const freeShipProgress = Math.min(100, (totalPrice / FREE_SHIP_THRESHOLD) * 100);
  const gotFreeShip = totalPrice >= FREE_SHIP_THRESHOLD;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[110] flex flex-col transition-transform duration-400 ease-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ background: "#fff", boxShadow: "var(--shadow-drawer)" }}
        aria-label="Giỏ hàng"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-900 flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-black text-teal-900 leading-none">Giỏ hàng</h2>
              {items.length > 0 && (
                <p className="text-xs text-teal-800/40 mt-0.5">{items.length} sản phẩm</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer active:scale-90"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-4 h-4 text-teal-800/60" />
          </button>
        </div>

        {/* ── Free Shipping Progress ── */}
        {items.length > 0 && (
          <div className={`px-6 py-3 ${gotFreeShip ? "bg-emerald-50 border-b border-emerald-100" : "bg-amber-50 border-b border-amber-100"}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold ${gotFreeShip ? "text-emerald-700" : "text-amber-700"}`}>
                {gotFreeShip
                  ? "🎉 Bạn được miễn phí vận chuyển!"
                  : `Còn ${formatCurrency(remaining)} nữa được miễn phí vận chuyển`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${gotFreeShip ? "bg-emerald-500" : "bg-amber-400"}`}
                style={{ width: `${freeShipProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 space-y-5 py-12">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-200" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-400 text-sm">✕</div>
              </div>
              <div>
                <p className="font-bold text-teal-900 text-base">Giỏ hàng trống</p>
                <p className="text-teal-800/40 text-sm mt-1.5 leading-relaxed">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-6 py-2.5 bg-teal-700 text-white text-sm font-bold rounded-full hover:bg-teal-800 active:scale-95 transition-all cursor-pointer shadow-md shadow-teal-100"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors group">
                  {/* Product image */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0 border border-gray-100 bg-gray-50">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-teal-800/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-teal-900 text-sm line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        {item.size && (
                          <span className="inline-block text-[9px] font-black text-teal-900 bg-teal-50 px-2 py-0.5 rounded-full mt-1 uppercase tracking-wider">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-teal-800/30 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity */}
                      <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden h-8">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          className="w-8 h-8 flex items-center justify-center text-teal-800/60 hover:text-teal-900 hover:bg-teal-50 transition-colors cursor-pointer active:scale-90"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-teal-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          className="w-8 h-8 flex items-center justify-center text-teal-800/60 hover:text-teal-900 hover:bg-teal-50 transition-colors cursor-pointer active:scale-90"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Price */}
                      <p className="text-sm font-black text-teal-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-6 pt-4 pb-6 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-teal-800/60 text-sm">
                <span>Tạm tính</span>
                <span className="font-semibold text-teal-800">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-teal-800/60 text-sm">
                <span>Vận chuyển</span>
                <span className={`font-bold ${gotFreeShip ? "text-emerald-600" : "text-teal-800/60"}`}>
                  {gotFreeShip ? "Miễn phí 🎉" : "Tính khi thanh toán"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="font-black text-teal-900">Tổng cộng</span>
                <span className="text-xl font-black text-teal-900">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid gap-2.5">
              <Link
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-4 font-black text-sm text-white rounded-2xl cursor-pointer active:scale-[0.98] transition-all"
                style={{
                  background: "linear-gradient(135deg, #0f766e, #0d9488)",
                  boxShadow: "0 8px 24px rgba(15,118,110,0.28)",
                }}
              >
                Thanh Toán Ngay <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center w-full py-3 bg-gray-100 text-teal-800 font-bold text-sm rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all cursor-pointer"
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
