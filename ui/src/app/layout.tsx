import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'

import Navigation from "@/app/components/Navigation";
import HistoryToolbar from "@/app/components/HistoryToolbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSP Automated Timetable Generator"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-screen w-full antialiased`}>
        <HistoryToolbar/>
        <div className="w-full">
          <Navigation/>
          {children}  
        </div>
      </body>
    </html>
  );
}
