"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- CATEGORY ACTIONS ---
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/ /g, "-");

  await prisma.category.create({
    data: { name, slug }
  });

  revalidatePath("/admin/categories");
}

export async function createCategoryAction(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const name = (formData.get("name") as string)?.trim();
    if (!name) return { success: false, error: "Tên danh mục không được để trống" };
    const slug = name.toLowerCase().replace(/ /g, "-");
    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/admin/categories");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Tạo danh mục thất bại, vui lòng thử lại!" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/ /g, "-");

  await prisma.category.update({
    where: { id },
    data: { name, slug }
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  // Manual cascade because Prisma push might have issues
  const products = await prisma.product.findMany({ where: { categoryId: id } });
  
  for (const product of products) {
    if (product.imageUrl && product.imageUrl.includes("res.cloudinary.com")) {
      try {
        const parts = product.imageUrl.split("/");
        const fileNameWithExt = parts[parts.length - 1];
        const folderName = parts[parts.length - 2];
        const publicId = `${folderName}/${fileNameWithExt.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        console.error("Lỗi xóa ảnh sản phẩm:", e);
      }
    }
  }

  await prisma.product.deleteMany({ where: { categoryId: id } });
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { success: true };
}


// --- PRODUCT ACTIONS ---
export async function createProduct(formData: FormData) {
  try {
    const name = (formData.get("name") as string) || "Sản phẩm mới";
    const price = parseFloat((formData.get("price") as string) || "0") || 0;
    const categoryId = (formData.get("categoryId") as string);
    const description = (formData.get("description") as string) || "";
    const imageUrl = (formData.get("imageUrl") as string) || "";
    const sizes = (formData.get("sizes") as string) || "";
    const isFeatured = formData.get("isFeatured") === "on";
    
    // Better slug generation (replaces special characters)
    const baseSlug = name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese accents
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .trim()
      .replace(/[\s-]+/g, "-");
    const slug = `${baseSlug}-${Date.now()}`;

    console.log("Creating product:", { name, slug, price, categoryId });

    // Initial creation without sizes
    const product = await prisma.product.create({
      data: { name, slug, price, categoryId, description, imageUrl, isFeatured },
    });

    // Fallback SQL for 'sizes'
    try {
      await prisma.$executeRawUnsafe(
        'UPDATE "Product" SET "sizes" = $1 WHERE "id" = $2',
        sizes,
        product.id
      );
    } catch (e) {
      console.error("Lỗi khi cập nhật sizes via SQL:", e);
    }
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    throw error;
  }

  revalidatePath("/admin/products");
  redirect("/admin/products?toast=created");
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = (formData.get("name") as string);
    const price = parseFloat((formData.get("price") as string) || "0") || 0;
    const categoryId = (formData.get("categoryId") as string);
    const description = (formData.get("description") as string) || "";
    const imageUrl = (formData.get("imageUrl") as string) || "";
    const sizes = (formData.get("sizes") as string) || "";
    const isFeatured = formData.get("isFeatured") === "on";

    console.log("Updating product:", { id, name, price, categoryId });

    if (!id) throw new Error("Product ID is required for update");

    // Standard update for common fields
    await prisma.product.update({
      where: { id },
      data: { name, price, categoryId, description, imageUrl, isFeatured },
    });

    // Fallback SQL update for 'sizes' to bypass Prisma validation issues
    try {
      await prisma.$executeRawUnsafe(
        'UPDATE "Product" SET "sizes" = $1 WHERE "id" = $2',
        sizes,
        id
      );
    } catch (e) {
      console.error("Lỗi khi cập nhật sizes via SQL:", e);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    throw error;
  }

  revalidatePath("/admin/products");
  redirect("/admin/products?toast=updated");
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (product?.imageUrl && product.imageUrl.includes("res.cloudinary.com")) {
    try {
      const parts = product.imageUrl.split("/");
      const fileNameWithExt = parts[parts.length - 1];
      const folderName = parts[parts.length - 2];
      const publicId = `${folderName}/${fileNameWithExt.split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Lỗi xóa ảnh trên Cloudinary:", error);
    }
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}
