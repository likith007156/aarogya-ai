import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "../globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aarogya AI — Dev Test Dashboard",
  description: "Internal developer test dashboard for Aarogya AI",
  robots: "noindex, nofollow",
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistMono.variable}`}>
      <body className="bg-[#0a0a0f] text-white antialiased" style={{ background: '#0a0a0f' }}>
        {children}
      </body>
    </html>
  );
}
