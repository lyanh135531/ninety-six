import { notFound } from "next/navigation";
import { 
  Truck, 
  RefreshCw, 
  Ruler, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  LucideIcon
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

interface PolicyItem {
  title: string;
  icon: LucideIcon;
  description: string;
  content: ReactNode;
}

const POLICY_DATA: Record<string, PolicyItem> = {
  "shipping-policy": {
    title: "Chính Sách Giao Hàng",
    icon: Truck,
    description: "Đảm bảo đơn hàng đến tay bạn nhanh chóng và an toàn.",
    content: (
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" /> Thời gian xử lý đơn hàng
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Tất cả đơn hàng đặt trước 16:00 mỗi ngày sẽ được xử lý và bàn giao cho đơn vị vận chuyển ngay trong ngày. 
            Đơn đặt sau 16:00 sẽ được xử lý vào sáng ngày hôm sau.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-600" /> Thời gian giao hàng dự kiến
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
            <li><strong>Khu vực TP.HCM:</strong> 1 - 2 ngày làm việc.</li>
            <li><strong>Các tỉnh thành khác:</strong> 3 - 5 ngày làm việc tùy khu vực.</li>
          </ul>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" /> Phí giao hàng
          </h2>
          <p className="text-gray-600 leading-relaxed font-bold text-teal-700">
            Hiện tại Ninety Six đang áp dụng chương trình MIỄN PHÍ GIAO HÀNG cho mọi đơn hàng trên toàn quốc!
          </p>
        </section>
      </div>
    )
  },
  "return-policy": {
    title: "Chính Sách Đổi Trả",
    icon: RefreshCw,
    description: "Chúng tôi luôn lắng nghe và hỗ trợ bạn khi sản phẩm không vừa ý.",
    content: (
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" /> Thời gian đổi trả
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Quý khách có thể đổi trả sản phẩm trong vòng <strong>07 ngày</strong> kể từ ngày nhận hàng thành công.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" /> Điều kiện đổi trả
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
            <li>Sản phẩm còn nguyên tem mác, chưa qua giặt tẩy.</li>
            <li>Sản phẩm không bị hư hỏng do tác động từ phía khách hàng (rách, bẩn, có mùi lạ).</li>
            <li>Có video quay lại quá trình mở hộp (unboxing) để đối chiếu nếu hàng bị lỗi sản xuất.</li>
          </ul>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" /> Quy trình hoàn tiền
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Sau khi nhận được hàng gửi trả và kiểm tra điều kiện thành công, Ninety Six sẽ hoàn tiền lại cho quý khách trong vòng 3-5 ngày làm việc qua tài khoản ngân hàng.
          </p>
        </section>
      </div>
    )
  },
  "size-guide": {
    title: "Hướng Dẫn Chọn Size",
    icon: Ruler,
    description: "Tìm kích cỡ hoàn hảo cho Mẹ và Bé.",
    content: (
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 font-bold border-b border-gray-100 pb-2">Bảng Size Cho Mẹ</h2>
          <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm text-left">
            <thead>
              <tr className="bg-teal-700 text-white text-sm">
                <th className="p-3">Size</th>
                <th className="p-3">Cân nặng (kg)</th>
                <th className="p-3">Chiều cao (cm)</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              <tr className="bg-gray-50 border-b border-white"><td className="p-3 font-bold">S</td><td className="p-3">40 - 48</td><td className="p-3">150 - 158</td></tr>
              <tr className="bg-white border-b border-gray-50"><td className="p-3 font-bold">M</td><td className="p-3">49 - 56</td><td className="p-3">158 - 165</td></tr>
              <tr className="bg-gray-50"><td className="p-3 font-bold">L</td><td className="p-3">57 - 65</td><td className="p-3">165 - 172</td></tr>
            </tbody>
          </table>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 font-bold border-b border-gray-100 pb-2">Bảng Size Cho Bé</h2>
          <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm text-left">
            <thead>
              <tr className="bg-rose-500 text-white text-sm">
                <th className="p-3">Size</th>
                <th className="p-3">Cân nặng (kg)</th>
                <th className="p-3">Độ tuổi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              <tr className="bg-rose-50/30 border-b border-white"><td className="p-3 font-bold">Size 1</td><td className="p-3">8 - 10</td><td className="p-3">12 - 18 tháng</td></tr>
              <tr className="bg-white border-b border-rose-50/30"><td className="p-3 font-bold">Size 2</td><td className="p-3">11 - 13</td><td className="p-3">1.5 - 2.5 tuổi</td></tr>
              <tr className="bg-rose-50/30"><td className="p-3 font-bold">Size 3</td><td className="p-3">14 - 17</td><td className="p-3">3 - 4.5 tuổi</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    )
  },
  "faq": {
    title: "Câu Hỏi Thường Gặp",
    icon: HelpCircle,
    description: "Giải đáp những thắc mắc phổ biến của bạn.",
    content: (
      <div className="space-y-4">
        {[
          { q: "Sản phẩm có bị ra màu khi giặt không?", a: "Tất cả chất liệu của Ninety Six đều là vải cao cấp được xử lý màu bền vững, không ra màu và không co rút khi giặt máy ở chế độ thường." },
          { q: "Tôi có thể kiểm tra hàng trước khi thanh toán không?", a: "Dạ có, bạn hoàn toàn có thể kiểm tra sản phẩm xem đúng mẫu, đúng size và đúng chất lượng rồi mới thanh toán cho shipper ạ." },
          { q: "Shop có hỗ trợ gói quà không?", a: "Có ạ, Ninety Six hỗ trợ gói quà miễn phí cho các đơn hàng làm quà tặng, bạn chỉ cần ghi chú trong đơn hàng hoặc nhắn tin cho shop nhé." },
          { q: "Làm sao để biết chất liệu vải có an toàn cho bé không?", a: "Mọi sản phẩm Đồ Ngủ Bé đều dùng vải Cotton Organic 100%, có chứng chỉ an toàn nhuộm không chứa Formaldehyde, tuyệt đối lành tính cho da bé." }
        ].map((item, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="w-6 h-6 bg-teal-700 text-white text-[10px] rounded-full flex items-center justify-center flex-shrink-0">Q</span>
              {item.q}
            </h3>
            <p className="text-gray-600 text-sm pl-9 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    )
  }
};

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const page = POLICY_DATA[resolvedParams.slug];

  if (!page) {
    notFound();
  }

  const Icon = page.icon;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <nav className="flex items-center justify-center gap-2 text-xs font-black text-gray-300 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-teal-700 transition-colors">Ninety Six</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-teal-700">Chính sách & Hỗ trợ</span>
          </nav>
          <div className="inline-flex w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl items-center justify-center mb-6 shadow-sm">
            <Icon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{page.title}</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{page.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
          {page.content}
          
          <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">Vẫn còn thắc mắc?</p>
                <p className="text-xs text-gray-500">Chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
              </div>
            </div>
            <Link href="/" className="px-8 py-3 bg-teal-700 text-white font-bold rounded-full hover:bg-teal-800 transition-all shadow-lg shadow-teal-100 cursor-pointer">
              Liên Hệ Trực Tiếp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
