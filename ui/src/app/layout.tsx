import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import Navigation from "@/app/components/Navigation";
import HistoryToolbar from "@/app/components/HistoryToolbar";
import { fetchSession } from "@/app/utils/api/server";
import { AppContextProvider } from "@/app/context/useAppContext";

import './globals.css';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["session"],
    queryFn: fetchSession
  });

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-screen w-full antialiased`}>
        <AppContextProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
              <HistoryToolbar/>
              <div className="absolute right-0 w-[calc(100%-18rem)] h-full">
                <Navigation/>
                {children}  
              </div>
          </HydrationBoundary>
        </AppContextProvider>
      </body>
    </html>
  );
}
