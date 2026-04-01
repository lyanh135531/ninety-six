import { prisma } from "@/lib/prisma";
import { Package, ListTree, ShoppingCart } from "lucide-react";

export default async function AdminDashboard() {
  const [productCount, categoryCount, orderCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tổng quan (Dashboard)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thẻ Thống kê Sản phẩm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-teal-50 text-teal-700 rounded-full">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Tổng Sản Phẩm</p>
            <p className="text-3xl font-bold text-gray-900">{productCount}</p>
          </div>
        </div>

        {/* Thẻ Thống kê Danh mục */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-500 rounded-full">
            <ListTree className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Danh Mục</p>
            <p className="text-3xl font-bold text-gray-900">{categoryCount}</p>
          </div>
        </div>

        {/* Thẻ Thống kê Đơn hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-500 rounded-full">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Đơn Hàng Mới</p>
            <p className="text-3xl font-bold text-gray-900">{orderCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
