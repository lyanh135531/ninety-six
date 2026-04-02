"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Search, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const itemsCount = useCartStore((state) => state.items.reduce((acc, curr) => acc + curr.quantity, 0));

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Ninety Six Logo" 
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <span className="text-xl font-bold text-teal-700">Ninety Six</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <Link href="/" className="hover:text-teal-700 transition-colors">Trang chủ</Link>
          <Link href="/collections/mom" className="hover:text-teal-700 transition-colors">Cho Mẹ</Link>
          <Link href="/collections/baby" className="hover:text-teal-700 transition-colors">Cho Bé</Link>
          <Link href="/about" className="hover:text-teal-700 transition-colors">Về chúng tôi</Link>
        </nav>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          {/* Search Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-gray-100 rounded-full shadow-sm pr-2 animate-in fade-in slide-in-from-right-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-4 py-2 w-48 md:w-64 outline-none text-sm bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="p-1 hover:bg-gray-50 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-teal-50 rounded-full text-gray-700 hover:text-teal-700 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
          <Link href="/cart" className="relative p-2 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-full transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            <ShoppingBag className="w-6 h-6" />
            {mounted && itemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-teal-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>

          <button className="md:hidden p-2 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-full transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
