"use client";

import { Suspense } from "react";
// import Header from "@/components/header";
// import Footer from "@/components/footer";
import Loader from "@/components/loader";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loader/>}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </Suspense>
  );
}
