"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createOrder } from "./actions";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const { items, totalPrice, clearCart } = useCartStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  if (items.length === 0 && !successId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Bạn chưa chọn sản phẩm nào</h2>
        <Link href="/" className="text-teal-700 underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  if (successId) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-xl text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt Hàng Thành Công!</h1>
        <p className="text-gray-600 mb-2">Cảm ơn bạn đã mua sắm tại Ninety Six Store.</p>
        <p className="text-gray-600 mb-8">Mã đơn hàng của bạn là: <strong>#{successId.slice(-6).toUpperCase()}</strong></p>
        <Link href="/" className="px-8 py-3.5 bg-teal-700 text-white rounded-full font-medium hover:bg-teal-700 transition">
          Về Trang Chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-700 mb-8 font-medium">
        <ArrowLeft className="w-5 h-5" /> Trở Lại Giỏ Hàng
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Thông Tin Giao Hàng</h1>

          <form
            action={async (formData) => {
              setSubmitting(true);
              const res = await createOrder(formData, items, totalPrice);
              if (res.success) {
                setSuccessId(res.orderId);
                clearCart();
              }
              setSubmitting(false);
            }}
            id="checkout-form"
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Họ & Tên</span>
                <input name="customerName" type="text" required className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white" placeholder="Nguyễn Văn A" />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Số Điện Thoại</span>
                <input name="customerPhone" type="tel" required className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white" placeholder="0901234567" />
              </label>
            </div>

            <label className="block border-b border-gray-100 pb-8">
              <span className="text-gray-700 font-medium mb-2 block">Địa Chỉ Giao Hàng (Chi tiết)</span>
              <textarea name="customerAddress" rows={3} required className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white" placeholder="Số nhà, đường, phường, quận..."></textarea>
            </label>

            <h3 className="text-xl font-bold text-gray-900">Phương Thức Thanh Toán</h3>
            <div className="flex flex-col gap-4">
              <label className="relative flex cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 items-center gap-4 has-[:checked]:border-teal-700 has-[:checked]:bg-teal-50 transition">
                <input type="radio" name="paymentMethod" value="COD" defaultChecked className="w-5 h-5 text-teal-700 focus:ring-teal-700" />
                <div className="flex-1">
                  <span className="block font-semibold text-gray-900">Thanh Toán Khi Nhận Hàng (COD)</span>
                  <span className="block text-sm text-gray-500 mt-1">Giao hàng tận nơi, thanh toán trực tiếp cho shipper.</span>
                </div>
              </label>

              <label className="relative flex cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 items-center gap-4 has-[:checked]:border-teal-700 has-[:checked]:bg-teal-50 transition">
                <input type="radio" name="paymentMethod" value="BANK_TRANSFER" className="w-5 h-5 text-teal-700 focus:ring-teal-700" />
                <div className="flex-1">
                  <span className="block font-semibold text-gray-900">Chuyển Khoản Ngân Hàng</span>
                  <span className="block text-sm text-gray-500 mt-1">Vietcombank - 0123456789 - MOM AND BABY STORE</span>
                  <span className="block text-sm text-teal-700 mt-1 italic">Nội dung CK: Mã đơn hàng (sẽ hiện sau khi đặt) + SĐT</span>
                </div>
              </label>
            </div>
          </form>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-3xl border border-gray-100 p-8 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Tóm tắt đơn hàng</h3>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 pr-4">{item.quantity} x {item.name}</span>
                  <span className="font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 text-gray-600">
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
              <span className="font-bold text-gray-900 text-lg">Tổng Thanh Toán</span>
              <span className="text-2xl font-black text-teal-700">{formatCurrency(totalPrice)}</span>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-8 bg-teal-700 text-white font-bold rounded-full shadow-xl shadow-teal-200 hover:-translate-y-1 hover:shadow-2xl hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              Xác Nhận Đặt Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
