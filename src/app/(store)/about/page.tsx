import Image from "next/image";
import Link from "next/link";
import { Leaf, Heart, Star, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Về Chúng Tôi | Ninety Six Store",
  description: "Câu chuyện thương hiệu Ninety Six — Chuyên cung cấp đồ ngủ cao cấp dành cho Mẹ và Bé.",
};

const STATS = [
  { value: "500+", label: "Khách hàng hài lòng" },
  { value: "5 ★", label: "Đánh giá trung bình" },
  { value: "2+", label: "Năm kinh nghiệm" },
  { value: "100%", label: "Chất liệu tự nhiên" },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Tự nhiên & An toàn",
    desc: "Mọi sản phẩm đều được làm từ vải cotton organic và lụa satin tự nhiên, an toàn tuyệt đối cho cả làn da nhạy cảm của bé.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Heart,
    title: "Yêu thương từng mũi chỉ",
    desc: "Chúng tôi tin rằng một bộ đồ ngủ tốt không chỉ để mặc, mà còn là vòng ôm dịu dàng bao bọc giấc ngủ của người thân yêu.",
    color: "bg-rose-50 text-rose-500",
  },
  {
    icon: ShieldCheck,
    title: "Cam kết chất lượng",
    desc: "Tất cả sản phẩm được kiểm định kỹ lưỡng trước khi đến tay khách hàng. Không hài lòng, hoàn tiền 100% trong vòng 7 ngày.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Star,
    title: "Dịch vụ tận tâm",
    desc: "Đội ngũ tư vấn sẵn sàng hỗ trợ bạn 7 ngày trong tuần — chọn size, chọn chất liệu, hay bất cứ thắc mắc nào.",
    color: "bg-teal-50 text-teal-600",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-700 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-bold mb-8">
            <Heart className="w-4 h-4 fill-current" /> Câu chuyện của chúng tôi
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
            Từ Tình Yêu Thương<br />
            <span className="text-teal-200">Đến Từng Giấc Ngủ</span>
          </h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Ninety Six ra đời từ mong muốn đơn giản: mang đến những bộ đồ ngủ đẹp, an toàn và thoải mái nhất cho Mẹ và Bé Việt Nam.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center py-10 px-6">
                <p className="text-4xl font-extrabold text-teal-900 mb-1">{value}</p>
                <p className="text-sm text-teal-800/60 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-5 text-teal-800 leading-relaxed">
            <p className="text-xs font-black text-teal-600 uppercase tracking-widest">Câu chuyện thương hiệu</p>
            <h2 className="text-3xl font-extrabold text-teal-900">Tại sao là Ninety Six?</h2>
            <p>
              Tên thương hiệu <strong className="text-teal-900">Ninety Six (96)</strong> xuất phát từ một ý nghĩa giản dị — số 96 gợi nhớ đến những khoảnh khắc bình yên, sum vầy của gia đình Việt Nam.
            </p>
            <p>
              Chúng tôi bắt đầu từ một cửa hàng nhỏ với niềm đam mê vải và may mặc. Qua nhiều năm, chúng tôi hiểu rằng một bộ đồ ngủ không chỉ là quần áo — đó là sự chăm sóc, là tình yêu mà bạn dành cho những người thân yêu trước khi họ đặt đầu lên gối.
            </p>
            <p>
              Từ những đêm dài lựa chọn chất liệu, thử nghiệm, lắng nghe phản hồi từ hàng trăm người mẹ và gia đình — <strong className="text-teal-900">Ninety Six</strong> đã trở thành thương hiệu đồ ngủ được tin yêu nhất trong phân khúc cao cấp thân thiện.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 mt-4 px-7 py-3.5 bg-teal-700 text-white font-bold rounded-full shadow-lg shadow-teal-200 hover:bg-teal-800 hover:-translate-y-1 active:scale-95 transition-all cursor-pointer">
              Khám Phá Sản Phẩm <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative h-80 md:h-[450px]">
            <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-xl border-4 border-white">
              <Image
                src="/logo.png"
                alt="Ninety Six Store"
                fill
                className="object-contain p-12 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-rose-50 -z-10" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100">
              <p className="text-xs text-teal-800/40 font-bold uppercase tracking-widest">Thành lập</p>
              <p className="text-2xl font-black text-teal-900 mt-0.5">2022</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14 space-y-3">
            <p className="text-xs font-black text-teal-600 uppercase tracking-widest">Giá trị cốt lõi</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-teal-900">Chúng tôi tin vào điều gì</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 flex gap-5">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-teal-900 mb-2">{title}</h3>
                  <p className="text-teal-800/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-teal-900">Sẵn sàng mua sắm?</h2>
          <p className="text-teal-800/60">Khám phá bộ sưu tập đồ ngủ cao cấp dành cho cả gia đình bạn ngay hôm nay.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/collections/mom" className="px-8 py-3.5 bg-teal-700 text-white font-bold rounded-full shadow-lg shadow-teal-200 hover:bg-teal-800 hover:-translate-y-1 active:scale-95 transition-all cursor-pointer">
              Đồ Ngủ Cho Mẹ
            </Link>
            <Link href="/collections/baby" className="px-8 py-3.5 bg-white text-teal-900 font-bold rounded-full shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all border border-teal-100 cursor-pointer">
              Đồ Ngủ Cho Bé
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
