"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Package, ListTree, Home, LogOut, User, Clock } from "lucide-react";
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
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="Ninety Six Logo" 
            width={40}
            height={40}
            className="rounded-full object-contain shrink-0 shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black text-teal-700 tracking-tight leading-none">Ninety Six</span>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 flex-1 flex flex-col gap-1">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-3 mb-2 mt-1">Quản lý</p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                active
                  ? "bg-teal-700 text-white shadow-lg shadow-teal-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </span>
              {/* Badge đơn chờ */}
              {href === "/admin/orders" && pendingOrderCount > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  active ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
                }`}>
                  {pendingOrderCount}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-3 mb-2">Hệ thống</p>
          <Link
            href="/admin/customers"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isActive("/admin/customers")
                ? "bg-teal-700 text-white shadow-lg shadow-teal-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <User className="w-4 h-4" />
            Khách hàng
          </Link>
        </div>

        {pendingOrderCount > 0 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-2xl">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wide">Cần xử lý</span>
            </div>
            <p className="text-sm font-bold text-orange-700">{pendingOrderCount} đơn đang chờ duyệt</p>
            <Link href="/admin/orders?status=PENDING" className="text-xs text-orange-500 hover:text-orange-700 font-bold mt-1 inline-block hover:underline">
              Xem ngay →
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-50">
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all font-bold text-sm cursor-pointer hover:-translate-y-0.5 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </form>
        <p className="mt-3 px-3 text-[10px] text-gray-300 font-medium">Ninety Six Admin v1.0</p>
      </div>
    </aside>
  );
}
