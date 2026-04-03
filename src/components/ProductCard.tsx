"use client";

import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Star, X, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/Admin/ToastProvider";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    slug: string;
    isFeatured: boolean;
    sizes?: string | null;
    stockBySizes?: string | null;
    category: { name: string };
    createdAt: string | Date;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const availableSizes = product.sizes
    ? product.sizes.split(",").map(s => s.trim()).filter(s => s !== "")
    : [];

  const hasSizes = availableSizes.length > 0;

  const stock = (() => {
    try { return JSON.parse(product.stockBySizes || "{}"); }
    catch { return {}; }
  })();

  const totalStock =
    stock["_total"] !== undefined
      ? stock["_total"]

      : (Object.values(stock).reduce((a: number, b: unknown) => a + ((b as number) || 0), 0) as number);

  const isOutOfStock = totalStock <= 0;
  const isNew = (new Date().getTime() - new Date(product.createdAt).getTime()) < 14 * 24 * 60 * 60 * 1000;

  const isBaby = product.category.name.toLowerCase().includes("bé");

  // Theme variants
  const theme = {
    primary: isBaby ? "text-pink-700" : "text-teal-900",
    bg: isBaby ? "bg-pink-50" : "bg-teal-50",
    border: isBaby ? "border-pink-100" : "border-teal-100",
    featuredBadge: isBaby ? "bg-pink-600" : "bg-teal-700",
    newBadge: isBaby ? "bg-pink-400" : "bg-rose-500",
    btn: isBaby ? "bg-pink-600 hover:bg-pink-700" : "bg-teal-700 hover:bg-teal-800",
    hoverBorder: isBaby ? "#fbcfe8" : "#ccfbf1",
    hoverText: isBaby ? "group-hover:text-pink-700" : "group-hover:text-teal-900",
  };

  const doAdd = (size?: string) => {
    setIsAdding(true);
    setAddedSize(size || null);
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        size,
      });
      showToast(size ? `Đã thêm size ${size} vào giỏ!` : `Đã thêm "${product.name}" vào giỏ!`);
      setIsAdding(false);
      setAddedSize(null);
    }, 450);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasSizes) setIsModalOpen(true);
    else if (!isOutOfStock) doAdd();
  };

  const handleSizeAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    doAdd(size);
  };

  return (
    <>
      {/* ── Card ── */}
      <article className="group relative bg-white rounded-[1.75rem] overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-2"
        style={{
          boxShadow: "var(--shadow-card)",
          border: "1px solid #f1f5f9",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)"; (e.currentTarget as HTMLElement).style.borderColor = theme.hoverBorder; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"; (e.currentTarget as HTMLElement).style.borderColor = "#f1f5f9"; }}
      >
        {/* ── Image ── */}
        <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-gray-50 shrink-0 block cursor-pointer" tabIndex={-1}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ transform: "scale(1)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">
              <ShoppingBag className="w-10 h-10" />
              <span className="text-xs font-medium">Chưa có ảnh</span>
            </div>
          )}

          {/* Out of Stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/65 backdrop-blur-[2px] flex items-center justify-center z-20">
              <div className="bg-gray-800/80 text-white text-[10px] font-black px-4 py-2 rounded-full tracking-[0.25em] uppercase">
                Hết Hàng
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className={`inline-flex items-center gap-1 ${theme.featuredBadge} text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md`}>
                <Star className="w-2.5 h-2.5 fill-white" /> NỔI BẬT
              </span>
            )}
            {isNew && (
              <span className={`inline-flex items-center gap-1 ${theme.newBadge} text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md`}>
                ✨ MỚI
              </span>
            )}
          </div>

          {/* Quick View button (desktop on hover) */}
          <div
            className={`absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 cursor-pointer hidden md:flex ${isBaby ? "hover:bg-pink-600" : "hover:bg-teal-700"}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </div>

          {/* Quick Action Overlay (desktop, hover from bottom) */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20 hidden md:block">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/50">
              {hasSizes ? (
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-gray-400 text-center uppercase tracking-[0.2em]">
                    Chọn kích cỡ
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {availableSizes.map(size => {
                      const sizeStock = stock[size] !== undefined ? stock[size] : 0;
                      const out = sizeStock <= 0;
                      return (
                        <button
                          key={size}
                          disabled={isAdding || out}
                          onClick={e => handleSizeAdd(e, size)}
                          className={`relative min-w-[36px] h-8 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer disabled:opacity-50 ${addedSize === size
                            ? isBaby ? "bg-pink-600 border-pink-600 text-white scale-105" : "bg-teal-700 border-teal-700 text-white scale-105"
                            : out
                              ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                              : `bg-white border-gray-200 text-gray-700 hover:text-white hover:scale-105 ${isBaby ? "hover:bg-pink-600 hover:border-pink-600" : "hover:bg-teal-700 hover:border-teal-700"}`
                            }`}
                        >
                          {size}
                          {out && <span className="absolute inset-0 flex items-center justify-center"><span className="w-full h-px bg-gray-300 rotate-45 block" /></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleQuickAdd}
                  disabled={isAdding || isOutOfStock}
                  className={`w-full py-2.5 text-white text-xs font-black rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:cursor-default ${theme.btn}`}
                >
                  <ShoppingBag className={`w-3.5 h-3.5 ${isAdding ? "animate-bounce" : ""}`} />
                  {isAdding ? "ĐANG THÊM..." : isOutOfStock ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
                </button>
              )}
            </div>
          </div>
        </Link>

        {/* ── Info ── */}
        <div className="p-4 flex-1 flex flex-col">
          <Link href={`/product/${product.slug}`} className="flex-1 block cursor-pointer">
            <span className={`inline-block text-[9px] font-black tracking-[0.18em] uppercase px-2 py-0.5 rounded-md ${theme.primary} ${theme.bg}`}>
              {product.category.name}
            </span>
            <h3 className={`mt-2 text-gray-900 font-bold text-sm leading-tight line-clamp-2 transition-colors duration-200 ${theme.hoverText}`}>
              {product.name}
            </h3>
            <div className="mt-2.5 flex items-center gap-2">
              <p className={`text-lg font-black ${theme.primary}`}>{formatCurrency(product.price)}</p>
              {hasSizes && (
                <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                  {availableSizes.length} Sizes
                </span>
              )}
            </div>
          </Link>
        </div>
      </article>

      {/* ── Size Modal ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Chọn kích thước"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="animate-scale-in relative bg-white rounded-[2rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-gray-100">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="flex gap-4 mb-6 items-center">
              {product.imageUrl && (
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  <Image src={product.imageUrl as string} alt={product.name} width={56} height={56} className="object-cover w-full h-full" />
                </div>
              )}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${theme.primary}`}>Chọn kích thước</p>
                <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight text-sm mt-0.5">{product.name}</h4>
                <p className={`${theme.primary} font-black text-base mt-1`}>{formatCurrency(product.price)}</p>
              </div>
            </div>

            {/* Size Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {availableSizes.map(size => {
                const sizeStock = stock[size] !== undefined ? stock[size] : 0;
                const out = sizeStock <= 0;
                const low = sizeStock > 0 && sizeStock <= 3;
                return (
                  <button
                    key={size}
                    disabled={isAdding || out}
                    onClick={e => { handleSizeAdd(e, size); setIsModalOpen(false); }}
                    className={`relative h-12 rounded-2xl font-bold border-2 text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${out
                      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                      : `border-gray-200 text-gray-700 ${isBaby ? "hover:border-pink-600 hover:bg-pink-50 hover:text-pink-700" : "hover:border-teal-700 hover:bg-teal-50 hover:text-teal-900"}`
                      }`}
                  >
                    {size}
                    {out && <span className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="block w-full h-px bg-gray-300 rotate-45" /></span>}
                    {low && !out && (
                      <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full border border-white">
                        Còn {sizeStock}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
              🚚 Giao hàng toàn quốc miễn phí
            </p>
          </div>
        </div>
      )}
    </>
  );
}
