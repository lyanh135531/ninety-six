"use server";

import { prisma } from "@/lib/prisma";
import { CartItem } from "@/store/useCartStore";

export async function createOrder(formData: FormData, items: CartItem[], totalAmount: number) {
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const customerAddress = formData.get("customerAddress") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  
  const orderItemsJSON = JSON.stringify(items);

  // Create Order and Update Stock in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod,
        totalAmount,
        orderItems: orderItemsJSON,
        status: "PENDING",
      }
    });

    // Update stock for each item using raw SQL to bypass Prisma validation issues
    for (const item of items) {
      try {
        const products: any[] = await tx.$queryRawUnsafe(
          'SELECT "stockBySizes" FROM "Product" WHERE "id" = $1',
          item.id
        );

        if (products.length > 0) {
          const product = products[0];
          const stock = JSON.parse(product.stockBySizes || "{}");
          const sizeKey = item.size || "_total";
          
          if (stock[sizeKey] !== undefined) {
            stock[sizeKey] = Math.max(0, stock[sizeKey] - item.quantity);
            
            await tx.$executeRawUnsafe(
              'UPDATE "Product" SET "stockBySizes" = $1 WHERE "id" = $2',
              JSON.stringify(stock),
              item.id
            );
          }
        }
      } catch (e) {
        console.error(`Error updating stock for product ${item.id}:`, e);
      }
    }

    return order;
  });

  return { success: true, orderId: result.id };
}
