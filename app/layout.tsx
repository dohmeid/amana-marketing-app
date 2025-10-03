import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/src/components/common/navbar";
import { Footer } from "@/src/components/common/footer";
import { MarketingDataProvider } from "@/src/context/marketing-dataprovider";
import { AppContent } from "../src/components/common/app-content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amana Marketing Dashboard",
  description:
    "Comprehensive marketing analytics and insights for data-driven decision making",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
