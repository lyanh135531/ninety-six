"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Search, X, Home, Baby, User2, Package, Heart, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ", icon: Home, exact: true },
  { href: "/collections/mom", label: "Cho Mẹ", icon: User2 },
  { href: "/collections/baby", label: "Cho Bé", icon: Baby },
  { href: "/about", label: "Về chúng tôi", icon: Heart },
  { href: "/order-tracking", label: "Tra cứu", icon: Package },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [prevCart, setPrevCart] = useState(0);
  const [badgeKey, setBadgeKey] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { totalItems, setDrawerOpen } = useCartStore();

  // Scroll-aware shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Badge pop animation when cart changes
  useEffect(() => {
    if (mounted && totalItems !== prevCart && totalItems > prevCart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBadgeKey(k => k + 1);
    }
    setPrevCart(totalItems);
  }, [totalItems, mounted, prevCart]);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Focus search input when opening
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Close search on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-gray-100/80"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-100/60"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 md:h-[68px] gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0 mr-2">
              <div className="w-9 h-9 md:w-10 md:h-10 relative overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Image src="/logo.png" alt="Ninety Six" fill className="object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-[15px] md:text-base font-black text-teal-900 tracking-tight"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  NINETY SIX
                </span>
                <span className="text-[9px] font-bold text-teal-900 tracking-[0.22em] uppercase mt-0.5">
                  Mom &amp; Baby
                </span>
              </div>
            </Link>

            {/* Desktop Nav — centred */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {NAV_LINKS.map(({ href, label, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-4 py-2 text-[13.5px] font-semibold rounded-xl transition-all duration-200 ${active
                      ? "text-teal-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    {label}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-teal-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(v => !v)}
                aria-label="Tìm kiếm"
                className="p-2.5 text-gray-500 hover:text-teal-900 hover:bg-teal-50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Cart */}
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Giỏ hàng"
                className="relative p-2.5 text-gray-500 hover:text-teal-900 hover:bg-teal-50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span
                    key={badgeKey}
                    className="animate-badge-pop absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-teal-700 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200 mx-1 hidden md:block" />

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Menu"
                className="md:hidden p-2.5 text-gray-500 hover:text-teal-900 hover:bg-teal-50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Dropdown */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? "max-h-32 opacity-100 pb-6" : "max-h-0 opacity-0 pointer-events-none pb-0"
              }`}
          >
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto p-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm... (ví dụ: lụa satin, đồ ngủ mẹ)"
                  className="w-full pl-11 pr-28 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:outline-none focus:ring-0 focus:border-gray-200 focus:bg-white transition-all placeholder:text-gray-400 shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-teal-700 text-white text-xs font-bold rounded-xl hover:bg-teal-800 transition-colors cursor-pointer"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Menu Backdrop */}
      {mounted && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
          />

          {/* Mobile Drawer */}
          <aside
            className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 relative">
                  <Image src="/logo.png" alt="Ninety Six" fill className="object-contain rounded-lg" />
                </div>
                <div>
                  <p className="font-black text-teal-900 text-sm leading-none">NINETY SIX</p>
                  <p className="text-[9px] font-bold text-teal-900 tracking-widest uppercase mt-0.5">Mom & Baby</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] px-3 mb-3 mt-2">
                Điều hướng
              </p>
              {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${active
                      ? "bg-teal-700 text-white shadow-md shadow-teal-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-teal-900"
                      }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span>{label}</span>
                    {!active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300" />}
                  </Link>
                );
              })}

              {/* Quick Category */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] px-3 mb-3">
                  Bộ sưu tập
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/collections/mom"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1.5 p-3 bg-teal-50 rounded-2xl hover:bg-teal-100 transition-colors"
                  >
                    <span className="text-2xl">👗</span>
                    <span className="text-xs font-bold text-teal-900">Cho Mẹ</span>
                  </Link>
                  <Link
                    href="/collections/baby"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1.5 p-3 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors"
                  >
                    <span className="text-2xl">🧸</span>
                    <span className="text-xs font-bold text-rose-600">Cho Bé</span>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => { setDrawerOpen(true); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-teal-700 text-white text-sm font-black rounded-2xl shadow-lg shadow-teal-200/60 hover:bg-teal-800 active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                Giỏ hàng
                {mounted && totalItems > 0 && (
                  <span className="bg-white text-teal-900 text-xs font-black px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
