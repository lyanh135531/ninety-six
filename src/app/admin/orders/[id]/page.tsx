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
    <div className="space-y-8 pb-20">
      {/* Header & Back Action */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-5">
          <Link 
            href="/admin/orders" 
            className="w-11 h-11 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-teal-50 transition-all hover:-translate-x-1 active:scale-95 cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-teal-700 transition-colors" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chi tiết Đơn hàng</h1>
              <span className="text-lg font-bold text-gray-300">#{order.id.slice(-6).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${statusColor[order.status]}`}>
                <div className={`w-1.5 h-1.5 rounded-full bg-current ${order.status !== 'COMPLETED' && order.status !== 'CANCELLED' ? 'animate-pulse' : 'opacity-50'}`} />
                {statusLabel[order.status]}
              </span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 bg-white px-2.5 py-0.5 rounded-full border border-gray-50 shadow-sm">
                <Calendar className="w-3 h-3" />
                {new Date(order.createdAt).toLocaleString("vi-VN", { dateStyle: "long", timeStyle: "short" })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Operations */}
        {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3">Thao tác</p>
            <div className="flex items-center gap-2">
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
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Product Manifest */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transform transition-all group/card">
            <div className="p-7 border-b border-gray-50 bg-gray-50/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-teal-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-teal-100">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Kê khai Sản phẩm</h2>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Danh mục các món đồ trong đơn</p>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-white text-teal-700 text-[10px] font-black rounded-full border border-teal-100 shadow-sm">
                Tổng cộng {items.length} món
              </span>
            </div>
            <div className="divide-y divide-gray-50 px-4">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-6 hover:bg-teal-50/10 transition-colors group/row rounded-2xl my-1.5 border-0">
                  <div className="w-16 h-20 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden shrink-0 shadow-sm group-hover/row:scale-105 transition-transform duration-500">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-300 italic font-black uppercase">No Pic</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-black text-gray-900 group-hover/row:text-teal-700 transition-colors">{item.name}</p>
                    <p className="text-xs font-bold text-teal-700/60 mt-1 uppercase tracking-widest flex items-center gap-2">
                       {formatCurrency(item.price)} <span className="opacity-30">/ Đơn vị</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-gray-300 font-black italic">
                      <span className="text-[9px] uppercase">SL</span>
                      <span className="text-base text-gray-400 not-italic">x {item.quantity}</span>
                    </div>
                    <p className="text-lg font-black text-gray-900 mt-1">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-teal-50/30 flex justify-between items-center border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Cần thanh toán</span>
                <span className="text-[10px] font-bold text-teal-700 mt-0.5 uppercase tracking-widest">(Đã bao gồm phí)</span>
              </div>
              <span className="text-2xl font-black text-teal-700 tracking-tighter">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Entity Context */}
        <div className="xl:col-span-4 space-y-8">
          {/* Entity: Customer */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group/cust transition-all">
            <div className="p-7 border-b border-gray-50 bg-gray-50/20 flex items-center gap-4">
              <div className="w-10 h-10 bg-white text-teal-700 rounded-xl flex items-center justify-center shadow-sm border border-teal-50">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Đối tượng</h2>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Xác thực khách hàng</p>
              </div>
            </div>
            <div className="p-7 space-y-6">
              <div className="flex items-start gap-4 group/info">
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0 group-hover/info:bg-teal-700 group-hover/info:text-white transition-all duration-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.25em] mb-1">Định danh</p>
                  <p className="text-base font-black text-gray-900 leading-tight">{order.customerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group/info">
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0 group-hover/info:bg-teal-700 group-hover/info:text-white transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.25em] mb-1">Liên lạc</p>
                  <p className="text-base font-black text-gray-900 leading-tight">{order.customerPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group/info">
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0 group-hover/info:bg-teal-700 group-hover/info:text-white transition-all duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.25em] mb-1">Tọa độ</p>
                  <p className="text-xs font-bold text-gray-700 leading-relaxed opacity-80">{order.customerAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure: Payment */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden group/pay transition-all hover:translate-y-[-2px]">
            <div className="p-7 border-b border-gray-50 bg-gray-50/20 flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-teal-100">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Thanh toán</h2>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Giao dịch tài chính</p>
              </div>
            </div>
            <div className="p-7">
              <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] mb-3">Phương thức</p>
              <div className="p-6 bg-gray-900 rounded-2xl shadow-xl relative overflow-hidden group/card shadow-teal-900/10">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl -translate-y-1/2 translate-x-1/2 rounded-full" />
                <p className="text-white font-black text-base tracking-tight relative z-10">
                  {order.paymentMethod === "COD" ? "COD" : "Chuyển khoản"}
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                  <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.25em]">Logistic</span>
                  <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest">Miễn phí</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
