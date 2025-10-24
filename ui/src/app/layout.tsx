import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppContextProvider } from "@/app/context/useAppContext";
import Navigation from "@/app/components/Navigation";
import HistoryToolbar from "@/app/components/HistoryToolbar";

import './globals.css'

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
        <AppContextProvider>
          <HistoryToolbar/>
          <div className="w-full">
            <Navigation/>
            {children}  
          </div>
        </AppContextProvider>
      </body>
    </html>
  );
}
