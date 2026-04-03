import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import {
  Truck, RefreshCw, Leaf, ShieldCheck,
  Star, ArrowRight, Sparkles, TrendingUp
} from "lucide-react";

export const dynamic = "force-dynamic";

const COMMITMENTS = [
  { icon: Truck,       title: "Miễn phí vận chuyển", desc: "Toàn quốc, không giới hạn đơn",   color: "teal" },
  { icon: RefreshCw,   title: "Đổi trả trong 7 ngày", desc: "Dễ dàng, không phức tạp",        color: "blue" },
  { icon: Leaf,        title: "100% Vải hữu cơ",      desc: "An toàn cho mẹ và làn da bé",   color: "emerald" },
  { icon: ShieldCheck, title: "Bảo hành chất lượng",  desc: "Cam kết từ nhà sản xuất",       color: "violet" },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  teal:    { bg: "bg-teal-50",   icon: "text-teal-600",   border: "group-hover:border-teal-200" },
  blue:    { bg: "bg-blue-50",   icon: "text-blue-600",   border: "group-hover:border-blue-200" },
  emerald: { bg: "bg-emerald-50",icon: "text-emerald-600",border: "group-hover:border-emerald-200" },
  violet:  { bg: "bg-violet-50", icon: "text-violet-600", border: "group-hover:border-violet-200" },
};

