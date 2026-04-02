"use server";

import { prisma } from "@/lib/prisma";

export async function searchOrder(orderId: string, phone: string) {
  try {
    const trimmedOrderId = orderId.trim().replace(/^#/, "");
    const normalizedPhone = phone.trim().replace(/\D/g, "");

    if (!trimmedOrderId || !normalizedPhone) {
      return { success: false, error: "Thiếu thông tin tra cứu" };
    }

    // Find all potential matches by ID first
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { id: { equals: trimmedOrderId } },
          { id: { endsWith: trimmedOrderId.toLowerCase() } },
          { id: { endsWith: trimmedOrderId.toUpperCase() } }
        ]
      }
    });

    // Filter in-memory for matching normalized phone numbers
    const order = orders.find(o => 
      o.customerPhone.replace(/\D/g, "") === normalizedPhone
    );

    if (!order) {
      return { success: false, error: "Không tìm thấy đơn hàng với thông tin đã cung cấp" };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Order search error:", error);
    return { success: false, error: "Đã có lỗi xảy ra khi tra cứu" };
  }
}
