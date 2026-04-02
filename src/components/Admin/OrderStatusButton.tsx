"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "./ToastProvider";
import { useRouter } from "next/navigation";

const colorMap: Record<string, string> = {
  PROCESSING:
    "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100",
  COMPLETED:
    "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-100",
  CANCELLED:
    "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-100",
};

const labelMap: Record<string, string> = {
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

interface OrderStatusButtonProps {
  action: () => Promise<unknown>;
  newStatus: string;
  icon: React.ReactNode;
}

export default function OrderStatusButton({ action, newStatus, icon }: OrderStatusButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await action();
        showToast(`Đã chuyển trạng thái: ${labelMap[newStatus] ?? newStatus}`);
        router.refresh();
      } catch {
        showToast("Cập nhật thất bại!", "error");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`w-full py-3 px-4 ${colorMap[newStatus] ?? "bg-gray-50 text-gray-600"} rounded-2xl font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0`}
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {labelMap[newStatus] ?? newStatus}
    </button>
  );
}