export default async function StorefrontHome({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const query = (await searchParams).search;

  const [heroProductRaw, featuredProductsRaw, allLatestProductsRaw] = await Promise.all([
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

  const allIds = [
    ...(heroProductRaw ? [heroProductRaw.id] : []),
    ...featuredProductsRaw.map(p => p.id),
    ...allLatestProductsRaw.map(p => p.id)
  ];

  let stockMap: Record<string, any> = {};
  if (allIds.length > 0) {
    try {
      const extraData: any[] = await prisma.$queryRawUnsafe(
        'SELECT id, "stockBySizes", "sizes" FROM "Product" WHERE id = ANY($1)',
        allIds
      );
      extraData.forEach(row => { stockMap[row.id] = row; });
    } catch (e) {
      console.error("Lỗi khi fetch stock via SQL (Home):", e);
    }
  }

  const mergeExtras = (p: any) => {
    if (!p) return p;
    const extra = stockMap[p.id];
    return {
      ...p,
      stockBySizes: extra?.stockBySizes || (p as any).stockBySizes || "{}",
      sizes: extra?.sizes || p.sizes
    };
  };

  const heroProduct      = mergeExtras(heroProductRaw);
  const featuredProducts = featuredProductsRaw.map(mergeExtras);
  const allLatestProducts = allLatestProductsRaw.map(mergeExtras);

  return (
    <>
      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f0fdf9 0%, #ffffff 45%, #fff1f2 100%)" }}>
        {/* Background blobs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(244,63,94,0.09) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
          style={{ background: "radial-gradient(ellipse, rgba(20,184,166,0.06) 0%, transparent 65%)" }} />

        <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ── Text Side ── */}
            <div className="space-y-7 text-center md:text-left">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2.5 bg-white border border-teal-100 rounded-full pl-3 pr-4 py-1.5 shadow-sm shadow-teal-50">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">500+ khách hàng hài lòng</span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-[56px] font-black text-gray-900 leading-[1.1] tracking-tight">
                  Ngủ Êm Đềm,{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10" style={{ color: "#0f766e" }}>Đẹp Rạng Ngời</span>
                    <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                      <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#99f6e4" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-gray-500 max-w-md mx-auto md:mx-0 leading-relaxed">
                  Bộ sưu tập đồ ngủ cao cấp dành riêng cho{" "}
                  <strong className="text-gray-700">Mẹ và Bé</strong>. Lụa satin &amp; cotton organic mềm mại — mang lại giấc ngủ trọn vẹn nhất.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <Link
                  href="/collections/mom"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm rounded-full text-white transition-all hover:-translate-y-1 active:scale-95 shadow-lg cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #0f766e, #0d9488)", boxShadow: "0 8px 24px rgba(15,118,110,0.28)" }}
                >
                  Đồ Ngủ Cho Mẹ <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/collections/baby"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm rounded-full bg-white text-gray-700 border border-gray-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:-translate-y-1 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  Đồ Ngủ Cho Bé
                </Link>
              </div>

              {/* Stats Row */}
              <div className="hidden md:flex items-center gap-6 pt-2">
                {[
                  { num: "500+", label: "Khách hàng" },
                  { num: "50+",  label: "Sản phẩm" },
                  { num: "100%", label: "Hữu cơ" },
                ].map(({ num, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-xl font-black text-teal-700 leading-none">{num}</p>
                    <p className="text-xs text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Image Side ── */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                {/* Main card */}
                <div className="w-64 h-[340px] md:w-80 md:h-[430px] lg:w-96 lg:h-[520px] rounded-[2.5rem] overflow-hidden relative border-4 border-white shadow-2xl"
                  style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.12), 0 0 0 4px white" }}>
                  {heroProduct?.imageUrl ? (
                    <Image
                      src={heroProduct.imageUrl}
                      alt={heroProduct.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-rose-100 flex items-center justify-center">
                      <span className="text-6xl">🌙</span>
                    </div>
                  )}
                  {/* Inner gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Floating price badge */}
                {heroProduct && (
                  <div
                    className="animate-float-rev absolute -bottom-5 -left-8 bg-white rounded-2xl shadow-xl px-5 py-3.5 border border-gray-100"
                    style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
                  >
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Giá từ</p>
                    <p className="text-xl font-black text-teal-700 mt-0.5">{formatCurrency(heroProduct.price)}</p>
                  </div>
                )}

                {/* Floating new badge */}
                <div
                  className="animate-float absolute -top-5 -right-5 bg-rose-500 text-white text-xs font-black px-3.5 py-2 rounded-2xl shadow-lg"
                  style={{ transform: "rotate(-8deg)", boxShadow: "0 8px 24px rgba(244,63,94,0.35)" }}
                >
                  Mới Về ✨
                </div>

                {/* Floating trust badge */}
                <div
                  className="animate-float-rev absolute top-8 -left-10 bg-white rounded-2xl shadow-md px-3.5 py-2.5 border border-gray-100 hidden lg:flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-700 leading-none">Cotton Hữu Cơ</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Chứng nhận GOTS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 32L1440 32L1440 0C1200 28 900 32 720 20C540 8 240 0 0 20L0 32Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============================================================
          COMMITMENTS STRIP
      ============================================================ */}
      <section className="py-4 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {COMMITMENTS.map(({ icon: Icon, title, desc, color }) => {
              const cls = colorMap[color];
              return (
                <div
                  key={title}
                  className={`group flex items-center gap-3.5 px-5 py-5 hover:bg-gray-50/60 transition-colors border border-transparent ${cls.border}`}
                >
                  <div className={`w-10 h-10 rounded-2xl ${cls.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                    <Icon className={`w-4.5 h-4.5 ${cls.icon}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CATEGORY BANNERS
      ============================================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-xs font-black text-teal-600 uppercase tracking-[0.25em] mb-3">Bộ sưu tập</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Khám Phá Theo Phong Cách</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7">
            {/* Cho Mẹ */}
            <Link
              href="/collections/mom"
              className="group relative h-72 md:h-96 rounded-[2rem] overflow-hidden cursor-pointer focus-visible:ring-4 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, #0f766e 0%, #0c4a6e 100%)" }}
              />
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
              {/* Pattern dots */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="text-teal-300 text-[10px] font-black uppercase tracking-[0.25em] mb-2">Bộ sưu tập</span>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-teal-100 transition-colors">Đồ Ngủ Cho Mẹ</h3>
                <p className="text-teal-200 text-sm mb-5 max-w-xs leading-relaxed">Lụa satin, cotton organic — Sang trọng &amp; thoải mái tuyệt đối</p>
                <span className="inline-flex items-center gap-2 w-fit bg-white/15 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-full border border-white/25 group-hover:bg-white group-hover:text-teal-700 transition-all duration-300">
                  Khám phá <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Cho Bé */}
            <Link
              href="/collections/baby"
              className="group relative h-72 md:h-96 rounded-[2rem] overflow-hidden cursor-pointer focus-visible:ring-4 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)" }}
              />
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="text-rose-300 text-[10px] font-black uppercase tracking-[0.25em] mb-2">Bộ sưu tập</span>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-rose-100 transition-colors">Đồ Ngủ Cho Bé</h3>
                <p className="text-rose-200 text-sm mb-5 max-w-xs leading-relaxed">100% cotton mềm mại — An toàn cho làn da nhạy cảm nhất</p>
                <span className="inline-flex items-center gap-2 w-fit bg-white/15 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-full border border-white/25 group-hover:bg-white group-hover:text-rose-600 transition-all duration-300">
                  Khám phá <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED PRODUCTS
      ============================================================ */}
      {featuredProducts.length > 0 && (
        <section className="py-20" style={{ background: "linear-gradient(180deg, #f0fdf9 0%, #ffffff 100%)" }}>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <p className="text-xs font-black text-teal-600 uppercase tracking-[0.22em]">Lựa chọn hàng đầu</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">Sản Phẩm Nổi Bật</h2>
              </div>
              <Link
                href="/collections/mom"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline transition-colors cursor-pointer"
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          ALL / SEARCH PRODUCTS
      ============================================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              {query ? (
                <>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.22em]">Kết quả tìm kiếm</p>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    &ldquo;{query}&rdquo;
                    <span className="text-base font-semibold text-gray-400 ml-3">
                      ({allLatestProducts.length} sản phẩm)
                    </span>
                  </h2>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-500" />
                    <p className="text-xs font-black text-rose-500 uppercase tracking-[0.22em]">Mới lên kệ</p>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900">Sản Phẩm Mới Nhất</h2>
                </>
              )}
            </div>
          </div>

          {allLatestProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {allLatestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50/60 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-5xl">🔍</div>
              <p className="text-xl font-bold text-gray-700">Không tìm thấy sản phẩm nào</p>
              <p className="text-gray-400 text-sm max-w-xs">Hãy thử tìm với từ khóa khác. Chúng tôi có hàng trăm sản phẩm đang chờ bạn!</p>
              <Link
                href="/"
                className="mt-2 px-7 py-3 bg-teal-700 text-white font-bold text-sm rounded-full hover:bg-teal-800 hover:-translate-y-0.5 active:scale-95 transition-all shadow-md shadow-teal-100 cursor-pointer"
              >
                Về Trang Chủ
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          BRAND STORY STRIP (Social Proof)
      ============================================================ */}
      <section className="py-16 border-t border-gray-100" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0c4a6e 100%)" }}>
        <div className="container mx-auto px-6 max-w-7xl text-center text-white">
          <p className="text-teal-300 text-xs font-black uppercase tracking-[0.25em] mb-4">Tại sao chọn chúng tôi?</p>
          <h2 className="text-2xl md:text-3xl font-black mb-4">Được Hàng Nghìn Mẹ Yêu Thích</h2>
          <p className="text-teal-100 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10">
            Mỗi sản phẩm đều trải qua kiểm định chất lượng nghiêm ngặt. Chúng tôi tin rằng giấc ngủ ngon bắt đầu từ bộ đồ ngủ hoàn hảo.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: "🌿", label: "Cotton hữu cơ GOTS" },
              { icon: "🚚", label: "Giao hàng toàn quốc" },
              { icon: "⭐", label: "4.9/5 đánh giá" },
              { icon: "🔄", label: "Đổi trả 7 ngày" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 bg-white/15 rounded-full px-5 py-2.5">
                <span>{icon}</span>
                <span className="text-sm font-bold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
