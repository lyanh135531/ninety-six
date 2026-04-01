import { prisma } from "@/lib/prisma";
import { User, Phone, MapPin, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  // Group orders by phone to create a simple "Customer" list
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Unique customers based on phone number
  const customersMap = new Map();
  orders.forEach(order => {
    if (!customersMap.has(order.customerPhone)) {
      customersMap.set(order.customerPhone, {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.customerAddress,
        totalSpent: 0,
        orderCount: 0,
        lastOrder: order.createdAt
      });
    }
    const customer = customersMap.get(order.customerPhone);
    customer.totalSpent += order.totalAmount;
    customer.orderCount += 1;
  });

  const customers = Array.from(customersMap.values());

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách Khách hàng</h1>
        <p className="text-gray-500 mt-1">Quản lý thông tin và lịch sử mua sắm của khách hàng.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Khách hàng</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Liên hệ & Địa chỉ</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Số đơn</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors uppercase">{customer.name}</p>
                        <p className="text-xs text-gray-400 mt-1">Khách hàng thân thiết</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="w-3 h-3 text-teal-600" /> {customer.phone}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-2 truncate max-w-xs">
                        <MapPin className="w-3 h-3" /> {customer.address}
                      </p>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-gray-900">{customer.orderCount} đơn</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="font-black text-teal-700">{formatCurrency(customer.totalSpent)}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter italic">Mua lần cuối: {new Date(customer.lastOrder).toLocaleDateString("vi-VN")}</p>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <User className="w-12 h-12 text-gray-100" />
                      <p className="text-lg font-medium text-gray-300">Chưa có dữ liệu khách hàng.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
