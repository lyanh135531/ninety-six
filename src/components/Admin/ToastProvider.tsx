"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

const config = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    bar: "bg-emerald-500",
    border: "border-emerald-100",
    bg: "bg-white",
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    bar: "bg-red-500",
    border: "border-red-100",
    bg: "bg-white",
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    bar: "bg-blue-500",
    border: "border-blue-100",
    bg: "bg-white",
  },
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[300] flex flex-col-reverse gap-3 pointer-events-none"
      >
        {toasts.map((toast) => {
          const c = config[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3.5
                rounded-2xl border shadow-2xl shadow-gray-900/10
                min-w-[280px] max-w-[400px] overflow-hidden relative
                animate-in slide-in-from-right-4 fade-in duration-300
                ${c.bg} ${c.border}`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.bar} rounded-l-2xl`} />
              {c.icon}
              <p className="text-sm font-bold text-gray-800 flex-1">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="p-1 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
