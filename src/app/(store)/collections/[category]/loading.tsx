export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Category Hero Banner Skeleton ── */}
      <section className="relative overflow-hidden py-14 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl w-full">
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="w-64 md:w-96 h-10 md:h-12 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </section>

      {/* ── Products Section Skeleton ── */}
      <section className="container mx-auto px-6 max-w-7xl py-10 md:py-14">
        {/* Toolbar Skeleton */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-40 h-10 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
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
      </section>
    </div>
  );
}
