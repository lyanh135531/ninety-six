"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useToast, ToastType } from "./ToastProvider";

const TOAST_MAP: Record<string, { message: string; type: ToastType }> = {
  created: { message: "Tạo mới thành công!", type: "success" },
  updated: { message: "Cập nhật thành công!", type: "success" },
};

export default function UrlToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const shown = useRef(false);

  useEffect(() => {
    const key = searchParams.get("toast");
    if (!key || shown.current) return;
    const toast = TOAST_MAP[key];
    if (!toast) return;
    shown.current = true;
    showToast(toast.message, toast.type);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newUrl, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}
