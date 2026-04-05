import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { Prisma } from "@prisma/client";
import { Package } from "lucide-react";
import Link from "next/link";
import SortDropdown from "./SortDropdown";

// Force ISR caching every 30 seconds instead of force-dynamic for instant navigations
export const revalidate = 30;

type SortOption = "latest" | "price-asc" | "price-desc";

const CATEGORY_META: Record<
  string,
  {
    title: string;
    subtitle: string;
    desc: string;
    gradient: string;
    colorTitle: string;
    colorSubtitle: string;
    colorDesc: string;
    blobColor: string;
  }
> = {
  mom: {
    title: "Đồ Ngủ Cho Mẹ",
    subtitle: "Bộ sưu tập",
    desc: "Lụa satin & cotton organic cao cấp, thiết kế sang trọng mang lại sự thoải mái tuyệt đối, tôn lên vẻ đẹp rạng ngời của Mẹ.",
    gradient: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
    colorTitle: "text-teal-900",
    colorSubtitle: "text-teal-600",
    colorDesc: "text-teal-800/80",
    blobColor: "bg-teal-400/10",
  },
  baby: {
    title: "Đồ Ngủ Cho Bé",
    subtitle: "Bộ sưu tập",
    desc: "100% cotton mềm mại, an toàn tuyệt đối với làn da nhạy cảm của bé, giúp bé có những giấc ngủ thật ngon và sâu.",
    gradient: "linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)",
    colorTitle: "text-rose-800",
    colorSubtitle: "text-rose-600",
    colorDesc: "text-rose-800/60",
    blobColor: "bg-rose-400/10",
  },
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ search?: string; sort?: SortOption }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.search;
  const sort = resolvedSearchParams.sort || "latest";
  const cat = resolvedParams.category;
  const isMom = cat === "mom";
  const keyword = isMom ? "mẹ" : "bé";

  const meta = CATEGORY_META[cat] ?? CATEGORY_META["mom"];

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const productsRaw = await prisma.product.findMany({
    where: {
      category: { name: { contains: keyword, mode: "insensitive" } },
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy,
  });

  // Safe SQL read for stockBySizes + sizes
  let products = productsRaw;
  if (productsRaw.length > 0) {
    try {
      const ids = productsRaw.map((p) => p.id);
      const extraData: { id: string; stockBySizes: string; sizes: string }[] =
        await prisma.$queryRawUnsafe(
          'SELECT id, "stockBySizes", "sizes" FROM "Product" WHERE id = ANY($1)',
          ids,
        );
      products = productsRaw.map((p) => {
        const extra = extraData.find((s) => s.id === p.id);
        return {
          ...p,
          stockBySizes:
            extra?.stockBySizes ||
            (p as { stockBySizes?: string }).stockBySizes ||
            "{}",
          sizes: extra?.sizes || p.sizes,
        };
      });
    } catch (e) {
      console.error("Lỗi SQL (Collections):", e);
    }
  }

  const isBaby = cat !== "mom";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Category Hero Banner ── */}
      <section
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: meta.gradient }}
      >
        {/* Dots pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, #f472b6 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Blob */}
        <div
          className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${meta.blobColor} pointer-events-none`}
        />
        <div
          className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full ${meta.blobColor} pointer-events-none`}
        />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <nav
            className={`flex items-center gap-1.5 text-sm mb-6 font-medium ${isBaby ? "text-rose-400" : "text-teal-900/40"}`}
          >
            <Link
              href="/"
              className={`transition-colors ${isBaby ? "hover:text-rose-600" : "hover:text-teal-900"}`}
            >
              Trang chủ
            </Link>
            <span>/</span>
            <span
              className={isBaby ? "text-rose-600 font-bold" : "text-teal-900"}
            >
              {meta.title}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p
                className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${meta.colorSubtitle}`}
              >
                {meta.subtitle}
              </p>
              <h1
                className={`text-3xl md:text-5xl font-black leading-tight mb-3 ${meta.colorTitle}`}
              >
                {meta.title}
              </h1>
              <p
                className={`text-sm md:text-base leading-relaxed ${meta.colorDesc}`}
              >
                {meta.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Section ── */}
      <section className="container mx-auto px-6 max-w-7xl py-10 md:py-14">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p
              className={`text-xs font-black uppercase tracking-widest ${isBaby ? "text-rose-800/40" : "text-teal-800/40"}`}
            >
              {query ? `Kết quả cho "${query}"` : "Tất cả sản phẩm"}
            </p>
            <p
              className={`text-xl font-black mt-0.5 ${isBaby ? "text-rose-800" : "text-teal-900"}`}
            >
              {products.length}{" "}
              <span
                className={`font-bold text-base ${isBaby ? "text-rose-800/60" : "text-teal-800/40"}`}
              >
                sản phẩm
              </span>
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
          <div
            className={`py-24 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl border-2 border-dashed ${isBaby ? "bg-rose-50/50 border-rose-100" : "bg-gray-50/60 border-gray-200"}`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isBaby ? "bg-rose-50" : "bg-gray-100"}`}
            >
              <Package
                className={`w-8 h-8 ${isBaby ? "text-rose-800/20" : "text-teal-800/30"}`}
              />
            </div>
            <p
              className={`text-lg font-bold ${isBaby ? "text-rose-800" : "text-teal-800"}`}
            >
              Chưa có sản phẩm nào
            </p>
            <p
              className={`text-sm max-w-xs leading-relaxed ${isBaby ? "text-rose-800/30" : "text-teal-800/40"}`}
            >
              Chúng tôi đang bổ sung thêm sản phẩm. Hãy quay lại sớm nhé!
            </p>
            <Link
              href="/"
              className={`mt-2 px-7 py-3 text-white font-bold text-sm rounded-full hover:-translate-y-0.5 active:scale-95 transition-all shadow-md cursor-pointer ${isBaby ? "bg-rose-600 hover:bg-rose-500 shadow-rose-100" : "bg-teal-700 hover:bg-teal-800 shadow-teal-100"}`}
            >
              Về Trang Chủ
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
