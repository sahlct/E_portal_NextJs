"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", gaId, {
        page_path: query ? `${pathname}?${query}` : pathname,
      });
    }
  }, [pathname, query]);

  return null;
}
