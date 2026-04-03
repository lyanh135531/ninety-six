import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminHeader from "@/components/Admin/AdminHeader";
import ToastProvider from "@/components/Admin/ToastProvider";
import "./admin.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pendingOrderCount = await prisma.order.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <AdminSidebar pendingOrderCount={pendingOrderCount} />
      <ToastProvider>
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <AdminHeader />
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar animate-entrance">
            {children}
          </div>
        </main>
      </ToastProvider>
    </div>
  );
}
