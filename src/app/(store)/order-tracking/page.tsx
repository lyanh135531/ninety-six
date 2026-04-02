"use client";

import { useState } from "react";
import { searchOrder } from "./actions";
import { formatCurrency } from "@/lib/utils";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Phone, 
  MapPin, 
  Calendar 
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/Admin/ToastProvider";

export default function OrderTrackingPage() {
  const { showToast } = useToast();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) {
      showToast("Vui lòng nhập mã đơn và số điện thoại", "error");
      return;
    }

    setLoading(true);
    const result = await searchOrder(orderId, phone);
    setLoading(false);

    if (result.success) {
      setOrder(result.order);
      showToast("Đã tìm thấy đơn hàng!", "success");
    } else {
      setOrder(null);
      showToast(result.error || "Không tìm thấy đơn hàng", "error");
    }
  };

  const statusIcons: any = {
    PENDING: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Đang chờ duyệt" },
    PROCESSING: { icon: Package, color: "text-blue-500", bg: "bg-blue-50", label: "Đang xử lý" },
    SHIPPED: { icon: Truck, color: "text-purple-500", bg: "bg-purple-50", label: "Đang giao hàng" },
    COMPLETED: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", label: "Hoàn thành" },
    CANCELLED: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Đã hủy" },
  };

  const currentStatus = order ? statusIcons[order.status] : null;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Tra Cứu Đơn Hàng</h1>
        <p className="text-gray-500">Nhập thông tin để kiểm tra trạng thái đơn hàng của bạn.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-teal-900/5 border border-gray-100 overflow-hidden mb-12">
        <form onSubmit={handleSearch} className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-gray-50/50">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Mã đơn hàng</label>
            <input 
              type="text" 
              placeholder="VD: clw... hoặc 6 ký tự cuối" 
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-teal-700 outline-none transition-all shadow-sm"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Số điện thoại</label>
            <input 
              type="tel" 
              placeholder="Nhập SĐT đặt hàng" 
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-teal-700 outline-none transition-all shadow-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-teal-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-teal-200 hover:bg-teal-800 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Đang tìm..." : <><Search className="w-5 h-5" /> Tra cứu ngay</>}
          </button>
        </form>

        {order && (
          <div className="p-6 md:p-10 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Status Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-100 mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${currentStatus.bg} ${currentStatus.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <currentStatus.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Trạng thái hiện tại</p>
                  <p className={`text-xl font-black ${currentStatus.color}`}>{currentStatus.label}</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Mã đơn hàng</p>
                <p className="text-xl font-black text-gray-900">#{order.id.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Info columns */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" /> Thông tin nhận hàng
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                    <p className="font-bold text-gray-800">{order.customerName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {order.customerPhone}</p>
                    <p className="text-sm text-gray-600 flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5" /> {order.customerAddress}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" /> Chi tiết thanh toán
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hình thức</span>
                      <span className="font-bold text-gray-800">{order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản ngân hàng"}</span>
                    </div>
                    <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-900">Tổng cộng</span>
                      <span className="font-black text-teal-700 text-lg">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items column */}
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-600" /> Sản phẩm đã đặt
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {JSON.parse(order.orderItems).map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <div className="w-full h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">No Image</div>
                          )}
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                        <p className="text-teal-600 font-bold text-xs">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center text-xs font-black text-gray-400">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-gray-500 mb-4">Bạn gặp vấn đề với đơn hàng?</p>
        <Link href="/" className="inline-flex items-center gap-2 text-teal-700 font-bold hover:underline">
          Liên hệ hỗ trợ Ninety Six <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
