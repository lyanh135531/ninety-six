import { Sparkles, TrendingUp } from "lucide-react";

export default function Loading() {
  return (
    <>
      {/* ── HERO SKELETON ── */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gray-50/50">
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <div className="space-y-7 text-center md:text-left">
              <div className="w-32 h-6 bg-gray-200 rounded-full mx-auto md:mx-0 animate-pulse" />
              <div className="space-y-3">
                <div className="w-3/4 h-12 md:h-16 bg-gray-200 rounded-xl mx-auto md:mx-0 animate-pulse" />
                <div className="w-1/2 h-12 md:h-16 bg-gray-200 rounded-xl mx-auto md:mx-0 animate-pulse" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse md:-translate-x-0" />
                <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <div className="w-40 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-32 h-12 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="w-64 h-[340px] md:w-80 md:h-[430px] lg:w-96 lg:h-[520px] rounded-[2.5rem] bg-gray-200 animate-pulse" />
            </div>

          </div>
        </div>
      </section>

      {/* ── PRODUCTS SKELETON ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-48 h-8 md:h-10 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-[1.75rem] border border-gray-100 flex flex-col overflow-hidden shadow-sm h-full">
                <div className="aspect-[3/4] bg-gray-100 w-full" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="w-16 h-3 bg-gray-200 rounded mb-3" />
                  <div className="w-full h-4 bg-gray-200 rounded mb-1" />
                  <div className="w-2/3 h-4 bg-gray-200 rounded mb-3" />
                  <div className="w-20 h-6 bg-gray-200 rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
