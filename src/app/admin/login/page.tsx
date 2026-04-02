import { loginAdmin } from "./actions";
import { Lock, ShoppingBag } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminToken === adminPassword) {
    redirect("/admin");
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-teal-50 border border-gray-100 overflow-hidden">
        <div className="p-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-700 text-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản trị viên</h1>
          <p className="text-gray-500 mb-10">Vui lòng nhập mật khẩu để truy cập hệ thống Ninety Six.</p>
          
          <form
            action={loginAdmin}
            className="w-full flex flex-col gap-6"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-700 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                name="password"
                type="password"
                required
                autoFocus
                placeholder="Mật khẩu truy cập"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-teal-700 focus:ring-4 focus:ring-teal-700/5 rounded-2xl outline-none transition-all text-gray-900"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-4 bg-teal-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-700/20 hover:bg-teal-800 hover:-translate-y-1 transition-all active:scale-[0.98] cursor-pointer"
            >
              Đăng nhập hệ thống
            </button>
          </form>
          
          <div className="mt-10 text-sm text-gray-400 flex items-center justify-center gap-1.5">
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            Ninety Six Admin Console v1.0
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
