import { prisma } from "@/lib/prisma";
import { Plus, ListTree, Tag } from "lucide-react";
import { deleteCategory } from "../actions";
import DeleteButton from "@/components/Admin/DeleteButton";
import EditCategoryModal from "@/components/Admin/EditCategoryModal";
import AddCategoryForm from "./AddCategoryForm";

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
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Quản lý Danh mục</h1>
        <p className="text-gray-500 mt-2 font-medium">Sắp xếp hệ sinh thái sản phẩm của bạn thật chuyên nghiệp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Thêm Danh mục */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 h-fit sticky top-24">
          <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
            <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center shadow-sm">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Thêm mới</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Tạo bộ sưu tập mới</p>
            </div>
          </div>
          
          <AddCategoryForm />
        </div>

        {/* Danh sách */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <h3 className="font-black text-gray-900 flex items-center gap-3">
              <ListTree className="w-6 h-6 text-teal-700" />
              Bộ sưu tập hiện có ({categories.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-[0.2em]">Danh mục & Đường dẫn</th>
                  <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-[0.2em] text-center">Sản phẩm</th>
                  <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-[0.2em] text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shadow-sm">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 group-hover:text-teal-700 transition-colors text-lg">{cat.name}</p>
                          <p className="text-xs text-gray-400 mt-1 font-bold tracking-tight opacity-60">/{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-black border border-gray-200 uppercase tracking-widest shadow-sm">
                        {cat._count.products} món đồ
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <EditCategoryModal id={cat.id} initialName={cat.name} />
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

