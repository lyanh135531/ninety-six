import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { User, Phone, MapPin, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const orders = await prisma.order.findMany({
    select: {
      customerName: true,
      customerPhone: true,
      customerAddress: true,
      totalAmount: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Gộp theo số điện thoại
  const map = new Map<string, {
    name: string; phone: string; address: string;
    totalSpent: number; orderCount: number;
    completedOrders: number; lastOrder: Date;
  }>();

  for (const o of orders) {
    if (!map.has(o.customerPhone)) {
      map.set(o.customerPhone, {
        name: o.customerName, phone: o.customerPhone, address: o.customerAddress,
        totalSpent: 0, orderCount: 0, completedOrders: 0, lastOrder: o.createdAt,
      });
    }
    const c = map.get(o.customerPhone)!;
    c.orderCount++;
    c.totalSpent += o.totalAmount;
    if (o.status === "COMPLETED") c.completedOrders++;
    if (o.createdAt > c.lastOrder) { c.lastOrder = o.createdAt; c.name = o.customerName; }
  }

  const customers = Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Khách hàng</h1>
          <p className="text-gray-500 mt-1">{customers.length} khách hàng đã từng đặt hàng</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <div className="flex items-center gap-2 text-teal-700 justify-center mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Tổng doanh thu</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Khách hàng</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Liên hệ & Địa chỉ</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest text-center">Số đơn</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Chi tiêu</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Lần mua cuối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((c, idx) => (
                <tr key={c.phone} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{c.name}</p>
                        {idx < 3 && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                            {["🏆 Top 1", "🥈 Top 2", "🥉 Top 3"][idx]}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {c.phone}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-gray-400 mt-1 max-w-[220px] truncate">
                      <MapPin className="w-3 h-3 shrink-0" /> {c.address}
                    </p>
                  </td>
                  <td className="p-5 text-center">
                    <span className="text-xl font-black text-gray-900">{c.orderCount}</span>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{c.completedOrders} hoàn thành</p>
                  </td>
                  <td className="p-5">
                    <p className="font-black text-teal-700">{formatCurrency(c.totalSpent)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(Math.round(c.totalSpent / c.orderCount))} / đơn</p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm text-gray-700 font-medium">{new Date(c.lastOrder).toLocaleDateString("vi-VN")}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(c.lastOrder).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <User className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Chưa có khách hàng nào</p>
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
