"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ Hàng Của Bạn</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="w-24 h-24 bg-teal-50 text-teal-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Giỏ hàng đang trống</h2>
          <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link href="/" className="inline-block px-8 py-3.5 bg-teal-700 text-white font-medium rounded-full shadow-lg shadow-teal-200 hover:bg-teal-700 transition">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Danh sách */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-2xl relative overflow-hidden border">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between h-full w-full">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                      <p className="text-teal-700 font-bold">{formatCurrency(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-6 mt-6">
                      {/* Quantity Control */}
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-500 hover:text-teal-700 transition">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-500 hover:text-teal-700 transition">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button onClick={() => removeItem(item.id)} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition">
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>

              <div className="space-y-4 mb-6 border-b border-gray-100 pb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-semibold text-gray-900 text-lg">Tổng cộng</span>
                <span className="text-2xl font-black text-teal-700">{formatCurrency(totalPrice)}</span>
              </div>

              <Link href="/checkout" className="w-full flex items-center justify-center gap-2 py-4 px-8 bg-teal-700 text-white font-bold rounded-full shadow-xl shadow-teal-200 hover:-translate-y-1 hover:shadow-2xl hover:bg-teal-700 transition">
                Tiến Hành Thanh Toán <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
