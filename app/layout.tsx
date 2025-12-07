import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "react-hot-toast";
import { Quicksand, Noto_Sans } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EA Portal ",
  description: "Premium electronics, laptops, accessories, and more",
  generator: "Sahal",
};

// Quicksand
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

// Noto Sans
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-notosans",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${quicksand.variable} ${notoSans.variable}`}
    >
      <body className="bg-background text-foreground font-quicksand">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <CartProvider>
              <Toaster position="bottom-right" />
              <main className="min-h-screen">{children}</main>
            </CartProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
