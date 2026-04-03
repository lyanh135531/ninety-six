export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl min-h-[70vh]">
      {/* ── Title Skeleton ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse mb-4" />
        <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* ── Form Skeleton ── */}
      <div className="bg-white rounded-3xl shadow-xl shadow-teal-900/5 border border-gray-100 overflow-hidden mb-12">
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-gray-50/50">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse ml-1" />
            <div className="w-full h-14 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse ml-1" />
            <div className="w-full h-14 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
          <div className="w-full h-14 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
