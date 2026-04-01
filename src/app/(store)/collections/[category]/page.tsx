import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const isMom = resolvedParams.category === "mom";
  
  // Here we do a simple partial text search on the slug or name because we didn't strictly separate them.
  // In a real app, you'd match by actual category ID. As a quick workaround, we'll fetch Categories that have 'mẹ' or 'bé'.
  const keyword = isMom ? "mẹ" : "bé";

  const products = await prisma.product.findMany({
    where: {
      category: {
        name: {
          contains: keyword,
          mode: "insensitive"
        }
      }
    },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container mx-auto px-4 py-20 max-w-7xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Bộ Sưu Tập <span className="text-pink-600">{isMom ? "Đồ Ngủ Cho Mẹ" : "Đồ Ngủ Cho Bé"}</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          {isMom 
            ? "Tuyển chọn những thiết kế đồ ngủ lụa satin, cotton mang lại sự thoải mái tuyệt đối nhưng vẫn tôn lên nét đẹp rạng ngời của Mẹ."
            : "Những chất liệu mềm mại, an toàn tuyệt đối với làn da nhạy cảm, giúp bé có những giấc ngủ ngon và sâu."
          }
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-pink-100">
            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Không có ảnh</div>
              )}
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-pink-500 tracking-wider uppercase">{product.category.name}</span>
              <h3 className="mt-2 text-gray-900 font-medium line-clamp-2 md:text-lg group-hover:text-pink-600 transition-colors">
                {product.name}
              </h3>
              <p className="mt-2 text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
            </div>
          </Link>
        ))}
        
        {products.length === 0 && (
          <div className="col-span-full py-20 outline-dashed outline-2 outline-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-xl font-semibold text-gray-800 mb-2">Chưa có sản phẩm nào</p>
            <p className="text-gray-500 mb-6">Chúng tôi đang cập nhật thêm sản phẩm. Vui lòng quay lại sau nhé!</p>
            <Link href="/" className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">Quay Lại Trang Chủ</Link>
          </div>
        )}
      </div>
    </div>
  );
}
