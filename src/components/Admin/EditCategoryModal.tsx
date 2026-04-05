"use client";

import { Pencil, X, Loader2, Save } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateCategory } from "@/app/admin/actions";
import { useToast } from "./ToastProvider";

interface EditCategoryModalProps {
  id: string;
  initialName: string;
}

export default function EditCategoryModal({ id, initialName }: EditCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(initialName);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t);
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);

    startTransition(async () => {
      try {
        const result = await updateCategory(id, formData);
        if (result?.success) {
          showToast("Cập nhật danh mục thành công!");
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Update Error:", error);
        alert("Lỗi khi cập nhật danh mục!");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 text-teal-800/40 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer group/edit-cat"
        title="Sửa tên danh mục"
      >
        <Pencil className="w-5 h-5 transition-transform group-hover/edit-cat:rotate-12" />
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] animate-in fade-in duration-300 cursor-pointer"
            onClick={() => !isPending && setIsOpen(false)}
          />
          
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Pencil className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-teal-900">Sửa Danh Mục</h3>
                  <p className="text-xs text-teal-800/40 font-bold uppercase tracking-widest mt-0.5">Cập nhật tên hiển thị</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="p-2 text-teal-800/40 hover:text-teal-900 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-teal-800/40 uppercase tracking-[0.2em] mb-3 px-1">
                  Tên danh mục mới
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  disabled={isPending}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 rounded-2xl outline-none transition-all text-teal-900 font-bold placeholder:text-teal-800/30 text-lg disabled:opacity-50"
                  placeholder="Ví dụ: Đồ bộ lụa, Đồ lót..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="flex-1 px-6 py-4 text-teal-800/60 hover:text-teal-900 font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending || name === initialName}
                  className="flex-[1.5] flex items-center justify-center gap-3 bg-blue-600 text-white rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:translate-y-0 disabled:shadow-none cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
