import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Package, ListTree, ShoppingCart, TrendingUp, ArrowUpRight, Clock, User, Phone } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, categoryCount, orders, completedOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { status: "COMPLETED" },
    }),
  ]);

  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  const orderCount = orders.length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Chào bạn quay lại, <span className="text-teal-700">Ninety Six Admin</span></h1>
        <p className="text-gray-500 mt-2">Dưới đây là tóm tắt hoạt động kinh doanh của bạn hôm nay.</p>
      </div>

      {/* Thẻ Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Doanh thu */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-2xl w-fit">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Doanh thu (Thực nhận)</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl w-fit">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Tổng Sản Phẩm</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{productCount}</p>
            </div>
          </div>
        </div>

        {/* Danh mục */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl w-fit">
              <ListTree className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Danh Mục</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{categoryCount}</p>
            </div>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl w-fit">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Đơn hàng hiện tại</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{orderCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Đơn hàng mới nhất</h2>
          <Link href="/admin/orders" className="text-teal-700 text-sm font-bold flex items-center gap-1 hover:underline">
            Xem tất cả <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {orders.map((order) => (
            <div key={order.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.customerName}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.customerPhone}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-teal-700">{formatCurrency(order.totalAmount)}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1 bg-gray-50 px-2 py-0.5 rounded flex items-center justify-center w-fit ml-auto">
                  {order.status}
                </p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-10 text-center text-gray-400">Chưa có đơn hàng nào để hiển thị.</div>
          )}
        </div>
      </div>
    </div>
  );
}

