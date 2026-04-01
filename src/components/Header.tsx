"use client";

import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const itemsCount = useCartStore((state) => state.items.reduce((acc, curr) => acc + curr.quantity, 0));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-teal-700">
          <ShoppingBag className="w-6 h-6" />
          <span>Ninety Six</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <Link href="/" className="hover:text-teal-700 transition-colors">Trang chủ</Link>
          <Link href="/collections/mom" className="hover:text-teal-700 transition-colors">Cho Mẹ</Link>
          <Link href="/collections/baby" className="hover:text-teal-700 transition-colors">Cho Bé</Link>
          <Link href="/about" className="hover:text-teal-700 transition-colors">Về chúng tôi</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {mounted && itemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-teal-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-full">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
