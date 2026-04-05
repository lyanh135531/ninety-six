"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/Admin/ToastProvider";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Reset scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ToastProvider>
      <Header />
      <main className="min-h-screen bg-white pt-16 md:pt-[68px]">
        {children}
      </main>
      <Footer />
    </ToastProvider>
  );
}
