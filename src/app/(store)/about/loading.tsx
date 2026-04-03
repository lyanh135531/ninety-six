export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* ── Hero Skeleton ── */}
      <section className="relative bg-gray-50 overflow-hidden py-24 lg:py-32">
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="w-48 h-8 bg-gray-200 rounded-full animate-pulse mb-8" />
          <div className="w-full max-w-2xl h-16 bg-gray-200 rounded-2xl animate-pulse mb-6" />
          <div className="w-full max-w-xl h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </section>

      {/* ── Stats Skeleton ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center py-10 px-6">
                <div className="w-20 h-10 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
                <div className="w-24 h-3 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story Skeleton ── */}
      <section className="py-20 container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-5">
            <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-64 h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-40 h-12 bg-gray-200 rounded-full animate-pulse mt-4" />
          </div>
          <div className="w-full h-80 md:h-[450px] bg-gray-200 rounded-3xl animate-pulse" />
        </div>
      </section>
    </div>
  );
}
