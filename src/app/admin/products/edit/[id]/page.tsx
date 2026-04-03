import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../../new/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const [productRaw, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id }
    }),
    prisma.category.findMany()
  ]);

  if (!productRaw) {
    notFound();
  }

  // Fallback: Fetch stockBySizes and sizes via raw SQL to bypass stale client issues
  let product = productRaw;
  try {
    const rawData: any[] = await prisma.$queryRawUnsafe(
      'SELECT "stockBySizes", "sizes" FROM "Product" WHERE id = $1',
      id
    );
    
    if (rawData.length > 0) {
      product = {
        ...productRaw,
        stockBySizes: rawData[0].stockBySizes || (productRaw as any).stockBySizes || "{}",
        sizes: rawData[0].sizes || productRaw.sizes
      };
    }
  } catch (e) {
    console.error("Lỗi khi fetch stock/sizes via SQL (Edit Page):", e);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-gray-500 hover:text-teal-700 transition mb-4 font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Cập nhật Sản phẩm</h1>
        <p className="text-gray-500 mt-1">Sửa đổi thông tin và hình ảnh của sản phẩm #{product.id.slice(-6).toUpperCase()}</p>
      </div>

      <ProductForm 
        categories={categories} 
        initialData={product} 
        id={product.id} 
      />
    </div>
  );
}
