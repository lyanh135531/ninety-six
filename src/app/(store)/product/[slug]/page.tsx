import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import ProductActions from "./ProductActions";
import ProductCard from "@/components/ProductCard";
import { Truck, RefreshCw, ShieldCheck, ChevronRight, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

const MINI_COMMITMENTS = [
  { icon: Truck, text: "Miễn phí giao hàng toàn quốc", color: "teal" },
  { icon: RefreshCw, text: "Đổi trả dễ dàng trong 7 ngày", color: "blue" },
  { icon: ShieldCheck, text: "Thanh toán 100% bảo mật", color: "emerald" },
];

const commitColor: Record<string, string> = {
  teal: "bg-teal-50 text-teal-600",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  const productRaw = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!productRaw) notFound();

  let product = productRaw;
  try {
    const rawData: { stockBySizes: string; sizes: string }[] = await prisma.$queryRawUnsafe(
      'SELECT "stockBySizes", "sizes" FROM "Product" WHERE id = $1',
      productRaw.id
    );
    if (rawData.length > 0) {
      product = {
        ...productRaw,
        stockBySizes: rawData[0].stockBySizes || (productRaw as { stockBySizes?: string }).stockBySizes || "{}",
        sizes: rawData[0].sizes || productRaw.sizes,
      };
    }
  } catch (e) {
    console.error("Lỗi SQL (Product Detail):", e);
  }

  const relatedProductsRaw = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  // Fetch stock for related products
  let relatedProducts = relatedProductsRaw;
  if (relatedProductsRaw.length > 0) {
    try {
      const ids = relatedProductsRaw.map(p => p.id);
      const extraData: { id: string; stockBySizes: string; sizes: string }[] = await prisma.$queryRawUnsafe(
        'SELECT id, "stockBySizes", "sizes" FROM "Product" WHERE id = ANY($1)',
        ids
      );
      relatedProducts = relatedProductsRaw.map(p => {
        const extra = extraData.find(s => s.id === p.id);
        return {
          ...p,
          stockBySizes: extra?.stockBySizes || "{}",
          sizes: extra?.sizes || p.sizes,
        };
      });
    } catch { }
  }

  const isNew =
    new Date().getTime() - new Date(product.createdAt).getTime() <
    14 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-6 max-w-6xl py-3.5">
          <nav className="flex items-center gap-1.5 text-xs text-teal-800/40" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-teal-900 transition-colors font-medium">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/collections/${product.category.slug}`}
              className="hover:text-teal-900 transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-teal-800 font-medium line-clamp-1 max-w-[180px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main Product ── */}
      <div className="container mx-auto px-6 py-10 md:py-14 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Image Column ── */}
          <div className="relative md:sticky md:top-24">
            <div
              className="rounded-[2rem] overflow-hidden aspect-[3/4] relative border border-gray-100 bg-gray-50"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-teal-800/30">
                  <Tag className="w-16 h-16" />
                  <span className="text-sm font-medium">Chưa có ảnh</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <span className="bg-teal-700 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                    ⭐ Nổi Bật
                  </span>
                )}
                {isNew && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                    ✨ Hàng Mới
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Info Column ── */}
          <div className="flex flex-col space-y-6">
            {/* Category tag */}
            <div>
              <span className="inline-block text-[10px] font-black text-teal-900 bg-teal-50 tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-teal-100">
                {product.category.name}
              </span>
            </div>

            {/* Product name */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-teal-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
              <p className="text-3xl md:text-4xl font-black text-teal-900">
                {formatCurrency(product.price)}
              </p>
              <span className="text-sm text-teal-800/40 font-medium">Đã bao gồm VAT</span>
            </div>

            {/* Description */}
            {product.description ? (
              <div className="text-teal-800 text-sm md:text-base leading-relaxed space-y-2">
                {product.description.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-teal-800/40 italic text-sm">
                Chưa có mô tả chi tiết cho sản phẩm này.
              </p>
            )}

            {/* Size + Add to Cart */}
            <ProductActions
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                sizes: product.sizes,
                stockBySizes: product.stockBySizes,
              }}
            />

            {/* Commitments */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              {MINI_COMMITMENTS.map(({ icon: Icon, text, color }, i) => (
                <div
                  key={text}
                  className={`flex items-center gap-3 px-4 py-3.5 text-sm text-teal-800 ${i < MINI_COMMITMENTS.length - 1 ? "border-b border-gray-100" : ""
                    } hover:bg-gray-50/60 transition-colors`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${commitColor[color]}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-gray-100" style={{ background: "#f8fafc" }}>
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.25em] mb-1">
                  Có thể bạn thích
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-teal-900">
                  Sản phẩm liên quan
                </h2>
              </div>
              <Link
                href={`/collections/${product.category.slug}`}
                className="text-sm font-bold text-teal-900 hover:underline cursor-pointer hidden md:block"
              >
                Xem thêm →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
