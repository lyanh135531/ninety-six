import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tìm kiếm | Ninety Six Store",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const resultsRaw = query
    ? await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      })
    : [];

  // Safe Read: Fetch stockBySizes/sizes via raw SQL
  let results = resultsRaw;
  if (resultsRaw.length > 0) {
    try {
      const ids = resultsRaw.map(p => p.id);
      const extraData: any[] = await prisma.$queryRawUnsafe(
        'SELECT id, "stockBySizes", "sizes" FROM "Product" WHERE id = ANY($1)',
        ids
      );
      
      results = resultsRaw.map(p => {
        const extra = extraData.find(s => s.id === p.id);
        return {
          ...p,
          stockBySizes: extra?.stockBySizes || (p as any).stockBySizes || "{}",
          sizes: extra?.sizes || p.sizes
        };
      });
    } catch (e) {
      console.error("Lỗi khi fetch stock via SQL (Search):", e);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[60vh]">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Tìm kiếm</h1>
        </div>
        {query ? (
          <p className="text-gray-500 ml-13">
            Kết quả cho <strong className="text-gray-800">&ldquo;{query}&rdquo;</strong> —{" "}
            <span className="text-teal-700 font-bold">{results.length} sản phẩm</span>
          </p>
        ) : (
          <p className="text-gray-400">Nhập từ khóa vào ô tìm kiếm ở trên để bắt đầu.</p>
        )}
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-6xl">🔍</p>
          <h2 className="text-2xl font-bold text-gray-700">Không tìm thấy sản phẩm nào</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Không có kết quả cho <strong>&ldquo;{query}&rdquo;</strong>. Thử tìm với từ khóa khác hoặc duyệt theo danh mục nhé!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link href="/collections/mom" className="px-6 py-3 bg-teal-700 text-white font-bold rounded-full hover:bg-teal-800 hover:-translate-y-0.5 transition-all cursor-pointer">
              Đồ Ngủ Cho Mẹ
            </Link>
            <Link href="/collections/baby" className="px-6 py-3 bg-white text-teal-700 font-bold rounded-full border border-teal-100 shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer">
              Đồ Ngủ Cho Bé
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
