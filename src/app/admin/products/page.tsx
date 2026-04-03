import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Star, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { deleteProduct } from "../actions";
import DeleteButton from "@/components/Admin/DeleteButton";
import ProductFilters from "@/components/Admin/ProductFilters";
import Pagination from "@/components/Admin/Pagination";
import UrlToast from "@/components/Admin/UrlToast";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoryId?: string; featured?: string; page?: string; lowStock?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const categoryId = params.categoryId || "";
  const featured = params.featured;
  const lowStock = params.lowStock === "true";
  const page = Math.max(1, parseInt(params.page || "1"));

  const where = {
    ...(q && { name: { contains: q, mode: "insensitive" as const } }),
    ...(categoryId && { categoryId }),
    ...(featured === "true" && { isFeatured: true }),
    ...(featured === "false" && { isFeatured: false }),
  };

  // Fetch products via Prisma (may miss stockBySizes if client is stale)
  let productsRaw, totalCountCount, categories;

  if (lowStock) {
    // Nếu lọc hàng sắp hết, ta cần fetch hết để kiểm tra JSON hoặc dùng raw SQL
    // Ở đây ta dùng raw SQL để lấy các ID thỏa mãn trước
    const lowStockProductIds: { id: string }[] = await prisma.$queryRawUnsafe(`
      SELECT id FROM "Product" 
      WHERE EXISTS (
        SELECT 1 FROM jsonb_each_text("stockBySizes"::jsonb) AS x(key, val) 
        WHERE key != '_total' AND val::int < 5
      ) OR ("stockBySizes"::jsonb->>'_total')::int < 10
    `);

    const ids = lowStockProductIds.map(p => p.id);

    const [p, c, cats] = await Promise.all([
      prisma.product.findMany({
        where: { id: { in: ids }, ...where },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where: { id: { in: ids }, ...where } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    productsRaw = p;
    totalCountCount = c;
    categories = cats;
  } else {
    const [p, c, cats] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    productsRaw = p;
    totalCountCount = c;
    categories = cats;
  }

  // Fallback: Fetch stockBySizes via raw SQL for the current page of products
  let products = productsRaw;
  if (productsRaw.length > 0) {
    try {
      const ids = productsRaw.map(p => p.id);
      const stockData: { id: string; stockBySizes: string; sizes: string }[] = await prisma.$queryRawUnsafe(
        `SELECT id, "stockBySizes", "sizes" FROM "Product" WHERE id = ANY($1)`,
        ids
      );

      // Merge raw data into prisma objects
      products = productsRaw.map(p => {
        const extra = stockData.find(s => s.id === p.id);
        return {
          ...p,
          stockBySizes: extra?.stockBySizes || (p as { stockBySizes?: string }).stockBySizes || "{}",
          sizes: extra?.sizes || p.sizes
        };
      });
    } catch (e) {
      console.error("Lỗi khi fetch stock/sizes via SQL:", e);
    }
  }

  const totalPages = Math.ceil(totalCountCount / PAGE_SIZE);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Suspense><UrlToast /></Suspense>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 mt-1">
            {totalCountCount > 0
              ? `Hiển thị ${Math.min((page - 1) * PAGE_SIZE + 1, totalCountCount)}–${Math.min(page * PAGE_SIZE, totalCountCount)} trong ${totalCountCount} sản phẩm`
              : "Chưa có sản phẩm nào"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-teal-200 transition-all hover:-translate-y-0.5 active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Thêm Sản phẩm Mới
        </Link>
      </div>

      {/* Bộ lọc */}
      <div className="mb-6">
        <Suspense>
          <ProductFilters categories={categories} />
        </Suspense>
      </div>

      {/* Bảng sản phẩm */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Thông tin</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Danh Mục</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Giá bán</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest">Trạng thái</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest text-center">Kho</th>
                <th className="p-5 font-bold text-gray-400 text-xs uppercase tracking-widest text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-gray-200" />
                      <p className="text-lg font-medium text-gray-400">
                        {q || categoryId || featured ? "Không tìm thấy sản phẩm phù hợp" : "Chưa có sản phẩm nào"}
                      </p>
                      {(q || categoryId || featured) && (
                        <Link
                          href="/admin/products"
                          className="mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm"
                        >
                          Xóa bộ lọc
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-50 relative shadow-sm shrink-0">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase">No Pic</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 group-hover:text-teal-900 transition-colors truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">ID: {product.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="bg-teal-50 text-teal-900 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="font-black text-gray-900">{formatCurrency(product.price)}</p>
                    </td>
                    <td className="p-5">
                      {product.isFeatured ? (
                        <span className="flex items-center gap-1.5 text-orange-500 font-bold text-xs uppercase bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full w-fit">
                          <Star className="w-3 h-3 fill-orange-500" /> Nổi bật
                        </span>
                      ) : (
                        <span className="text-gray-300 font-medium text-xs uppercase">Thường</span>
                      )}
                    </td>
                    <td className="p-5 text-center">
                      {(() => {
                        try {
                          const stock = JSON.parse((product as { stockBySizes?: string }).stockBySizes || "{}");
                          const total = stock["_total"] !== undefined
                            ? stock["_total"]

                            : Object.values(stock).reduce((a: number, b: unknown) => a + ((b as number) || 0), 0) as number;

                          if (total <= 0) return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black border border-rose-100 uppercase">Hết hàng</span>;
                          if (total <= 5) return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black border border-amber-100 uppercase">{total} cái (Sắp hết)</span>;
                          return <span className="text-gray-900 font-bold text-sm tracking-tighter">{total} cái</span>;
                        } catch {
                          return <span className="text-gray-300">--</span>;
                        }
                      })()}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="p-2.5 text-gray-400 hover:text-teal-900 hover:bg-teal-50 rounded-xl transition-all cursor-pointer group/edit"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4 transition-transform group-hover/edit:rotate-12" />
                        </Link>
                        <DeleteButton
                          onDelete={deleteProduct.bind(null, product.id)}
                          confirmMessage={`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`}
                          title="Xóa sản phẩm"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-gray-50">
            <Suspense>
              <Pagination totalPages={totalPages} currentPage={page} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
