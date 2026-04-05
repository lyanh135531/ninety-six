import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import {
  Package, TrendingUp,
  ArrowUpRight, Clock, Phone, AlertCircle,
  CheckCircle, TrendingDown
} from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "./orders/actions";
import OrderStatusButton from "@/components/Admin/OrderStatusButton";
import CustomerAvatar from "@/components/Admin/CustomerAvatar";

export const dynamic = "force-dynamic";

interface ProductStockRaw {
  id: string;
  name: string;
  stockBySizes: string;
  imageUrl: string | null;
  lowSizes: string[];
  outOfStockSizes: string[];
}

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
    productCountRaw,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ where: { status: "COMPLETED" } }),
    prisma.order.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ where: { createdAt: { gte: today } } }),
    prisma.$queryRawUnsafe(`SELECT id, name, "stockBySizes", "imageUrl" FROM "Product"`),
  ]);

  // Logic phát hiện tồn kho thấp
  const lowStockProducts = (productCountRaw as ProductStockRaw[]).map(p => {
    try {
      const stock = JSON.parse(p.stockBySizes || "{}");
      const lowSizes: string[] = [];
      const outOfStockSizes: string[] = [];

      Object.entries(stock).forEach(([size, qty]) => {
        if (size === "_total") return;
        const count = qty as number;
        if (count === 0) outOfStockSizes.push(size);
        else if (count < 5) lowSizes.push(size);
      });

      if (Object.keys(stock).length === 1 && stock["_total"] !== undefined) {
        const total = stock["_total"] as number;
        if (total === 0) outOfStockSizes.push("Tất cả");
        else if (total < 5) lowSizes.push("Tổng");
      }

      if (lowSizes.length > 0 || outOfStockSizes.length > 0) {
        return { ...p, lowSizes, outOfStockSizes };
      }
      return null;
    } catch { return null; }
  }).filter(Boolean) as ProductStockRaw[];

  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const todayRevenue = todayOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrderCount = await prisma.order.count();

  return (
    <div className="space-y-10">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden bg-white p-7 rounded-2xl border border-gray-100 shadow-sm group">
        <div className="absolute right-0 top-0 w-48 h-48 bg-teal-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-teal-900 tracking-tight">
              Chào ngày mới, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500">Ninety Six Admin</span> 👋
            </h1>
            <p className="text-teal-800/40 mt-1 font-bold flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-teal-50 rounded-full border border-teal-100">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[10px] font-black text-teal-900 uppercase tracking-widest">Hệ thống Ổn định</span>
          </div>
        </div>
      </div>

      {/* Critical System Alerts Grid */}
      {(pendingOrders.length > 0 || lowStockProducts.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Urgent Orders Alert */}
          {pendingOrders.length > 0 && (
            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm group hover:shadow-xl transition-all h-full">
              <div className="absolute top-0 right-0 p-6">
                <AlertCircle className="w-16 h-16 text-orange-200 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shadow-inner">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-black text-orange-900 text-lg">Đơn hàng chờ duyệt</h2>
                    <p className="text-orange-600/80 text-[10px] font-black uppercase tracking-widest">{pendingOrders.length} Đơn cần xác nhận ngay</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {pendingOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="bg-white/80 rounded-xl p-3.5 flex items-center justify-between border border-orange-100/50 shadow-sm hover:shadow-md transition-all group/card">
                      <div className="flex items-center gap-3">
                        <CustomerAvatar name={order.customerName} size="sm" className="rounded-lg" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-orange-600/40 bg-orange-100/30 px-1 rounded border border-orange-100/30">#{order.id.slice(-4).toUpperCase()}</span>
                            <p className="font-black text-teal-900 text-xs">{order.customerName}</p>
                          </div>
                          <p className="text-[9px] text-teal-800/40 font-bold uppercase tracking-wider">{formatCurrency(order.totalAmount)}</p>
                        </div>
                      </div>

                      <OrderStatusButton
                        action={updateOrderStatus.bind(null, order.id, "PROCESSING")}
                        newStatus="PROCESSING"
                        icon={<Package className="w-3.5 h-3.5" />}
                      />
                    </div>
                  ))}
                  <Link href="/admin/orders?status=PENDING" className="block text-center pt-2 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-orange-800 transition-colors">
                    Xem tất cả đơn chờ →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm group hover:shadow-xl transition-all h-full">
              <div className="absolute top-0 right-0 p-6">
                <Package className="w-16 h-16 text-rose-200 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shadow-inner">
                    <AlertCircle className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h2 className="font-black text-rose-900 text-lg">Hàng sắp hết</h2>
                    <p className="text-rose-600/80 text-[10px] font-black uppercase tracking-widest">{lowStockProducts.length} Mã hàng cần nhập thêm</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  {lowStockProducts.slice(0, 4).map((product: ProductStockRaw) => (
                    <Link key={product.id} href={`/admin/products/edit/${product.id}`} className="bg-white/80 p-2.5 rounded-xl border border-rose-100/50 shadow-sm flex items-center gap-2.5 hover:translate-x-1 transition-transform group/tag">
                      <div className="w-7 h-7 relative rounded-lg overflow-hidden shrink-0 grayscale group-hover/tag:grayscale-0 transition-all">
                        {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-black text-teal-900 truncate">{product.name}</p>
                        <p className="text-[8px] text-rose-600 font-black uppercase tracking-wider">
                          {product.outOfStockSizes.length > 0 ? "⚠️ Hết hàng" : "⚡ Sắp hết"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/admin/products?lowStock=true" className="block text-center pt-2 text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-rose-800 transition-colors">
                  Chi tiết tồn kho →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Doanh thu tổng",
            value: formatCurrency(totalRevenue),
            sub: `${completedOrders.length} đơn hoàn thành`,
            icon: TrendingUp,
            colorClass: "bg-teal-50 text-teal-900",
            bgPulse: "bg-teal-50/50",
            trend: "+15.2%",
            trendClass: "text-teal-600 border-teal-100"
          },
          {
            label: "Trong hôm nay",
            value: formatCurrency(todayRevenue),
            sub: `${todayOrders.length} đơn mới`,
            icon: TrendingDown,
            colorClass: "bg-blue-50 text-blue-700",
            bgPulse: "bg-blue-50/50",
            trend: "+8.4%",
            trendClass: "text-blue-600 border-blue-100"
          },
          {
            label: "Tỷ lệ đơn mới",
            value: `${pendingOrders.length}`,
            sub: `/ ${totalOrderCount} đơn hàng`,
            icon: Clock,
            colorClass: "bg-orange-50 text-orange-700",
            bgPulse: "bg-orange-50/50",
            trend: "Cần xử lý",
            trendClass: "text-orange-600 border-orange-100"
          },
          {
            label: "Tổng Kho hàng",
            value: `${productCount}`,
            sub: `${categoryCount} bộ sưu tập`,
            icon: Package,
            colorClass: "bg-indigo-50 text-indigo-700",
            bgPulse: "bg-indigo-50/50",
            trend: "Ổn định",
            trendClass: "text-indigo-600 border-indigo-100"
          }
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className={`absolute -right-4 -top-4 w-20 h-20 ${stat.bgPulse} rounded-full group-hover:scale-150 transition-transform duration-700`} />
            <div className="relative z-10">
              <div className={`flex items-center justify-between mb-6`}>
                <div className={`w-12 h-12 ${stat.colorClass} rounded-xl flex items-center justify-center shadow-inner`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-white ${stat.trendClass} rounded-full border shadow-sm`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[9px] font-black text-teal-800/40 uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
              <h3 className="text-xl font-black text-teal-900 tracking-tight">{stat.value}</h3>
              <p className="text-[10px] font-bold text-teal-800/40 mt-1.5 flex items-center gap-1.5 opacity-60">
                <span className={`w-1 h-1 rounded-full bg-current`} />
                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-100">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-teal-900 tracking-tight">Giao dịch gần đây</h2>
              <p className="text-[10px] font-black text-teal-800/40 uppercase tracking-widest mt-1">Danh sách 5 đơn hàng mới nhất</p>
            </div>
          </div>
          <Link href="/admin/orders" className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-teal-900 hover:bg-teal-50 transition-all shadow-sm">
            Tất cả đơn hàng
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
                className="p-8 flex items-center justify-between hover:bg-teal-50/10 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <CustomerAvatar name={order.customerName} className="group-hover:scale-110 !rounded-3xl" />
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-teal-900/40 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">#{order.id.slice(-4).toUpperCase()}</span>
                      <p className="font-black text-teal-900 text-lg tracking-tight">{order.customerName}</p>
                      <ArrowUpRight className="w-4 h-4 text-teal-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-teal-800/40 mt-1 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {order.customerPhone}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${statusColor[order.status] || "bg-gray-50 text-teal-800/60 border-gray-100"}`}>
                    {statusLabel[order.status] || order.status}
                  </span>
                  <p className="text-xl font-black text-teal-900">{formatCurrency(order.totalAmount)}</p>
                </div>
              </Link>
            );
          })}
          {recentOrders.length === 0 && (
            <div className="p-20 text-center text-teal-800/30 font-bold">Chưa có giao dịch nào phát sinh.</div>
          )}
        </div>
      </div>
    </div>
  );
}
