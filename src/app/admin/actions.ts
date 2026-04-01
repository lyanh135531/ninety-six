"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}


// --- PRODUCT ACTIONS ---
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

  await prisma.product.create({
    data: {
      name,
      slug,
      price,
      categoryId,
      description,
      imageUrl,
    }
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
