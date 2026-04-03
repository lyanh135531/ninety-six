"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createOrder } from "./actions";
import {
  CheckCircle2, Loader2, ArrowLeft, ShoppingBag,
  User, Phone, MapPin, CreditCard, Truck, Package,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PaymentMethod = "COD" | "BANK_TRANSFER";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("COD");

  const { items, totalPrice, clearCart } = useCartStore();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  /* ── Empty cart ── */
  if (items.length === 0 && !successId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-black text-gray-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-400 text-sm mb-6">Bạn chưa chọn sản phẩm nào để thanh toán.</p>
        <Link
          href="/"
          className="px-7 py-3 bg-teal-700 text-white font-bold text-sm rounded-full hover:bg-teal-800 hover:-translate-y-0.5 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  /* ── Success screen ── */
  if (successId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 max-w-md mx-auto">
        {/* Animated check */}
        <div className="relative w-24 h-24 mb-8">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-30" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-3">Đặt Hàng Thành Công! 🎉</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Cảm ơn bạn đã tin tưởng mua sắm tại Ninety Six Store.
        </p>

        <div className="my-5 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 w-full">
          <p className="text-xs text-gray-400 font-medium mb-1">Mã đơn hàng của bạn</p>
          <p className="text-xl font-black text-teal-900 tracking-wider">
            #{successId.slice(-8).toUpperCase()}
          </p>
        </div>

        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          Chúng tôi sẽ liên hệ xác nhận trong vòng <strong>15 phút</strong>. Vui lòng giữ điện thoại!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/order-tracking"
            className="flex-1 py-3.5 bg-teal-700 text-white font-bold text-sm rounded-2xl text-center hover:bg-teal-800 active:scale-95 transition-all cursor-pointer shadow-lg shadow-teal-100"
          >
            Tra cứu đơn hàng
          </Link>
          <Link
            href="/"
            className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-2xl text-center hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    formData.set("paymentMethod", payment);
    const res = await createOrder(formData, items, totalPrice);
    if (res.success) {
      setSuccessId(res.orderId);
      clearCart();
    }
    setSubmitting(false);
  };

  const inputClass =
    "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 focus:bg-white transition-all placeholder:text-gray-400 hover:border-gray-300";

  return (
    <div className="min-h-screen bg-gray-50/40">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl py-4 flex items-center gap-4">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-900 font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Giỏ hàng
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-bold text-gray-800">Thanh toán</span>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left: Form ── */}
          <div className="flex-1 min-w-0">
            <form action={handleSubmit} id="checkout-form" className="space-y-6">

              {/* Shipping Info */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-5"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 text-teal-600" />
                  </div>
                  <h2 className="font-black text-gray-900 text-base">Thông tin giao hàng</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Họ &amp; Tên <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                      <input
                        name="customerName"
                        type="text"
                        required
                        className={`${inputClass} pl-10`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                      <input
                        name="customerPhone"
                        type="tel"
                        required
                        className={`${inputClass} pl-10`}
                        placeholder="0901 234 567"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Địa chỉ giao hàng <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300 pointer-events-none" />
                    <textarea
                      name="customerAddress"
                      rows={3}
                      required
                      className={`${inputClass} pl-10 resize-none`}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-teal-600" />
                  </div>
                  <h2 className="font-black text-gray-900 text-base">Phương thức thanh toán</h2>
                </div>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPayment("COD")}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${payment === "COD"
                    ? "border-teal-600 bg-teal-50/60"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${payment === "COD" ? "bg-teal-100 text-teal-900" : "bg-gray-100 text-gray-400"
                    }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${payment === "COD" ? "text-teal-900" : "text-gray-700"}`}>
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Giao hàng tận nơi, trả tiền mặt trực tiếp cho shipper
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${payment === "COD" ? "border-teal-600 bg-teal-600" : "border-gray-300"
                    }`}>
                    {payment === "COD" && (
                      <svg viewBox="0 0 8 8" className="w-2.5 h-2.5" fill="none">
                        <circle cx="4" cy="4" r="2.5" fill="white" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setPayment("BANK_TRANSFER")}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${payment === "BANK_TRANSFER"
                    ? "border-teal-600 bg-teal-50/60"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${payment === "BANK_TRANSFER" ? "bg-teal-100 text-teal-900" : "bg-gray-100 text-gray-400"
                    }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${payment === "BANK_TRANSFER" ? "text-teal-900" : "text-gray-700"}`}>
                      Chuyển khoản ngân hàng
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Vietcombank · 0123456789 · MOM AND BABY STORE
                    </p>
                    {payment === "BANK_TRANSFER" && (
                      <p className="text-xs text-teal-600 font-semibold mt-1.5 italic">
                        Nội dung CK: Mã đơn hàng + SĐT (sau khi đặt thành công)
                      </p>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${payment === "BANK_TRANSFER" ? "border-teal-600 bg-teal-600" : "border-gray-300"
                    }`}>
                    {payment === "BANK_TRANSFER" && (
                      <svg viewBox="0 0 8 8" className="w-2.5 h-2.5" fill="none">
                        <circle cx="4" cy="4" r="2.5" fill="white" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden sticky top-24"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

              {/* Summary Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Package className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="font-black text-gray-900 text-base">Tóm tắt đơn hàng</h3>
              </div>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 px-6 py-3">
                    {/* Image */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 relative">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                      {/* Quantity badge */}
                      <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-gray-700 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      {item.size && (
                        <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md uppercase">
                          Size {item.size}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-black text-gray-700 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-700">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Phí giao hàng</span>
                  <span className="font-bold text-emerald-600">Miễn phí 🎉</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-black text-gray-900">Tổng thanh toán</span>
                  <span className="text-2xl font-black text-teal-900">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Submit */}
              <div className="px-6 pb-6">
                <button
                  form="checkout-form"
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2.5 py-4 font-black text-white text-sm rounded-2xl cursor-pointer active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: submitting
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #0f766e, #0d9488)",
                    boxShadow: submitting ? "none" : "0 8px 24px rgba(15,118,110,0.28)",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Xác Nhận Đặt Hàng
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-3">
                  🔒 Thông tin của bạn được bảo mật tuyệt đối
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
