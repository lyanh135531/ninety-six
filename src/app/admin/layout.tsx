import Link from "next/link";
import { ShoppingBag, Package, ListTree, Home, LogOut, User } from "lucide-react";
import { logoutAdmin } from "./login/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-100 text-teal-700 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          Ninety Six
        </div>
        <nav className="p-4 flex-1 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-colors">
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-colors">
            <Package className="w-5 h-5" />
            Sản phẩm
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-colors">
            <ListTree className="w-5 h-5" />
            Danh mục
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Đơn hàng
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-colors">
            <User className="w-5 h-5" />
            Khách hàng
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <form action={logoutAdmin}>
            <button type="submit" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </form>
          <div className="mt-4 px-3 text-xs text-gray-400">
            Ninety Six Admin v1.0
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
