import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const POLICY_LINKS = [
  { href: "/pages/return-policy", label: "Chính sách đổi trả" },
  { href: "/pages/shipping-policy", label: "Chính sách giao hàng" },
  { href: "/pages/size-guide", label: "Hướng dẫn chọn size" },
  { href: "/pages/faq", label: "Câu hỏi thường gặp" },
];

const SUPPORT_LINKS = [
  { href: "/order-tracking", label: "Tra cứu đơn hàng" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/cart", label: "Giỏ hàng của tôi" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-gray-100" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
      {/* ── Main Grid ── */}
      <div className="container mx-auto px-6 max-w-7xl py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="space-y-5 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Trang chủ Ninety Six">
            <div className="w-10 h-10 relative rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
              <Image src="/logo.png" alt="Ninety Six" fill className="object-contain" />
            </div>
            <div>
              <p className="font-black text-teal-900 text-sm tracking-tight leading-none">NINETY SIX</p>
              <p className="text-[9px] font-bold text-teal-900 tracking-[0.22em] uppercase mt-0.5">Mom &amp; Baby</p>
            </div>
          </Link>

          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Chuyên cung cấp quần áo ngủ, đồ bộ dạo mặc nhà cao cấp dành cho <strong className="text-gray-700 font-semibold">Mẹ và Bé</strong>. Mềm mại nâng niu những giấc ngủ êm đềm.
          </p>

          {/* Social */}
          <div className="flex items-center gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.04.1 2.28.14v2.5h-1.32c-1.2 0-1.46.57-1.46 1.43V12h2.7l-.43 3h-2.27v6.8C18.56 20.87 22 16.84 22 12z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400 hover:text-white hover:border-pink-500 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.25-.15-4.77-1.69-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.86 3.9 2.32 7.15 2.17 8.42 2.11 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07c-4.27.2-6.52 2.44-6.72 6.7C.28 8.05.26 8.47.26 12s.02 3.95.07 5.23c.2 4.26 2.45 6.5 6.72 6.71 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.27-.2 6.52-2.45 6.72-6.71.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.26-2.45-6.5-6.72-6.71C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zm0 10.16A4 4 0 1116 12a4 4 0 01-4 4zm5.8-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.88a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Chính sách */}
        <div>
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.18em] mb-5">Chính Sách</h3>
          <ul className="space-y-3">
            {POLICY_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-500 hover:text-teal-900 transition-colors flex items-center gap-1.5 group/link"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300 group-hover/link:bg-teal-500 transition-colors shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.18em] mb-5">Hỗ Trợ Khách Hàng</h3>
          <ul className="space-y-3">
            {SUPPORT_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-500 hover:text-teal-900 transition-colors flex items-center gap-1.5 group/link"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300 group-hover/link:bg-teal-500 transition-colors shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.18em] mb-5">Liên Hệ</h3>
          <ul className="space-y-4">
            <li>
              <a href="tel:19001234" className="flex items-start gap-3 text-sm text-gray-500 hover:text-teal-900 transition-colors group/item">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-teal-100 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-teal-900" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Hotline</p>
                  <p className="text-xs mt-0.5">1900 1234 (8:00 – 22:00)</p>
                </div>
              </a>
            </li>
            <li>
              <a href="mailto:hello@ninetysix.vn" className="flex items-start gap-3 text-sm text-gray-500 hover:text-teal-900 transition-colors group/item">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-teal-100 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-teal-900" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Email</p>
                  <p className="text-xs mt-0.5">hello@ninetysix.vn</p>
                </div>
              </a>
            </li>
            <li>
              <div className="flex items-start gap-3 text-sm text-gray-500">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-900" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Cửa hàng</p>
                  <p className="text-xs mt-0.5 leading-relaxed">123 Đường Nhỏ, Quận 1, TP.HCM</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            &copy; {year} <span className="font-semibold text-gray-600">Ninety Six Store</span>. Đã đăng ký bản quyền.
          </p>
          {/* Payment badges */}
          <div className="flex items-center gap-2">
            {["COD", "ATM", "Momo"].map(m => (
              <span key={m} className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md border border-gray-200">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
