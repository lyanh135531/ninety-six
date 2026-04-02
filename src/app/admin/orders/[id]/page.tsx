import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { 
  ArrowLeft, User, Phone, MapPin, Calendar, 
  CreditCard, Package, CheckCircle, XCircle 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import OrderStatusButton from "@/components/Admin/OrderStatusButton";
import { updateOrderStatus } from "../actions";

export const dynamic = "force-dynamic";

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    notFound();
  }

  const items: CartItem[] = JSON.parse(order.orderItems || "[]");

  const statusColor: Record<string, string> = {
    PENDING: "bg-orange-50 text-orange-600 border-orange-100",
    PROCESSING: "bg-blue-50 text-blue-600 border-blue-100",
    COMPLETED: "bg-green-50 text-green-600 border-green-100",
    CANCELLED: "bg-red-50 text-red-500 border-red-100",
  };

  const statusLabel: Record<string, string> = {
    PENDING: "Chờ duyệt",
    PROCESSING: "Đang xử lý",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header & Back */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/orders" 
            className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all hover:-translate-x-1 active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chi tiết đơn hàng #{order.id.slice(-6).toUpperCase()}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor[order.status]}`}>
                {statusLabel[order.status]}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        </div>

        {/* Nút tác vụ nhanh */}
        <div className="flex items-center gap-3">
          {order.status === "PENDING" && (
            <OrderStatusButton 
              action={updateOrderStatus.bind(null, order.id, "PROCESSING")}
              newStatus="PROCESSING"
              icon={<Package className="w-4 h-4" />}
            />
          )}
          {order.status === "PROCESSING" && (
            <OrderStatusButton 
              action={updateOrderStatus.bind(null, order.id, "COMPLETED")}
              newStatus="COMPLETED"
              icon={<CheckCircle className="w-4 h-4" />}
            />
          )}
          {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
            <OrderStatusButton 
              action={updateOrderStatus.bind(null, order.id, "CANCELLED")}
              newStatus="CANCELLED"
              icon={<XCircle className="w-4 h-4" />}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin sản phẩm */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <Package className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Danh sách sản phẩm</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="w-16 h-20 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-300 italic">No Pic</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-teal-700 font-bold mt-1">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold">x {item.quantity}</p>
                    <p className="font-black text-gray-900 mt-1">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-gray-50/30 flex justify-between items-center border-t border-gray-50">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Tổng tiền sản phẩm</span>
              <span className="text-2xl font-black text-teal-700">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin khách hàng & Thanh toán */}
        <div className="space-y-8">
          {/* Thông tin khách hàng */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <User className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Khách hàng</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Họ tên</p>
                  <p className="font-bold text-gray-900 mt-1">{order.customerName}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Số điện thoại</p>
                  <p className="font-bold text-gray-900 mt-1">{order.customerPhone}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Địa chỉ giao hàng</p>
                  <p className="font-bold text-gray-900 mt-1 leading-relaxed">{order.customerAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Thanh toán</h2>
            </div>
            <div className="p-6">
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-3">Phương thức</p>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="font-black text-gray-900">
                  {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Đã bao gồm phí vận chuyển (Miễn phí)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
