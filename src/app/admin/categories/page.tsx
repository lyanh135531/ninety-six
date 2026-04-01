import { prisma } from "@/lib/prisma";
import { Plus, Trash2 } from "lucide-react";
import { createCategory, deleteCategory } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Danh mục</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Thêm Danh mục */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Thêm mới</h2>
          <form action={createCategory} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 outline-none"
                placeholder="Ví dụ: Đồ ngủ Mẹ"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-teal-700 text-white rounded-lg px-4 py-2 mt-2 hover:bg-teal-700 transition"
            >
              <Plus className="w-5 h-5" /> Thêm
            </button>
          </form>
        </div>

        {/* Danh sách */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-500 text-sm">Tên Danh mục</th>
                <th className="p-4 font-semibold text-gray-500 text-sm">Sản phẩm</th>
                <th className="p-4 font-semibold text-gray-500 text-sm w-24 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat: { id: string; name: string; _count: { products: number } }) => (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-gray-500">{cat._count.products}</td>
                  <td className="p-4 text-center">
                    <form action={async () => {
                      "use server";
                      await deleteCategory(cat.id);
                    }}>
                      <button type="submit" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">Chưa có danh mục nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
