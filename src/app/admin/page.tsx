import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  Package, TrendingUp,
  ArrowUpRight, Clock, User, Phone, AlertCircle,
  CheckCircle, TrendingDown
} from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "./orders/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    productCount,
    categoryCount,
    recentOrders,
    completedOrders,
    pendingOrders,
    todayOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ where: { status: "COMPLETED" } }),
    prisma.order.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ where: { createdAt: { gte: today } } }),
  ]);

  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const todayRevenue = todayOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrderCount = await prisma.order.count();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Chào bạn quay lại, <span className="text-teal-700">Ninety Six Admin</span> 👋
        </h1>
        <p className="text-gray-500 mt-2">
          {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Cần xử lý ngay */}
      {pendingOrders.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-black text-orange-800 text-lg">Cần xử lý ngay</h2>
                <p className="text-orange-600 text-sm">{pendingOrders.length} đơn hàng đang chờ duyệt</p>
              </div>
            </div>
            <Link
              href="/admin/orders?status=PENDING"
              className="text-orange-600 hover:text-orange-800 font-bold text-sm flex items-center gap-1"
            >
              Xem tất cả <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {pendingOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-4 flex items-center justify-between gap-4 border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-700 text-white rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                    #{order.id.slice(-3).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {order.customerPhone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-black text-teal-700 text-sm">{formatCurrency(order.totalAmount)}</p>
                  <form action={async () => { "use server"; await updateOrderStatus(order.id, "PROCESSING"); }}>
                    <button className="px-3 py-1.5 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm cursor-pointer">
                      Xác nhận
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thẻ Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Doanh thu tổng */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-2xl w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Doanh thu thực nhận</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-gray-400 mt-1">{completedOrders.length} đơn hoàn thành</p>
            </div>
          </div>
        </div>

        {/* Doanh thu hôm nay */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl w-fit">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Hôm nay</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(todayRevenue)}</p>
              <p className="text-xs text-gray-400 mt-1">{todayOrders.length} đơn trong ngày</p>
            </div>
          </div>
        </div>

        {/* Đơn chờ duyệt */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl w-fit">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Chờ duyệt</p>
              <p className={`text-2xl font-black mt-1 ${pendingOrders.length > 0 ? "text-orange-600" : "text-gray-900"}`}>
                {pendingOrders.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">/ {totalOrderCount} tổng đơn</p>
            </div>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-50 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl w-fit">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Sản phẩm</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{productCount}</p>
              <p className="text-xs text-gray-400 mt-1">{categoryCount} danh mục</p>
            </div>
          </div>
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-teal-700" />
            <h2 className="text-xl font-bold text-gray-900">Đơn hàng mới nhất</h2>
          </div>
          <Link href="/admin/orders" className="text-teal-700 text-sm font-bold flex items-center gap-1 hover:underline">
            Xem tất cả <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => {
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
              <Link 
                key={order.id} 
                href={`/admin/orders/${order.id}`}
                className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-700 transition-all">
                    <User className="w-5 h-5 text-gray-400 group-hover:text-teal-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="font-bold text-gray-900">{order.customerName}</p>
                       <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-teal-700 transition-all" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.customerPhone}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor[order.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                    {statusLabel[order.status] || order.status}
                  </span>
                  <p className="font-black text-teal-700">{formatCurrency(order.totalAmount)}</p>
                </div>
              </Link>
            );
          })}
          {recentOrders.length === 0 && (
            <div className="p-10 text-center text-gray-400">Chưa có đơn hàng nào để hiển thị.</div>
          )}
        </div>
      </div>
    </div>
  );
}
