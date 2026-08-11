import type { Metadata } from "next";
import { headers } from "next/headers";
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

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
    title: "VideoHarvester — 把喜欢的视频，安稳地保存下来",
    description: "简单、清楚、只在本机运行的 Windows 视频保存工具。支持单个视频、YouTube 播放列表与 B站合集。",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      title: "VideoHarvester",
      description: "把喜欢的视频，安稳地保存下来。",
      type: "website",
      locale: "zh_CN",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "VideoHarvester 产品预览" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "VideoHarvester",
      description: "把喜欢的视频，安稳地保存下来。",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
