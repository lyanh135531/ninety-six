"use client";

import { useState, useTransition } from "react";
import { Loader2, Clock } from "lucide-react";
import { useToast } from "./ToastProvider";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

const colorMap: Record<string, string> = {
  PROCESSING:
    "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100",
  COMPLETED:
    "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-100",
  CANCELLED:
    "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-100",
};

const labelMap: Record<string, string> = {
  PENDING: "Chờ duyệt",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Hủy đơn",
};

const modalColorMap: Record<string, "teal" | "orange" | "blue" | "green" | "rose"> = {
  PENDING: "orange",
  PROCESSING: "blue",
  COMPLETED: "green",
  CANCELLED: "rose",
};

interface OrderStatusButtonProps {
  action: () => Promise<unknown>;
  newStatus: string;
  icon: React.ReactNode;
}

export default function OrderStatusButton({ action, newStatus, icon }: OrderStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await action();
        showToast(`Đã chuyển trạng thái: ${labelMap[newStatus] ?? newStatus}`);
        router.refresh();
        setIsOpen(false);
      } catch {
        showToast("Cập nhật thất bại!", "error");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={`min-w-[110px] py-2.5 px-4 ${colorMap[newStatus] ?? "bg-gray-50 text-gray-600"} rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 whitespace-nowrap border border-transparent hover:border-current/10`}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <div className="shrink-0">{icon}</div>}
        <span>{labelMap[newStatus] ?? newStatus}</span>
      </button>

      <ConfirmModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
        title="Xác nhận Trạng thái"
        message={
          <div className="flex flex-col gap-3">
            <p>Bạn có chắc chắn muốn chuyển đơn hàng sang trạng thái này không?</p>
            <div className={`w-fit px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${colorMap[newStatus] ?? "bg-gray-50 text-gray-600"}`}>
               {labelMap[newStatus] ?? newStatus}
            </div>
          </div>
        }
        confirmLabel="Xác nhận thay đổi"
        color={modalColorMap[newStatus] || "teal"}
        icon={icon}
      />
    </>
  );
}
