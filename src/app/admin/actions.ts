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
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  const isFeatured = formData.get("isFeatured") === "on";
  
  const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

  await prisma.product.create({
    data: {
      name,
      slug,
      price,
      categoryId,
      description,
      imageUrl,
      isFeatured,
    }
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const isFeatured = formData.get("isFeatured") === "on";

  await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      categoryId,
      description,
      imageUrl,
      isFeatured,
    }
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  
  if (product?.imageUrl && product.imageUrl.includes("res.cloudinary.com")) {
    try {
      // Extract public_id from Cloudinary URL
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

