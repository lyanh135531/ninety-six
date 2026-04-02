"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Search, X, Home, Baby, User2, Package, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ", icon: Home, exact: true },
  { href: "/collections/mom", label: "Cho Mẹ", icon: User2 },
  { href: "/collections/baby", label: "Cho Bé", icon: Baby },
  { href: "/about", label: "Về chúng tôi", icon: Heart },
  { href: "/order-tracking", label: "Tra cứu đơn hàng", icon: Package },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const { totalItems, setDrawerOpen } = useCartStore();

  // Close mobile menu on route change
  useEffect(() => {
    const t = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className={`sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${isSearchOpen ? 'py-4' : 'py-3'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                <Image src="/logo.png" alt="Ninety Six" width={48} height={48} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black text-gray-900 tracking-tighter leading-none">NINETY SIX</span>
                <span className="text-[10px] font-bold text-teal-600 tracking-[0.2em] uppercase mt-0.5">Mom & Baby</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                      active ? "text-teal-700 bg-teal-50" : "text-gray-500 hover:text-teal-700 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-full transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer relative"
              >
                {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
              </button>
              
              <button 
                onClick={() => setDrawerOpen(true)}
                className="p-2 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-full transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer relative"
              >
                <ShoppingBag className="w-6 h-6" />
                {mounted && totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-teal-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-gray-100 mx-1 hidden md:block"></div>

              {/* Hamburger */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-full transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSearchOpen ? 'max-h-20 mt-4 opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto pb-2">
              <input 
                type="text" 
                placeholder="Tìm sản phẩm (ví dụ: đồ ngủ, váy, lụa...)" 
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Menu Overlay */}
      {mounted && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Drawer */}
          <aside
            className={`fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl md:hidden flex flex-col transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Ninety Six" width={32} height={32} className="rounded-full object-contain" />
                <span className="font-bold text-teal-700">Ninety Six</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-1">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-3 mb-3 mt-2">Điều hướng</p>
              {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all ${
                      active
                        ? "bg-teal-700 text-white shadow-md shadow-teal-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-teal-700"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setDrawerOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-teal-700 text-white font-bold rounded-full shadow-lg shadow-teal-200 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                Giỏ hàng {mounted && totalItems > 0 ? `(${totalItems})` : ""}
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
