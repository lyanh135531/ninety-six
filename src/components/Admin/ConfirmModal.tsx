"use client";

import { AlertTriangle, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  isPending?: boolean;
  color?: "teal" | "orange" | "blue" | "green" | "rose";
  icon?: React.ReactNode;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Xác nhận",
  isPending,
  color = "rose",
  icon
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  const colorClasses = {
    teal: "bg-teal-50 text-teal-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    rose: "bg-rose-50 text-rose-600",
  }[color];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t);
  }, []);

  // Chặn cuộn trang khi mở modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Lớp nền mờ (Backdrop) */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] animate-in fade-in duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Nội dung Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 ${colorClasses} rounded-2xl flex items-center justify-center`}>
              {icon || <AlertTriangle className="w-6 h-6" />}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 leading-relaxed text-sm">
            {message}
          </p>
        </div>

        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm cursor-pointer"
          >
            Hủy bỏ
          </button>
           <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 px-4 py-3 ${color === "rose" ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200" : "bg-teal-700 hover:bg-teal-800 shadow-teal-100"} text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer`}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
