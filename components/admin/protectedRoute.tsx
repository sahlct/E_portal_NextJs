"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, removeToken } from "@/lib/api/auth";
import Loader from "@/components/loader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // ✅ Verify JWT Token via API
  const verifyToken = async () => {
    const token = getToken();

    if (!token) {
      await new Promise((res) => setTimeout(res, 200));
      const retryToken = getToken();
      if (!retryToken) {
        removeToken();
        router.replace("/admin/auth");
        return false;
      }
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        return true;
      } else {
        removeToken();
        router.replace("/admin/auth");
        return false;
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      removeToken();
      router.replace("/admin/auth");
      return false;
    }
  };

  // ✅ Recheck token on every route change
  useEffect(() => {
    const checkAuth = async () => {
      setChecking(true);
      const valid = await verifyToken();
      setIsAuthorized(valid);
      setChecking(false);
    };

    checkAuth();
  }, [pathname]);

  // ✅ Show loader during token validation
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <Loader />
      </div>
    );
  }

  // ✅ Render children only if authorized
  return isAuthorized ? <>{children}</> : null;
}
