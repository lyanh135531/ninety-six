import { prisma } from "@/lib/prisma";
import { Plus, ListTree, Tag } from "lucide-react";
import { createCategory, deleteCategory } from "../actions";
import DeleteButton from "@/components/Admin/DeleteButton";

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Danh mục</h1>
        <p className="text-gray-500 mt-1">Phân loại sản phẩm để khách hàng dễ dàng tìm kiếm.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Thêm Danh mục */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Thêm Danh mục mới</h2>
          </div>
          
          <form action={createCategory} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Tên danh mục</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-teal-700 focus:ring-4 focus:ring-teal-700/5 rounded-2xl outline-none transition-all text-gray-900 placeholder:text-gray-300"
                placeholder="Ví dụ: Đồ ngủ Mẹ, Đồ ngủ Bé..."
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-teal-700 text-white rounded-2xl px-6 py-4 font-bold shadow-lg shadow-teal-200 hover:bg-teal-800 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" /> Tạo Danh mục
            </button>
          </form>
        </div>

        {/* Danh sách */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ListTree className="w-5 h-5 text-teal-700" />
              Danh sách hiện có ({categories.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Tên & Slug</th>
                  <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Sản phẩm</th>
                  <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat: { id: string; name: string; slug: string; _count: { products: number } }) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{cat.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 tracking-tight">slug: /{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                        {cat._count.products} món đồ
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center">
                        <DeleteButton 
                          onDelete={deleteCategory.bind(null, cat.id)}
                          confirmMessage={`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-20 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <ListTree className="w-12 h-12 text-gray-100" />
                        <p className="text-lg font-medium text-gray-300">Chưa có danh mục nào.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

