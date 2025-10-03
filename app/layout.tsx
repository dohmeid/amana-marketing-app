import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/src/components/navbar";
import { Footer } from "@/src/components/footer";
import { MarketingDataProvider } from "@/src/context/marketing-dataprovider";
import { AppContent } from "../src/components/app-content";
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
  title: "Amana Marketing Dashboard",
  description:
    "Comprehensive marketing analytics and insights for data-driven decision making",
  icons: {
    icon: "/favicon.png",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <MarketingDataProvider>
          <div className="flex flex-col transition-all duration-300 ease-in-out min-h-screen bg-gray-900 lg:flex-row">
            <Navbar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <AppContent>{children}</AppContent>
              <Footer />
            </main>
          </div>
        </MarketingDataProvider>
      </body>
    </html>
  );
}
