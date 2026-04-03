import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="p-8">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-900 mb-6 font-medium transition">
        <ChevronLeft className="w-5 h-5" />
        Quay Lại Danh Sách
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Thêm Sản phẩm mới</h1>

      {categories.length === 0 ? (
        <div className="bg-orange-50 text-orange-800 p-4 rounded-xl border border-orange-200">
          Vui lòng tạo ít nhất 1 <strong>Danh mục</strong> trước khi thêm Sản phẩm. <Link href="/admin/categories" className="underline font-bold ml-2">Tạo ngay</Link>
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  )
}
