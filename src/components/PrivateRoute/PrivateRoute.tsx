"use client";

import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/components/context/AuthContext";
import publicRoutes from "@/constants/routes";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  // Normalize path
  const normalizedPath = (() => {
    if (!pathname) return "/";
    const segments = pathname.split("/").filter(Boolean);
    return segments.length > 1 ? "/" + segments.slice(1).join("/") : "/";
  })();

  const isPublicRoute = publicRoutes.includes(normalizedPath);

  useEffect(() => {
    if (typeof window === "undefined") return; // Safe to check inside useEffect

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isPublicRoute) {
      router.replace("/");
    }
  }, [isAuthenticated, isPublicRoute, normalizedPath, router]);

  // Conditionally render based on auth and route status
  if (typeof window === "undefined") return null;

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  if (isAuthenticated && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
