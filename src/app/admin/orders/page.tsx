import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatus, deleteOrder } from "./actions";
import { Package, Truck, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import Link from "next/link";
import DeleteButton from "@/components/Admin/DeleteButton";
import Pagination from "@/components/Admin/Pagination";
import OrderStatusButton from "@/components/Admin/OrderStatusButton";
import UrlToast from "@/components/Admin/UrlToast";
import CustomerAvatar from "@/components/Admin/CustomerAvatar";
import AdminSearchInput from "@/components/Admin/AdminSearchInput";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;



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
  searchParams: Promise<{ status?: string; page?: string; q?: string }>
}) {
  const params = await searchParams;
  const status = params.status;
  const q = params.q;
  const page = Math.max(1, parseInt(params.page || "1"));

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { customerName: { contains: q, mode: 'insensitive' } },
      { customerPhone: { contains: q, mode: 'insensitive' } },
      { id: { contains: q, mode: 'insensitive' } },
    ];
  }

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
    <div className="space-y-12">
      <Suspense><UrlToast /></Suspense>

      {/* Page Heading & Filter System */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 w-full xl:w-auto">
          <AdminSearchInput />
        </div>

        {/* Modern Filter Tabs */}
        <div className="flex flex-wrap items-center bg-white p-1.5 rounded-[2rem] border border-gray-100 shadow-sm w-fit self-start xl:self-auto backdrop-blur-sm">
          {[
            { label: "Tất cả", href: "/admin/orders", active: !status, color: "teal", activeClass: "bg-teal-700 text-white shadow-lg shadow-teal-100" },
            { label: "Chờ duyệt", href: "/admin/orders?status=PENDING", active: status === "PENDING", color: "orange", activeClass: "bg-orange-700 text-white shadow-lg shadow-orange-100" },
            { label: "Đang xử lý", href: "/admin/orders?status=PROCESSING", active: status === "PROCESSING", color: "blue", activeClass: "bg-blue-700 text-white shadow-lg shadow-blue-100" },
            { label: "Hoàn thành", href: "/admin/orders?status=COMPLETED", active: status === "COMPLETED", color: "green", activeClass: "bg-green-700 text-white shadow-lg shadow-green-100" },
            { label: "Đã hủy", href: "/admin/orders?status=CANCELLED", active: status === "CANCELLED", color: "red", activeClass: "bg-red-700 text-white shadow-lg shadow-red-100" },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-6 py-2.5 rounded-[1.25rem] text-xs font-black transition-all uppercase tracking-widest ${tab.active
                ? tab.activeClass
                : "text-gray-400 hover:text-gray-900"
                }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {typedOrders.length === 0 ? (
        <div className="py-40 bg-white rounded-[3.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center shadow-inner">
          <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[2.5rem] flex items-center justify-center mb-8">
            <Truck className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-gray-300 tracking-tight">Hành trình đang tạm nghỉ</h3>
          <p className="text-gray-400 text-[10px] font-black mt-3 uppercase tracking-[0.25em]">Chưa có đơn hàng nào trong phân mục này</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 pb-20">
          {typedOrders.map((order) => {
            const items = JSON.parse(order.orderItems) as { id: string, name: string, price: number, quantity: number }[];

            return (
              <div key={order.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all overflow-hidden group">
                <div className="p-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
                  {/* Left: Branding & Core Info */}
                  <div className="flex items-center gap-5 min-w-[280px]">
                    <CustomerAvatar name={order.customerName} />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-teal-900/40 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100 shrink-0">#{order.id.slice(-4).toUpperCase()}</span>
                        <Link href={`/admin/orders/${order.id}`} className="font-black text-gray-900 text-lg tracking-tight hover:text-teal-900 transition-colors truncate block">{order.customerName}</Link>
                        <Eye className="w-3.5 h-3.5 text-teal-600 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString("vi-VN", { dateStyle: "short" })}
                        </p>
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-md">
                          {items.length} SP
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Center: Status & Finance */}
                  <div className="flex items-center gap-6 flex-1 justify-center lg:justify-start">
                    <div className="h-8 w-px bg-gray-100 hidden lg:block" />
                    <div className="flex flex-col items-center lg:items-start min-w-[120px]">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Trạng thái</p>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2.5 shadow-sm ${statusColors[order.status]}`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current opacity-50 animate-pulse`} />
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-gray-100 hidden lg:block" />
                    <div className="flex flex-col items-center lg:items-start min-w-[140px]">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Tổng cộng</p>
                      <p className="text-lg font-black text-gray-900 tracking-tight">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Right: Smart Actions */}
                  <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-0 pt-4 lg:pt-0">
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
                    <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block" />
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2.5 text-gray-400 hover:text-teal-900 hover:bg-teal-50 rounded-xl transition-all cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <DeleteButton
                        onDelete={deleteOrder.bind(null, order.id)}
                        confirmMessage={`Xóa dữ liệu đơn hàng #${order.id.slice(-4).toUpperCase()}?`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pb-20">
          <Suspense>
            <Pagination totalPages={totalPages} currentPage={page} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
