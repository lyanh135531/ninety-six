import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatus, deleteOrder } from "./actions";
import { Package, Truck, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import Link from "next/link";
import DeleteButton from "@/components/Admin/DeleteButton";
import Pagination from "@/components/Admin/Pagination";
import OrderStatusButton from "@/components/Admin/OrderStatusButton";
import UrlToast from "@/components/Admin/UrlToast";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4" />,
  PROCESSING: <Package className="w-4 h-4" />,
  COMPLETED: <CheckCircle className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-50 text-orange-600 border-orange-100",
  PROCESSING: "bg-blue-50 text-blue-600 border-blue-100",
  COMPLETED: "bg-green-50 text-green-600 border-green-100",
  CANCELLED: "bg-red-50 text-red-600 border-red-100",
};

const statusLabels: Record<string, string> = {
  PENDING: "Chờ duyệt",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

interface OrderWithItems {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  orderItems: string;
  createdAt: Date;
}

export default async function OrdersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ status?: string; page?: string }> 
}) {
  const params = await searchParams;
  const status = params.status;
  const page = Math.max(1, parseInt(params.page || "1"));

  const where = status ? { status } : {};

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  const typedOrders = orders as OrderWithItems[];
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="p-8">
      <Suspense><UrlToast /></Suspense>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 mt-1">Theo dõi và cập nhật trạng thái đơn hàng của khách.</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          <Link href="/admin/orders" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!status ? "bg-teal-700 text-white shadow-md shadow-teal-100" : "text-gray-500 hover:text-teal-700"}`}>
            Tất cả
          </Link>
          <Link href="/admin/orders?status=PENDING" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${status === "PENDING" ? "bg-orange-100 text-orange-600" : "text-gray-500 hover:text-orange-600"}`}>
            Chờ duyệt
          </Link>
          <Link href="/admin/orders?status=PROCESSING" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${status === "PROCESSING" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:text-blue-600"}`}>
            Đang xử lý
          </Link>
          <Link href="/admin/orders?status=COMPLETED" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${status === "COMPLETED" ? "bg-green-100 text-green-600" : "text-gray-500 hover:text-green-600"}`}>
            Hoàn thành
          </Link>
          <Link href="/admin/orders?status=CANCELLED" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${status === "CANCELLED" ? "bg-red-100 text-red-600" : "text-gray-500 hover:text-red-500"}`}>
            Đã hủy
          </Link>
        </div>
      </div>

      {typedOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <Truck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400">Chưa có đơn hàng nào</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {typedOrders.map((order) => {
            const items = JSON.parse(order.orderItems) as { id: string, name: string, price: number, quantity: number }[];
            
            return (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                {/* Header đơn hàng */}
                <Link href={`/admin/orders/${order.id}`} className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50 hover:bg-teal-50/20 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-700 text-white rounded-2xl flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                      #{order.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{order.customerName}</h3>
                        <Eye className="w-3.5 h-3.5 text-teal-600 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all ${statusColors[order.status]}`}>
                      {statusIcons[order.status]}
                      {statusLabels[order.status] || order.status}
                    </span>
                    <DeleteButton 
                      onDelete={deleteOrder.bind(null, order.id)}
                      confirmMessage={`Bạn có chắc chắn muốn xóa đơn hàng #${order.id.slice(-4).toUpperCase()}?`}
                    />
                  </div>
                </Link>

                {/* Nội dung đơn hàng */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Cột 1: Thông tin khách & SP */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Liên hệ</p>
                        <p className="font-medium text-gray-900">{order.customerPhone}</p>
                        <p className="text-sm text-gray-500 mt-1">{order.customerAddress}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Thanh toán</p>
                        <p className="font-medium text-gray-900">{order.paymentMethod === "BANK_TRANSFER" ? "Chuyển khoản" : "COD"}</p>
                        <p className="text-lg font-black text-teal-700 mt-1">{formatCurrency(order.totalAmount)}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Sản phẩm đã đặt</p>
                      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        {items.map((item, idx) => (
                          <div key={idx} className="p-4 flex items-center justify-between border-b last:border-0 border-gray-50">
                            <div className="flex items-center gap-3">
                              <span className="w-4 h-4 bg-teal-50 text-teal-700 text-[10px] flex items-center justify-center rounded font-bold">
                                {item.quantity}
                              </span>
                              <span className="text-sm font-medium text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cột 3: Hành động */}
                  <div className="flex flex-col gap-3 justify-center border-l border-gray-50 lg:pl-10">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Xử lý đơn hàng</p>
                    
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="w-full py-3 px-4 bg-teal-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-md shadow-teal-100 mb-2"
                    >
                      <Eye className="w-4 h-4" /> Xem chi tiết
                    </Link>

                    <div className="grid grid-cols-3 gap-2">
                      <OrderStatusButton
                        action={updateOrderStatus.bind(null, order.id, "PROCESSING")}
                        newStatus="PROCESSING"
                        icon={<Package className="w-4 h-4" />}
                      />
                      <OrderStatusButton
                        action={updateOrderStatus.bind(null, order.id, "COMPLETED")}
                        newStatus="COMPLETED"
                        icon={<CheckCircle className="w-4 h-4" />}
                      />
                      <OrderStatusButton
                        action={updateOrderStatus.bind(null, order.id, "CANCELLED")}
                        newStatus="CANCELLED"
                        icon={<XCircle className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Suspense>
            <Pagination totalPages={totalPages} currentPage={page} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
