"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "./ToastProvider";

interface DeleteButtonProps {
  onDelete: () => Promise<unknown>;
  confirmMessage?: string;
  title?: string;
}

export default function DeleteButton({
  onDelete,
  confirmMessage = "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa dữ liệu này không?",
  title = "Xác nhận Xóa"
}: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await onDelete() as Record<string, unknown>;
        if (result?.success) {
          showToast("Xóa thành công!");
          router.refresh();
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Lỗi máy chủ khi xóa!");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center cursor-pointer group/delete"
        title="Xóa"
      >
        <Trash2 className="w-5 h-5 group-hover/delete:rotate-12 transition-transform" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
        title={title}
        message={confirmMessage}
      />
    </>
  );
}
