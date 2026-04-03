"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Package, ListTree, Home, LogOut, User, Clock, ChevronRight } from "lucide-react";
import { logoutAdmin } from "@/app/admin/login/actions";

interface AdminSidebarProps {
  pendingOrderCount: number;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home, exact: true },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: ListTree },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
];

export default function AdminSidebar({ pendingOrderCount }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-72 bg-white/95 backdrop-blur-xl border-r border-gray-100 flex flex-col h-full shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] z-[60] relative">
      {/* Brand Header */}
      <div className="p-10 border-b border-gray-50/50">
        <Link href="/admin" className="block group cursor-pointer">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none group-hover:text-teal-700 transition-colors">
              Ninety <span className="text-teal-700">Six</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-3 opacity-60">Management Hub</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="p-6 flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between px-3 mb-4 mt-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Hệ thống</span>
          <div className="h-px bg-gray-100 flex-1 ml-4" />
        </div>

        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl font-black text-[13px] transition-all relative overflow-hidden ${
                active
                  ? "bg-teal-700 text-white shadow-[0_10px_20px_-5px_rgba(15,118,110,0.3)] scale-[1.02]"
                  : "text-gray-500 hover:bg-teal-50/50 hover:text-teal-800"
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <Icon className={`w-5 h-5 transition-transform duration-500 ${active ? "opacity-100" : "opacity-60 group-hover:scale-110 group-hover:opacity-100"}`} />
                <span>{label}</span>
              </div>

              {/* Sidebar Badge for Pending Orders */}
              {href === "/admin/orders" && pendingOrderCount > 0 && (
                <div className={`relative z-10 px-2.5 py-1 rounded-xl text-[10px] font-black transition-all ${
                  active ? "bg-white/20 text-white" : "bg-orange-500 text-white shadow-lg shadow-orange-200"
                }`}>
                  {pendingOrderCount}
                </div>
              )}
              
              {/* Active Indicator Glow */}
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-800 pointer-events-none" />
              )}
            </Link>
          );
        })}

        <div className="flex items-center justify-between px-3 mb-4 mt-8">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Cộng đồng</span>
          <div className="h-px bg-gray-100 flex-1 ml-4" />
        </div>

        <Link
          href="/admin/customers"
          className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-[13px] transition-all overflow-hidden ${
            isActive("/admin/customers")
              ? "bg-teal-700 text-white shadow-[0_10px_20px_-5px_rgba(15,118,110,0.3)]"
              : "text-gray-500 hover:bg-teal-50/50 hover:text-teal-800"
          }`}
        >
          <User className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span>Khách hàng</span>
        </Link>
      </nav>

      {/* Footer / Meta Section */}
      <div className="p-6 mt-auto">
        {pendingOrderCount > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-orange-100/50 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Khẩn cấp</span>
              </div>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">Bạn có <span className="text-orange-600 font-black">{pendingOrderCount} đơn hàng</span> chưa được xử lý.</p>
              <Link href="/admin/orders?status=PENDING" className="text-[10px] text-orange-600 hover:text-orange-700 font-black mt-3 flex items-center gap-1 group/link tracking-wider uppercase">
                Giải quyết ngay <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="group flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all font-black text-xs uppercase tracking-[0.15em] cursor-pointer"
          >
            <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            Đăng xuất
          </button>
        </form>
        <p className="mt-6 text-center text-[9px] text-gray-300 font-black uppercase tracking-[0.25em]">Ninety Six • V1.2.0</p>
      </div>
    </aside>
  );
}
