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
    <form ref={formRef} action={formAction} className="flex flex-col gap-8">
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">
          Tên danh mục
        </label>
        <input
          name="name"
          type="text"
          required
          disabled={isPending}
          className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-700/5 rounded-2xl outline-none transition-all text-gray-900 font-bold placeholder:text-gray-300 text-lg disabled:opacity-50"
          placeholder="Ví dụ: Đồ ngủ cao cấp..."
        />
        {state.error && (
          <p className="text-red-500 text-xs mt-2 px-1 font-bold">{state.error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-3 w-full bg-teal-700 text-white rounded-2xl px-6 py-5 font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-200 hover:bg-teal-800 hover:-translate-y-1 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <><Plus className="w-5 h-5" /> Xác nhận Tạo</>
        )}
      </button>
    </form>
  );
}
