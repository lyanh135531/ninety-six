import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import ToastProvider from "@/components/Admin/ToastProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pendingOrderCount = await prisma.order.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <AdminSidebar pendingOrderCount={pendingOrderCount} />
      <ToastProvider>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </ToastProvider>
    </div>
  );
}
