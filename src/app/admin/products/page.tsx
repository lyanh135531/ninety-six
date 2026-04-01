import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Star, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { deleteProduct } from "../actions";
import DeleteButton from "@/components/Admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 mt-1">Danh sách tất cả sản phẩm đang có trong cửa hàng.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-teal-200 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Thêm Sản phẩm Mới
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Thông tin</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Danh Mục</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Giá bán</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Trạng thái</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-12 h-12 text-gray-200" />
                      <p className="text-lg font-medium text-gray-400">Chưa có sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-50 relative shadow-sm">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase">No Pic</div>
                          )}
                        </div>
                        <div className="max-w-xs">
                          <p className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors truncate">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-1">ID: {product.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="font-black text-gray-900">{formatCurrency(product.price)}</p>
                    </td>
                    <td className="p-5">
                      {product.isFeatured ? (
                        <span className="flex items-center gap-1 text-orange-500 font-bold text-xs uppercase">
                          <Star className="w-3 h-3 fill-orange-500" /> Nổi bật
                        </span>
                      ) : (
                        <span className="text-gray-300 font-medium text-xs uppercase">Thường</span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Sửa"
                        >
                          <Pencil className="w-5 h-5" />
                        </Link>
                        <DeleteButton 
                          onDelete={deleteProduct.bind(null, product.id)}
                          confirmMessage={`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

