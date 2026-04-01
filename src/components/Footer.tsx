import Link from "next/link";
import { Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Ninety Six Logo" 
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
            <span className="text-xl font-bold text-teal-700">Ninety Six</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Chuyên cung cấp quần áo ngủ, đồ bộ dạo mặc nhà cao cấp dành cho Mẹ và Bé, mềm mại nâng niu những giấc ngủ êm đềm.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm">Chính Sách</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-teal-700 transition">Chính sách đổi trả</Link></li>
            <li><Link href="/" className="hover:text-teal-700 transition">Chính sách giao hàng</Link></li>
            <li><Link href="/" className="hover:text-teal-700 transition">Hướng dẫn chọn size</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm">Hỗ Trợ Khách Hàng</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-teal-700 transition">Câu hỏi thường gặp</Link></li>
            <li><Link href="/" className="hover:text-teal-700 transition">Gửi khiếu nại</Link></li>
            <li><Link href="/" className="hover:text-teal-700 transition">Liên hệ trực tiếp</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm">Kết Nối Với Chúng Tôi</h3>
          <div className="flex flex-wrap items-center gap-4 text-gray-400">
            <span className="hover:text-teal-700 transition font-medium text-sm">Facebook</span>
            <span className="hover:text-teal-700 transition font-medium text-sm">Instagram</span>
            <Phone className="w-5 h-5" />
          </div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Hotline: 1900 1234</p>
          <p className="mt-1 text-sm text-gray-400">Cửa hàng: 123 Đường Nhỏ, Quận 1, TP.HCM</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Ninety Six Store. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
}
