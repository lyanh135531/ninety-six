import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatus, deleteOrder } from "./actions";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import DeleteButton from "@/components/Admin/DeleteButton";

export const dynamic = "force-dynamic";

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
  searchParams: Promise<{ status?: string }> 
}) {
  const status = (await searchParams).status;

  const orders = (await prisma.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
  })) as OrderWithItems[];

  return (
    <div className="p-8">
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
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <Truck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400">Chưa có đơn hàng nào</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => {
            const items = JSON.parse(order.orderItems) as { id: string, name: string, price: number, quantity: number }[];
            
            return (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                {/* Header đơn hàng */}
                <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-700 text-white rounded-2xl flex items-center justify-center font-bold shadow-sm">
                      #{order.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{order.customerName}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${statusColors[order.status]}`}>
                      {statusIcons[order.status]}
                      {order.status}
                    </span>
                    <DeleteButton 
                      onDelete={deleteOrder.bind(null, order.id)}
                      confirmMessage={`Bạn có chắc chắn muốn xóa đơn hàng #${order.id.slice(-4).toUpperCase()}?`}
                    />
                  </div>
                </div>

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
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Cập nhật trạng thái</p>
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "PROCESSING"); }} className="w-full">
                      <button className="w-full py-3 px-4 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                        <Package className="w-4 h-4" /> Đang xử lý
                      </button>
                    </form>
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "COMPLETED"); }} className="w-full">
                      <button className="w-full py-3 px-4 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Hoàn thành
                      </button>
                    </form>
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "CANCELLED"); }} className="w-full">
                      <button className="w-full py-3 px-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" /> Hủy đơn
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
