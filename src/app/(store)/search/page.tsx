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
      const extraData: { id: string; stockBySizes: string; sizes: string }[] = await prisma.$queryRawUnsafe(
        'SELECT id, "stockBySizes", "sizes" FROM "Product" WHERE id = ANY($1)',
        ids
      );

      results = resultsRaw.map(p => {
        const extra = extraData.find(s => s.id === p.id);
        return {
          ...p,
          stockBySizes: extra?.stockBySizes || (p as { stockBySizes?: string }).stockBySizes || "{}",
          sizes: extra?.sizes || p.sizes
        };
      });
    } catch (e) {
      console.error("Lỗi khi fetch stock via SQL (Search):", e);
    }
  }

  const isBaby = query.toLowerCase().includes("bé");
  const theme = {
    bg: isBaby ? "bg-rose-50" : "bg-teal-50",
    text: isBaby ? "text-rose-900" : "text-teal-900",
    textMuted: isBaby ? "text-rose-800/60" : "text-teal-800/60",
    primary: isBaby ? "bg-rose-900 hover:bg-rose-950" : "bg-teal-700 hover:bg-teal-800",
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[60vh]">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${theme.bg} ${theme.text}`}>
            <Search className="w-5 h-5" />
          </div>
          <h1 className={`text-3xl font-extrabold ${theme.text}`}>Tìm kiếm</h1>
        </div>
        {query ? (
          <p className={`${theme.textMuted} ml-13`}>
            Kết quả cho <strong className={theme.text}>&ldquo;{query}&rdquo;</strong> —{" "}
            <span className={`${theme.text} font-bold`}>{results.length} sản phẩm</span>
          </p>
        ) : (
          <p className="text-teal-800/40">Nhập từ khóa vào ô tìm kiếm ở trên để bắt đầu.</p>
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
          <h2 className="text-2xl font-bold text-teal-800">Không tìm thấy sản phẩm nào</h2>
          <p className="text-teal-800/40 max-w-md mx-auto">
            Không có kết quả cho <strong>&ldquo;{query}&rdquo;</strong>. Thử tìm với từ khóa khác hoặc duyệt theo danh mục nhé!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link href="/collections/mom" className="px-6 py-3 bg-teal-700 text-white font-bold rounded-full hover:bg-teal-800 hover:-translate-y-0.5 transition-all cursor-pointer">
              Đồ Ngủ Cho Mẹ
            </Link>
            <Link href="/collections/baby" className="px-6 py-3 bg-white text-rose-900 font-bold rounded-full border border-rose-100 shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer">
              Đồ Ngủ Cho Bé
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
