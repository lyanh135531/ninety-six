"use client";

import { useState } from "react";
import { UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { createProduct } from "../../actions";
import Image from "next/image";

export default function ProductForm({ categories }: { categories: { id: string, name: string }[] }) {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get signature from API
      const res = await fetch("/api/cloudinary-sign", { method: "POST" });
      const { signature, timestamp, cloud_name, api_key } = await res.json();

      // Form data for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "mom-baby-store");

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();
      if (data.secure_url) setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Lỗi upload ảnh.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      action={async (formData) => {
        setSubmitting(true);
        formData.append("imageUrl", imageUrl);
        await createProduct(formData);
      }}
      className="max-w-3xl border border-gray-100 bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-gray-700 font-medium mb-1 block">Tên Sản Phẩm</span>
          <input name="name" type="text" required className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-teal-700" placeholder="Bộ đồ ngủ hoa nhí..." />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium mb-1 block">Giá Bán (VNĐ)</span>
          <input name="price" type="number" min="0" required className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-teal-700" placeholder="250000" />
        </label>
      </div>

      <label className="block">
        <span className="text-gray-700 font-medium mb-1 block">Danh Mục</span>
        <select name="categoryId" required className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-teal-700">
          <option value="">-- Chọn Danh Mục --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium mb-1 block">Mô tả</span>
        <textarea name="description" rows={4} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-teal-700" placeholder="Thông tin chi tiết về chất liệu, size..."></textarea>
      </label>

      {/* Upload Ảnh */}
      <div className="block">
        <span className="text-gray-700 font-medium mb-1 block">Hình Ảnh Sản Phẩm</span>
        <div className="mt-2 flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-300" />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
              </div>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer font-medium text-gray-700 transition">
              <UploadCloud className="w-5 h-5" /> Tải Yêu Cầu Ảnh Mới
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <p className="mt-2 text-xs text-gray-400">Khuyến nghị ảnh vuông tỉ lệ 1:1, định dạng JPG/PNG.</p>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 my-2" />
      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => window.history.back()} className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">
          Hủy Bỏ
        </button>
        <button type="submit" disabled={submitting || uploading} className="px-6 py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-700 font-medium transition disabled:opacity-50 flex items-center gap-2">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Thêm Sản Phẩm Mới
        </button>
      </div>
    </form>
  )
}
