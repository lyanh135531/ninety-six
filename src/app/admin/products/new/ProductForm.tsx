"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, Star, ChevronDown } from "lucide-react";
import Image from "next/image";
import { createProduct, updateProduct } from "../../actions";

interface ProductFormProps {
  categories: { id: string, name: string }[];
  initialData?: {
    name: string;
    price: number;
    categoryId: string;
    description?: string | null;
    imageUrl?: string | null;
    isFeatured?: boolean;
    sizes?: string | null;
    stockBySizes?: string | null;
  };
  id?: string;
}

export default function ProductForm({ categories, initialData, id }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(initialData?.price ? initialData.price.toLocaleString("vi-VN") : "");
  
  // Size Management
  const [sizes, setSizes] = useState(initialData?.sizes || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  
  // Custom Select States
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.categoryId || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  
  // Stock Management
  const [stockBySizes, setStockBySizes] = useState<Record<string, number | "">>(() => {
    try {
      return initialData?.stockBySizes ? JSON.parse(initialData.stockBySizes) : {};
    } catch {
      return {};
    }
  });

  const [totalStock, setTotalStock] = useState<number | "">(() => {
    if (initialData?.stockBySizes) {
      try {
        const stock = JSON.parse(initialData.stockBySizes);
        if (stock["_total"] !== undefined) return stock["_total"];
        const sum = Object.values(stock).reduce((a: any, b: any) => a + (b || 0), 0) as number;
        return sum || "";
      } catch {
        return "";
      }
    }
    return "";
  });

  const QUICK_SIZES = ["S", "M", "L", "XL", "2XL", "Free size"];

  // Re-check warning when sizes or description changes
  useEffect(() => {
    const desc = description.toLowerCase();
    const mentionsSize = desc.includes('size') || desc.includes('kích cỡ') || (/\bs\b|\bm\b|\bl\b|\bxl\b|\b2xl\b/g.test(desc));
    const hasConfiguredSizes = sizes.trim().length > 0;
    setShowSizeWarning(mentionsSize && !hasConfiguredSizes);
  }, [description, sizes]);

  const toggleSize = (size: string) => {
    const currentSizes = sizes ? sizes.split(",").map(s => s.trim()) : [];
    let newSizes;
    if (currentSizes.includes(size)) {
      newSizes = currentSizes.filter(s => s !== size);
    } else {
      newSizes = [...currentSizes, size];
    }
    const updatedSizes = newSizes.join(", ");
    setSizes(updatedSizes);
    
    // Clean up stock for removed sizes
    const newStock = { ...stockBySizes };
    Object.keys(newStock).forEach(s => {
      if (!newSizes.includes(s) && s !== "_total") delete newStock[s];
    });
    setStockBySizes(newStock);
  };

  const handleStockChange = (size: string, value: string) => {
    if (value === "") {
      setStockBySizes(prev => ({ ...prev, [size]: "" }));
      return;
    }
    const numValue = parseInt(value);
    setStockBySizes(prev => ({ ...prev, [size]: isNaN(numValue) ? "" : numValue }));
  };

  const handleTotalStockChange = (value: string) => {
    if (value === "") {
      setTotalStock("");
      return;
    }
    const numValue = parseInt(value);
    setTotalStock(isNaN(numValue) ? "" : numValue);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setDisplayPrice(value ? parseInt(value).toLocaleString("vi-VN") : "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fetch("/api/cloudinary-sign", { method: "POST" });
      const { signature, timestamp, cloud_name, api_key, folder } = await res.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();
      if (data.secure_url) setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Lỗi upload ảnh. Vui lòng kiểm tra kết nối Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form
        action={async (formData) => {
          setSubmitting(true);
          const rawPrice = displayPrice.replace(/\D/g, "");
          formData.set("price", rawPrice);
          formData.append("imageUrl", imageUrl);
          formData.append("sizes", sizes);
          
          // Prepare stock data: either by size or a single total
          const currentSizes = sizes ? sizes.split(",").map(s => s.trim()).filter(Boolean) : [];
          let stockData: Record<string, number> = {};
          
          if (currentSizes.length > 0) {
            currentSizes.forEach(s => {
              stockData[s] = Number(stockBySizes[s]) || 0;
            });
          } else {
            stockData["_total"] = Number(totalStock) || 0;
          }
          
          formData.append("stockBySizes", JSON.stringify(stockData));
          
          if (id) {
            await updateProduct(id, formData);
          } else {
            await createProduct(formData);
          }
        }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
          <div className="p-3 bg-teal-700 text-white rounded-2xl shadow-sm">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{id ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}</h2>
            <p className="text-sm text-gray-500">{id ? "Cập nhật lại thông tin sản phẩm đã có." : "Tạo mẫu sản phẩm mới cho cửa hàng."}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <label className="block">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block px-1">Tên Sản Phẩm</span>
              <input 
                name="name" 
                type="text" 
                defaultValue={initialData?.name}
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-teal-700 focus:ring-4 focus:ring-teal-700/5 rounded-2xl outline-none transition-all text-gray-900" 
                placeholder="Ví dụ: Bộ đồ ngủ lụa Satin cao cấp..." 
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block px-1">Giá Bán (VNĐ)</span>
              <div className="relative">
                <input 
                  type="text" 
                  value={displayPrice}
                  onChange={handlePriceChange}
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-teal-700 focus:ring-4 focus:ring-teal-700/5 rounded-2xl outline-none transition-all text-gray-900 font-bold pr-12" 
                  placeholder="0" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">VNĐ</span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="block">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block px-1">Danh Mục</span>
              <div className="relative">
                {/* Hidden input to pass value to FormData */}
                <input type="hidden" name="categoryId" value={selectedCategoryId || ""} required />
                
                <button
                   type="button"
                   onClick={() => setIsSelectOpen(!isSelectOpen)}
                   className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 border transition-all rounded-2xl outline-none cursor-pointer ${
                     isSelectOpen ? "bg-white border-teal-700 ring-4 ring-teal-700/5 shadow-sm" : "border-transparent hover:bg-gray-100"
                   }`}
                >
                   <span className={`font-medium ${selectedCategoryId ? "text-gray-900" : "text-gray-300"}`}>
                     {categories.find(c => c.id === selectedCategoryId)?.name || "-- Chọn Danh Mục --"}
                   </span>
                   <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isSelectOpen ? "rotate-180 text-teal-700" : ""}`} />
                </button>
 
                {isSelectOpen && (
                   <>
                     {/* Toàn bộ màn hình được bao phủ bởi lớp nền tàng hình để bắt sự kiện click ra ngoài */}
                     <div 
                       className="fixed inset-0 z-[60] bg-transparent cursor-default" 
                       onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         setIsSelectOpen(false);
                       }}
                     />
                     
                     {/* Bảng chọn Absolute luôn nằm trên Backdrop */}
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-3xl shadow-2xl p-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                       <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                         {categories.map((cat) => (
                           <button
                             key={cat.id}
                             type="button"
                             onClick={() => {
                               setSelectedCategoryId(cat.id);
                               // Simple immediate close, no delay needed if the label issue is fixed
                               setIsSelectOpen(false);
                             }}
                             className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all mb-1 last:mb-0 text-left ${
                               selectedCategoryId === cat.id 
                                 ? "bg-teal-50 text-teal-700 font-bold" 
                                 : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                             }`}
                           >
                             <span className="text-sm">{cat.name}</span>
                             {selectedCategoryId === cat.id && <Star className="w-4 h-4 fill-teal-700" />}
                           </button>
                         ))}
                         {categories.length === 0 && (
                           <p className="p-4 text-center text-xs text-gray-400 italic">Vui lòng tạo danh mục trước</p>
                         )}
                       </div>
                     </div>
                   </>
                )}
               </div>
            </div>
            <div className="block">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block px-1">Hình Ảnh</span>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-all">
                  {imageUrl ? (
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-200" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-teal-700" />
                    </div>
                  )}
                </div>
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-50 text-teal-700 rounded-2xl hover:bg-teal-100 cursor-pointer font-bold text-sm transition-all">
                  <UploadCloud className="w-5 h-5" /> {imageUrl ? "Thay đổi ảnh" : "Tải ảnh sản phẩm"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Kích Thước (Size)</span>
            <div className="flex flex-wrap gap-2">
              {QUICK_SIZES.map(size => {
                const isActive = sizes.split(",").map(s => s.trim()).includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-teal-700 border-teal-700 text-white shadow-md shadow-teal-100" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-teal-700 hover:text-teal-700"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-teal-700" />
              <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Quản lý Tồn kho</span>
            </div>
            
            {sizes ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {sizes.split(",").map(s => s.trim()).filter(Boolean).map(size => (
                  <div key={size} className="space-y-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase ml-1">Size {size}</span>
                    <input 
                      type="number" 
                      min="0"
                      value={stockBySizes[size] ?? ""}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="w-full px-4 py-3 bg-white border border-transparent focus:border-teal-700 rounded-xl outline-none transition-all text-gray-900 font-bold" 
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-xs space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase ml-1">Số lượng tồn kho tổng</span>
                <input 
                  type="number" 
                  min="0"
                  value={totalStock ?? ""}
                  onChange={(e) => handleTotalStockChange(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-full px-4 py-3 bg-white border border-transparent focus:border-teal-700 rounded-xl outline-none transition-all text-gray-900 font-bold" 
                  placeholder="0" 
                />
              </div>
            )}
            
            <p className="text-[10px] text-gray-400 italic">
              * Tồn kho sẽ tự động giảm khi có đơn hàng thành công cho size tương ứng.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block px-1">Mô tả sản phẩm</span>
              <textarea 
                name="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4} 
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-teal-700 focus:ring-4 focus:ring-teal-700/5 rounded-2xl outline-none transition-all text-gray-900 cursor-text" 
                placeholder="Thông tin chi tiết về chất liệu, kích thước, ưu điểm..."
              ></textarea>
            </label>
            
            {showSizeWarning && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 animate-in fade-in slide-in-from-top-1">
                <div className="p-2 bg-amber-200 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-700 text-amber-700" />
                </div>
                <div className="text-sm">
                  <p className="font-bold uppercase text-[10px] tracking-wider mb-0.5">Lưu ý Dữ liệu</p>
                  <p>Mô tả có nhắc đến <b>kích cỡ (size)</b>, nhưng bạn chưa chọn size ở trên. Khách hàng sẽ không thể chọn size khi mua!</p>
                </div>
              </div>
            )}
          </div>

          <label className="flex items-center gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 cursor-pointer group">
            <input 
              name="isFeatured" 
              type="checkbox" 
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 accent-orange-500 rounded-lg cursor-pointer" 
            />
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500 fill-orange-500 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm font-bold text-gray-900">Sản phẩm nổi bật</p>
                <p className="text-xs text-gray-500 mt-0.5">Hiển thị sản phẩm này tại trang chủ để thu hút khách hàng.</p>
              </div>
            </div>
          </label>
        </div>

        <div className="p-8 bg-gray-50/50 flex justify-end gap-4 border-t border-gray-50">
          <button 
            type="button" 
            onClick={() => window.history.back()} 
            className="px-8 py-3.5 text-gray-500 hover:text-gray-900 font-bold transition cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button 
            type="submit" 
            disabled={submitting || uploading} 
            className="px-10 py-3.5 bg-teal-700 text-white rounded-2xl hover:bg-teal-800 font-bold shadow-xl shadow-teal-700/20 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {id ? "Xác nhận Cập nhật" : "Xác nhận Thêm Sản phẩm"}
          </button>
        </div>
      </form>
    </div>

  )
}
