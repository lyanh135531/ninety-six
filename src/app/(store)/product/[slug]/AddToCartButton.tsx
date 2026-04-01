"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-3 py-4 md:py-5 px-8 rounded-full font-bold text-lg shadow-xl shadow-pink-200 hover:shadow-2xl hover:-translate-y-1 transition-all ${
        added ? "bg-green-500 text-white shadow-green-200" : "bg-pink-600 text-white"
      }`}
    >
      <ShoppingBag className="w-6 h-6" />
      {added ? "Đã Thêm Vào Giỏ!" : "Thêm Vào Giỏ Hàng"}
    </button>
  );
}
