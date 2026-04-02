import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import ProductActions from "./ProductActions";
import { Truck, RefreshCw, ShieldCheck, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const MINI_COMMITMENTS = [
  { icon: Truck, text: "Miễn phí giao hàng toàn quốc" },
  { icon: RefreshCw, text: "Đổi trả dễ dàng trong 7 ngày" },
  { icon: ShieldCheck, text: "Thanh toán 100% bảo mật" },
];

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Decode URL-encoded slug (handles Vietnamese characters like đồ-ngủ → đồ-ngủ)
  const slug = decodeURIComponent(resolvedParams.slug);

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  // Related products (same category, exclude current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  // Check if product is new (created within 14 days)
  const isNew = (new Date().getTime() - new Date(product.createdAt).getTime()) < 14 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <Link href="/" className="hover:text-teal-700 transition-colors cursor-pointer">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/collections/${product.category.slug}`} className="hover:text-teal-700 transition-colors cursor-pointer">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-600 font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main Product */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          {/* Image */}
          <div className="relative">
            <div className="bg-gray-50 rounded-3xl aspect-[3/4] overflow-hidden relative border border-gray-100 shadow-sm">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Không có ảnh</div>
              )}
            </div>
            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="bg-teal-700 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">⭐ Nổi Bật</span>
              )}
              {isNew && (
                <span className="bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">✨ Hàng Mới</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col py-2">
            {/* Category */}
            <div className="text-sm font-black tracking-widest text-teal-600 uppercase mb-3">
              {product.category.name}
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
              <p className="text-3xl font-black text-teal-700">{formatCurrency(product.price)}</p>
              <span className="text-sm text-gray-400 font-medium">Đã bao gồm VAT</span>
            </div>

            {/* Description */}
            <div className="text-gray-600 mb-8 leading-relaxed">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-gray-400 italic">Chưa có mô tả chi tiết cho sản phẩm này.</p>
              )}
            </div>

            {/* Product Actions (Size Selection + Add to Cart) */}
            <div className="mb-6">
              <ProductActions
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  sizes: product.sizes,
                }}
              />
            </div>

            {/* Mini Commitments */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              {MINI_COMMITMENTS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-7 h-7 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50/60">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1">Có thể bạn sẽ thích</p>
                <h2 className="text-2xl font-extrabold text-gray-900">Sản phẩm liên quan</h2>
              </div>
              <Link href={`/collections/${product.category.slug}`} className="text-teal-700 font-bold text-sm hover:underline cursor-pointer">
                Xem thêm →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/product/${rp.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 border border-transparent hover:border-teal-100 cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                    {rp.imageUrl ? (
                      <Image src={rp.imageUrl} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">Không có ảnh</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-teal-700 transition-colors">{rp.name}</h3>
                    <p className="mt-1.5 font-black text-gray-900">{formatCurrency(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
