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
    title: "VideoHarvester — Save videos safely and locally",
    description: "A clear, local-first Windows video workflow for authorized downloads. Supports single videos, YouTube playlists, and Bilibili collections.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      title: "VideoHarvester",
      description: "A clear, local-first Windows video workflow for authorized downloads.",
      type: "website",
      locale: "en_US",
      alternateLocale: ["zh_CN"],
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "VideoHarvester product preview" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "VideoHarvester",
      description: "A clear, local-first Windows video workflow for authorized downloads.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
