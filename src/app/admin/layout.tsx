import Link from "next/link";
import { ShoppingBag, Package, ListTree, Home } from "lucide-react";

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
        </nav>
        <div className="p-4 text-sm text-gray-400 border-t">
          Admin Panel v1.0
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
