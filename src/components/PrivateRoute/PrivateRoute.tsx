"use client";

import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/components/context/AuthContext";
import publicRoutes from "@/constants/routes";

interface PrivateRouteProps {
  children: React.ReactNode;
  locale: string;
}

const PrivateRoute = ({ children, locale }: PrivateRouteProps) => {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname() || "/";

  const segments = pathname.split("/").filter(Boolean);
  const normalizedPath =
    segments.length > 1 ? "/" + segments.slice(1).join("/") : "/";

  const isPublicRoute = publicRoutes.includes(normalizedPath);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace(`/${locale}/login`);
    } else if (isAuthenticated && isPublicRoute) {
      router.replace(`/${locale}`);
    }
  }, [isAuthenticated, isPublicRoute, normalizedPath, locale, router]);

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  if (isAuthenticated && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
