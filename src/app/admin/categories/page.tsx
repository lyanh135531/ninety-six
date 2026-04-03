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
    <div className="space-y-10 pb-20">
      {/* Dynamic Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="animate-entrance">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-700 animate-pulse" />
            <span className="text-[10px] font-black text-teal-700 uppercase tracking-[0.3em]">Hệ sinh thái</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Cấu trúc Danh mục</h1>
          <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest">Sắp xếp kho lưu trữ của bạn thật chuyên nghiệp</p>
        </div>
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm">
           <span className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng số lượng</span>
           <span className="px-4 py-1.5 bg-teal-700 text-white text-xs font-black rounded-xl shadow-lg shadow-teal-700/20">{categories.length} Phân loại</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Creator: Add Category */}
        <div className="xl:col-span-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24 transition-all hover:shadow-xl hover:shadow-teal-900/[0.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shadow-inner">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Thêm Danh mục</h2>
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-0.5">Tạo phân loại sản phẩm mới</p>
              </div>
            </div>
            
            <AddCategoryForm />
          </div>
        </div>

        {/* Repository: Category List */}
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/[0.05] hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[220px]"
              >
                {/* Decorative Element */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-teal-50/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="relative z-10 h-full flex flex-col">
                  {/* Card Header Actions */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-inner">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                       <EditCategoryModal id={cat.id} initialName={cat.name} />
                       <DeleteButton 
                         onDelete={deleteCategory.bind(null, cat.id)}
                         confirmMessage={`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`}
                       />
                    </div>
                  </div>

                  {/* Core Information */}
                  <div className="flex-1">
                     <p className="text-[9px] font-black text-teal-700/40 uppercase tracking-[0.3em] mb-1.5 font-sans">
                       N96 • /{cat.slug}
                     </p>
                     <h4 className="text-xl font-black text-gray-900 group-hover:text-teal-700 transition-colors tracking-tight leading-tight">
                       {cat.name}
                     </h4>
                  </div>

                  {/* Statistics & Meta */}
                  <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] bg-gray-50/50 px-2.5 py-1 rounded-full border border-gray-50">
                      ID: {cat.id.slice(0, 8)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-gray-900 tracking-tighter tabular-nums">{cat._count.products}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Sản phẩm</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="col-span-full py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-2xl flex items-center justify-center mb-6">
                  <ListTree className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-gray-300 tracking-tight">Kho lưu trữ đang trống</h4>
                <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-widest px-10">Hãy bắt đầu tạo những phân loại sản phẩm đầu tiên của bạn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

