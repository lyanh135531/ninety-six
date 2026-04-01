import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Hình ảnh */}
        <div className="bg-gray-50 rounded-3xl aspect-[3/4] overflow-hidden relative border border-gray-100 shadow-sm">
          {product.imageUrl ? (
             <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">Không có ảnh</div>
          )}
        </div>

        {/* Thông tin */}
        <div className="flex flex-col py-6">
          <div className="text-sm font-bold tracking-widest text-teal-500 uppercase mb-4">
            {product.category.name}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-8">
            {formatCurrency(product.price)}
          </p>

          <div className="prose prose-teal prose-sm sm:prose-base text-gray-600 mb-10 leading-relaxed">
            {product.description ? (
              <p>{product.description}</p>
            ) : (
              <p>Chưa có mô tả chi tiết cho sản phẩm này.</p>
            )}
          </div>

          <div className="mt-auto pt-6">
            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1, // initial quantity
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
