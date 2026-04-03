"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  const breadcrumbs = pathnames.map((value, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

    // Map path segments to vietnamese labels
    const labels: Record<string, string> = {
      admin: "Trang chủ",
      products: "Sản phẩm",
      orders: "Đơn hàng",
      categories: "Danh mục",
      customers: "Khách hàng",
      new: "Thêm mới",
      edit: "Chỉnh sửa"
    };

    return {
      label: labels[value] || value.charAt(0).toUpperCase() + value.slice(1),
      to,
      last
    };
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/admin"
          className="text-gray-400 hover:text-teal-900 transition-colors p-1.5 hover:bg-teal-50 rounded-lg"
        >
          <Home className="w-4 h-4" />
        </Link>

        {breadcrumbs.slice(1).map((crumb) => (
          <div key={crumb.to} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            {crumb.last ? (
              <span className="font-bold text-gray-900 px-2 py-1 bg-gray-50 rounded-lg">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.to}
                className="text-gray-400 hover:text-teal-900 transition-colors px-2 py-1 hover:bg-gray-50 rounded-lg font-medium"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Session Profile */}
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 leading-none">Admin NinetySix</p>
            <p className="text-[10px] font-bold text-teal-600 mt-1 uppercase tracking-wider">Trình điều khiển</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-700 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-teal-100">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
