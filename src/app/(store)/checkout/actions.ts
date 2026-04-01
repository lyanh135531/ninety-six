"use server";

import { prisma } from "@/lib/prisma";
import { CartItem } from "@/store/useCartStore";

export async function createOrder(formData: FormData, items: CartItem[], totalAmount: number) {
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const customerAddress = formData.get("customerAddress") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  
  const orderItemsJSON = JSON.stringify(items);

  const order = await prisma.order.create({
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

  return { success: true, orderId: order.id };
}
