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

  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (typeof window === "undefined") return; // Skip on server-side

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isPublicRoute) {
      router.replace("/");
    }
  }, [isAuthenticated, isPublicRoute, pathname, router]);

  if (!isAuthenticated && !isPublicRoute) {
    return null; // Prevent rendering protected content
  }

  if (isAuthenticated && isPublicRoute) {
    return null; // Prevent rendering public routes for authenticated users
  }

  return <>{children}</>;
};

export default PrivateRoute;
