import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { Prisma } from "@prisma/client";
import { Package } from "lucide-react";
import Link from "next/link";
import SortDropdown from "./SortDropdown";

export const dynamic = "force-dynamic";

type SortOption = "latest" | "price-asc" | "price-desc";

const CATEGORY_META: Record<string, {
  title: string;
  subtitle: string;
  desc: string;
  gradient: string;
  emoji: string;
}> = {
  mom: {
    title: "Đồ Ngủ Cho Mẹ",
    subtitle: "Bộ sưu tập",
    desc: "Lụa satin & cotton organic cao cấp, thiết kế sang trọng mang lại sự thoải mái tuyệt đối, tôn lên vẻ đẹp rạng ngời của Mẹ.",
    gradient: "linear-gradient(135deg, #0f766e 0%, #0c4a6e 100%)",
    emoji: "👗",
  },
  baby: {
    title: "Đồ Ngủ Cho Bé",
    subtitle: "Bộ sưu tập",
    desc: "100% cotton mềm mại, an toàn tuyệt đối với làn da nhạy cảm của bé, giúp bé có những giấc ngủ thật ngon và sâu.",
    gradient: "linear-gradient(135deg, #be123c 0%, #9f1239 100%)",
    emoji: "🧸",
  },
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ search?: string; sort?: SortOption }>;
}) {
  const resolvedParams     = await params;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.search;
  const sort  = resolvedSearchParams.sort || "latest";
  const cat   = resolvedParams.category;
  const isMom = cat === "mom";
  const keyword = isMom ? "mẹ" : "bé";

  const meta = CATEGORY_META[cat] ?? CATEGORY_META["mom"];

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"  ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
                            { createdAt: "desc" };

  const productsRaw = await prisma.product.findMany({
    where: {
      category: { name: { contains: keyword, mode: "insensitive" } },
      ...(query ? {
        OR: [
          { name:        { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      } : {}),
    },
    include: { category: true },
    orderBy,
  });

  // Safe SQL read for stockBySizes + sizes
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
          sizes: extra?.sizes || p.sizes,
        };
      });
    } catch (e) {
      console.error("Lỗi SQL (Collections):", e);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Category Hero Banner ── */}
      <section className="relative overflow-hidden py-14 md:py-20" style={{ background: meta.gradient }}>
        {/* Dots pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        {/* Blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-white/80 font-medium">{meta.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.25em] mb-2">{meta.subtitle}</p>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
                {meta.title}
              </h1>
              <p className="text-white/75 text-sm md:text-base leading-relaxed">{meta.desc}</p>
            </div>
            <div className="text-5xl md:text-7xl">{meta.emoji}</div>
          </div>
        </div>
      </section>

      {/* ── Products Section ── */}
      <section className="container mx-auto px-6 max-w-7xl py-10 md:py-14">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">
              {query
                ? `Kết quả cho "${query}"`
                : "Tất cả sản phẩm"}
            </p>
            <p className="text-xl font-black text-gray-900 mt-0.5">
              {products.length}{" "}
              <span className="text-gray-400 font-medium text-base">sản phẩm</span>
            </p>
          </div>

          <SortDropdown current={sort} category={cat} query={query} />
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50/60 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-bold text-gray-700">Chưa có sản phẩm nào</p>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Chúng tôi đang bổ sung thêm sản phẩm. Hãy quay lại sớm nhé!
            </p>
            <Link
              href="/"
              className="mt-2 px-7 py-3 bg-teal-700 text-white font-bold text-sm rounded-full hover:bg-teal-800 hover:-translate-y-0.5 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Về Trang Chủ
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
