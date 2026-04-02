import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Truck, RefreshCw, Leaf, ShieldCheck, Star, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const COMMITMENTS = [
  { icon: Truck, title: "Miễn phí vận chuyển", desc: "Toàn quốc, không giới hạn" },
  { icon: RefreshCw, title: "Đổi trả trong 7 ngày", desc: "Dễ dàng, không phức tạp" },
  { icon: Leaf, title: "100% Vải hữu cơ", desc: "An toàn cho mẹ và bé" },
  { icon: ShieldCheck, title: "Bảo hành chất lượng", desc: "Cam kết từ nhà sản xuất" },
];

export default async function StorefrontHome({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const query = (await searchParams).search;

  const [heroProduct, featuredProducts, allLatestProducts] = await Promise.all([
    prisma.product.findFirst({
      where: { isFeatured: true, imageUrl: { not: null } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isFeatured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.product.findMany({
      where: query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      } : {},
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  return (
    <>
      {/* =========================================
          HERO SECTION
      ========================================= */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-rose-50 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div className="space-y-6 text-center md:text-left">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-teal-100 rounded-full px-4 py-2 shadow-sm text-sm font-semibold text-teal-700">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                500+ khách hàng hài lòng
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Ngủ Êm Đềm{" "}
                <span className="relative">
                  <span className="text-teal-700">Đẹp Rạng Ngời</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-teal-200 rounded-full opacity-60" />
                </span>
              </h1>

              <p className="text-lg text-gray-500 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Bộ sưu tập đồ ngủ cao cấp dành riêng cho <strong className="text-gray-700">Mẹ và Bé</strong>. Chất liệu lụa satin và cotton organic mềm mại, mang lại giấc ngủ trọn vẹn nhất.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <Link href="/collections/mom" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-700 text-white font-bold rounded-full shadow-lg shadow-teal-200 hover:bg-teal-800 hover:-translate-y-1 active:scale-95 transition-all cursor-pointer">
                  Đồ Ngủ Mẹ <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/collections/baby" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 font-bold rounded-full shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all border border-teal-100 cursor-pointer">
                  Đồ Ngủ Bé
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                {/* Main image frame */}
                <div className="w-72 h-80 md:w-96 md:h-[28rem] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative">
                  {heroProduct?.imageUrl ? (
                    <Image
                      src={heroProduct.imageUrl}
                      alt={heroProduct.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-rose-100 flex items-center justify-center">
                      <span className="text-6xl">🛍️</span>
                    </div>
                  )}
                </div>

                {/* Floating price badge */}
                {heroProduct && (
                  <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-5 py-3 border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">Từ</p>
                    <p className="text-xl font-black text-teal-700">{formatCurrency(heroProduct.price)}</p>
                  </div>
                )}

                {/* Floating new badge */}
                <div className="absolute -top-4 -right-4 bg-rose-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg shadow-rose-200 rotate-6">
                  Mới Về ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          COMMITMENTS STRIP
      ========================================= */}
      <section className="border-y border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {COMMITMENTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 px-6 py-5 hover:bg-teal-50/30 transition-colors">
                <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          CATEGORY BANNERS
      ========================================= */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-black text-teal-600 uppercase tracking-widest">Bộ sưu tập</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Khám Phá Theo Phân Loại</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Cho Mẹ */}
          <Link href="/collections/mom" className="group relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1 active:scale-[0.99]">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-900" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <p className="text-teal-200 text-xs font-black uppercase tracking-widest mb-2">Bộ sưu tập</p>
              <h3 className="text-4xl font-extrabold text-white mb-3 group-hover:text-teal-100 transition-colors">Đồ Ngủ Cho Mẹ</h3>
              <p className="text-teal-100 text-sm mb-4">Lụa satin, cotton organic — Sang trọng & thoải mái</p>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-full border border-white/30 w-fit group-hover:bg-white group-hover:text-teal-700 transition-all">
                Khám phá <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Cho Bé */}
          <Link href="/collections/baby" className="group relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1 active:scale-[0.99]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-rose-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <p className="text-rose-200 text-xs font-black uppercase tracking-widest mb-2">Bộ sưu tập</p>
              <h3 className="text-4xl font-extrabold text-white mb-3 group-hover:text-rose-100 transition-colors">Đồ Ngủ Cho Bé</h3>
              <p className="text-rose-100 text-sm mb-4">100% cotton mềm — An toàn cho làn da nhạy cảm</p>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-full border border-white/30 w-fit group-hover:bg-white group-hover:text-rose-600 transition-all">
                Khám phá <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================
          FEATURED PRODUCTS
      ========================================= */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-teal-50/30 to-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <p className="text-xs font-black text-teal-600 uppercase tracking-widest">Lựa chọn hàng đầu</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Sản Phẩm Nổi Bật</h2>
              </div>
              <Link href="/" className="hidden md:inline-flex items-center gap-2 text-teal-700 font-bold text-sm hover:underline cursor-pointer">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 active:scale-[0.98] transition-all duration-300 border border-transparent hover:border-teal-100 cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Không có ảnh</div>
                    )}
                    <div className="absolute top-3 left-3 bg-teal-700 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                      ⭐ Nổi Bật
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">{product.category.name}</span>
                    <h3 className="mt-1.5 text-gray-900 font-semibold line-clamp-2 group-hover:text-teal-700 transition-colors">{product.name}</h3>
                    <p className="mt-2 text-lg font-black text-gray-900">{formatCurrency(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          ALL / SEARCH PRODUCTS
      ========================================= */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            {query ? (
              <>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Kết quả tìm kiếm</p>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  &ldquo;{query}&rdquo;
                  <span className="text-lg font-medium text-gray-400 ml-3">({allLatestProducts.length} sản phẩm)</span>
                </h2>
              </>
            ) : (
              <>
                <p className="text-xs font-black text-teal-600 uppercase tracking-widest">Mới lên kệ</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Sản Phẩm Mới Nhất</h2>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {allLatestProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 border border-transparent hover:border-teal-100 cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Không có ảnh</div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-10">
                    Nổi Bật
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-teal-600 tracking-wider uppercase">{product.category.name}</span>
                <h3 className="mt-1.5 text-gray-900 font-semibold line-clamp-2 group-hover:text-teal-700 transition-colors">{product.name}</h3>
                <p className="mt-2 text-lg font-black text-gray-900">{formatCurrency(product.price)}</p>
              </div>
            </Link>
          ))}

          {allLatestProducts.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-3">
              <p className="text-5xl">🔍</p>
              <p className="text-xl font-bold text-gray-700">Không tìm thấy sản phẩm nào</p>
              <p className="text-gray-400">Thử tìm với từ khóa khác nhé!</p>
              <Link href="/" className="inline-block mt-4 px-6 py-2.5 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition cursor-pointer">
                Về Trang Chủ
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
