"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createCategoryAction } from "@/app/admin/actions";
import { useToast } from "@/components/Admin/ToastProvider";

const initialState = { success: false, error: null as string | null };

export default function AddCategoryForm() {
  const { showToast } = useToast();
  const [state, formAction, isPending] = useActionState(createCategoryAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      showToast("Tạo danh mục thành công!");
      formRef.current?.reset();
    } else if (state.error) {
      showToast(state.error, "error");
    }
  }, [state, showToast]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">
          Tên danh mục
        </label>
        <input
          name="name"
          type="text"
          required
          disabled={isPending}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 focus:border-teal-700/30 focus:bg-white focus:ring-4 focus:ring-teal-700/5 rounded-xl outline-none transition-all text-gray-900 font-bold placeholder:text-gray-300 text-sm disabled:opacity-50"
          placeholder="Ví dụ: Đồ ngủ cao cấp..."
        />
        {state.error && (
          <p className="text-red-500 text-[10px] mt-2 px-1 font-bold italic uppercase tracking-wider">{state.error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2.5 w-full bg-teal-700 text-white rounded-xl px-6 py-3.5 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-teal-700/10 hover:bg-teal-800 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <><Plus className="w-4 h-4" /> Xác nhận Tạo</>
        )}
      </button>
    </form>
  );
}
