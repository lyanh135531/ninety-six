import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/Admin/ToastProvider";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <Header />
      <main className="min-h-screen bg-white">
        {children}
      </main>
      <Footer />
    </ToastProvider>
  );
}
