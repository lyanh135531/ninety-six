import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ChevronDown, Filter } from "lucide-react";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SortOption = "latest" | "price-asc" | "price-desc";

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ category: string }>,
  searchParams: Promise<{ search?: string, sort?: SortOption }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.search;
  const sort = resolvedSearchParams.sort || "latest";
  const isMom = resolvedParams.category === "mom";
  
  const keyword = isMom ? "mẹ" : "bé";

  // Build sorting object
  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  if (sort === "latest") orderBy.createdAt = "desc";
  if (sort === "price-asc") orderBy.price = "asc";
  if (sort === "price-desc") orderBy.price = "desc";

  const productsRaw = await prisma.product.findMany({
    where: {
      category: {
        name: {
          contains: keyword,
          mode: "insensitive"
        }
      },
      ...(query ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      } : {})
    },
    include: { category: true },
    orderBy: orderBy
  });

  // Safe Read: Fetch stockBySizes/sizes via raw SQL
  let products = productsRaw;
  if (productsRaw.length > 0) {
    try {
      const ids = productsRaw.map(p => p.id);
      const extraData: any[] = await prisma.$queryRawUnsafe(
        'SELECT id, "stockBySizes", "sizes" FROM "Product" WHERE id = ANY($1)',
        ids
      );
      
      products = productsRaw.map(p => {
        const extra = extraData.find(s => s.id === p.id);
        return {
          ...p,
          stockBySizes: extra?.stockBySizes || (p as any).stockBySizes || "{}",
          sizes: extra?.sizes || p.sizes
        };
      });
    } catch (e) {
      console.error("Lỗi khi fetch stock via SQL (Collections):", e);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Bộ Sưu Tập <span className="text-teal-700">{isMom ? "Đồ Ngủ Cho Mẹ" : "Đồ Ngủ Cho Bé"}</span>
          </h1>
          <p className="text-gray-500">
            {isMom 
              ? "Tuyển chọn những thiết kế đồ ngủ lụa satin, cotton mang lại sự thoải mái tuyệt đối nhưng vẫn tôn lên nét đẹp rạng ngời của Mẹ."
              : "Những chất liệu mềm mại, an toàn tuyệt đối với làn da nhạy cảm, giúp bé có những giấc ngủ ngon và sâu."
            }
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          <div className="relative group">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-teal-700 transition-all cursor-pointer shadow-sm">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-700">
                {sort === "latest" ? "Mới nhất" : sort === "price-asc" ? "Giá thấp đến cao" : "Giá cao đến thấp"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" />
            </div>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
              <div className="p-1">
                {([
                  { value: "latest", label: "Mới nhất" },
                  { value: "price-asc", label: "Giá thấp đến cao" },
                  { value: "price-desc", label: "Giá cao đến thấp" }
                ] as const).map((option) => (
                  <Link
                    key={option.value}
                    href={`/collections/${resolvedParams.category}?sort=${option.value}${query ? `&search=${query}` : ""}`}
                    className={`block px-4 py-3 text-sm rounded-xl transition-colors ${
                      sort === option.value 
                        ? "bg-teal-50 text-teal-700 font-bold" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {products.length === 0 && (
          <div className="col-span-full py-20 outline-dashed outline-2 outline-gray-200 rounded-3xl flex flex-col items-center justify-center text-center bg-gray-50/30">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
              <Filter className="w-10 h-10" />
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">Chưa có sản phẩm nào</p>
            <p className="text-gray-500 mb-8 max-w-sm">Chúng tôi đang cập nhật thêm sản phẩm cho bộ sưu tập này. Vui lòng quay lại sau nhé!</p>
            <Link href="/" className="px-8 py-3 bg-teal-700 text-white font-bold rounded-full hover:bg-teal-800 transition hover:-translate-y-1 active:scale-95 shadow-lg shadow-teal-100 cursor-pointer">Quay Lại Trang Chủ</Link>
          </div>
        )}
      </div>
    </div>
  );
}
