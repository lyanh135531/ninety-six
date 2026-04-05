import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ninety-six.vercel.app"),
  title: "Ninety Six - Đồ Ngủ Cao Cấp",
  description: "Trang phục ngủ cao cấp mang lại sự thoải mái tuyệt đối cho phái đẹp. Chất liệu lụa satin và cotton organic mềm mại.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Ninety Six - Đồ Ngủ Cao Cấp",
    description: "Trang phục ngủ cao cấp - Ninety Six mang lại sự thoải mái tuyệt đối cho phái đẹp.",
    url: "https://ninety-six.vercel.app",
    siteName: "Ninety Six Store",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
