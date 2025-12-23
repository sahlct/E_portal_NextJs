import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { Quicksand, Noto_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "react-hot-toast";
import Analytics from "./analytics";

/* ---------- Fonts ---------- */
const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-notosans",
  weight: ["300", "400", "500", "600", "700"],
});

/* ---------- Metadata ---------- */
export const metadata: Metadata = {
  title: "EA Portel",
  description: "Premium electronics, laptops, accessories, and more",
  generator: "Sahal",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

/* ---------- Root Layout ---------- */
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
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // IMPORTANT: disable auto page_view
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              send_page_view: false
            });
          `}
        </Script>
      </head>

      <body className="bg-background text-foreground font-quicksand">
        {/* SPA page view tracking */}
        <Analytics />

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
