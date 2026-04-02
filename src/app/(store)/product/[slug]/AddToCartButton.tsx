"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/components/Admin/ToastProvider";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
    size?: string;
  };
  disabled?: boolean;
  onAddAttempt?: () => void;
}

export default function AddToCartButton({ product, disabled, onAddAttempt }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const handleAdd = () => {
    if (disabled) {
      if (onAddAttempt) onAddAttempt();
      return;
    }
    addItem(product);
    showToast(`Đã thêm ${product.name} ${product.size ? `(Size: ${product.size})` : ""} vào giỏ hàng!`);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-3 py-4 md:py-5 px-8 rounded-full font-bold text-lg shadow-xl shadow-teal-200 hover:shadow-2xl hover:bg-teal-800 hover:-translate-y-1 active:scale-[0.98] transition-all bg-teal-700 text-white cursor-pointer`}
    >
      <ShoppingBag className="w-6 h-6" />
      Thêm Vào Giỏ Hàng
    </button>
  );
}
