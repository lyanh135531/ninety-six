import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StorefrontHome({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const query = (await searchParams).search;
  
  const latestProducts = await prisma.product.findMany({
    where: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    } : {},
    take: 12,
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-teal-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-100/50 to-white/20 pointer-events-none"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Ngủ Êm Đềm <br />
              <span className="text-teal-700">Đẹp Rạng Ngời</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              Bộ sưu tập đồ ngủ cao cấp dành riêng cho Mẹ và Bé. Chất liệu lụa satin và cotton organic mềm mại, mang lại giấc ngủ trọn vẹn nhất.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
              <Link href="/collections/mom" className="px-8 py-3.5 bg-teal-700 text-white font-medium rounded-full shadow-lg shadow-teal-200 hover:bg-teal-800 hover:-translate-y-1 active:scale-95 transition-all cursor-pointer">
                Đồ Ngủ Mẹ
              </Link>
              <Link href="/collections/baby" className="px-8 py-3.5 bg-white text-teal-700 font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all border border-teal-100 cursor-pointer">
                Đồ Ngủ Bé
              </Link>
            </div>
          </div>

          {/* Image/Graphic Placeholder */}
          <div className="flex-1 w-full flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-teal-200 shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white">
              {/* Fake hero image placeholder (ideally an image is here, or CSS gradient) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-300 to-purple-200"></div>
              <ShoppingBag className="w-32 h-32 text-white/50 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Mới Cập Nhật</h2>
          <p className="text-gray-500">Những thiết kế áo ngủ & pijama mới nhất vừa lên kệ.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {latestProducts.map((product: { id: string, name: string, slug: string, price: number, imageUrl: string | null, isFeatured: boolean, category: { name: string } }) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 border border-transparent hover:border-teal-100 cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">Không có ảnh</div>
                )}
                {/* Badge */}
                {product.isFeatured && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                    Nổi Bật
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-teal-700 tracking-wider uppercase">{product.category.name}</span>
                <h3 className="mt-2 text-gray-900 font-medium line-clamp-2 md:text-lg group-hover:text-teal-700 transition-colors">
                  {product.name}
                </h3>
                <p className="mt-2 text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
              </div>
            </Link>
          ))}

          {latestProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              Đang cập nhật thêm sản phẩm. Vui lòng quay lại sau!
            </div>
          )}
        </div>
      </section>
    </>
  );
}
