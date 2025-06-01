// "use client";

// import { createContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (token: string) => void;
//   logout: () => void;
// }

// interface AuthProviderProps {
//   children: React.ReactNode;
//   locale: string;
// }

// export const AuthContext = createContext<AuthContextType>({
//   token: null,
//   isAuthenticated: false,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children, locale }: AuthProviderProps) => {
//   const [token, setToken] = useState<string | null>(null);
//   const router = useRouter();

//   // Get token from localStorage on component mount
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedToken = localStorage.getItem("token");
//       if (storedToken) {
//         setToken(storedToken);
//       }
//     }
//   }, []);

//   const login = (newToken: string) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//     router.push(`/${locale}`); // Redirect after login, preserving locale
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     router.push(`/${locale}/login`); // Redirect to login page, preserving locale
//   };

//   const value = {
//     token,
//     isAuthenticated: !!token,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// "use client";

// import { createContext, useState, useEffect, Context } from "react";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (token: string) => void;
//   logout: () => void;
// }

// interface AuthProviderProps {
//   children: React.ReactNode;
//   locale: string;
// }

// export const AuthContext = createContext<AuthContextType>({
//   token: null,
//   isAuthenticated: false,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children, locale }: AuthProviderProps) => {
//   const [token, setToken] = useState<string | null>(null);
//   const router = useRouter();
//   const { isAuthenticated } = useContext(AuthContext);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       // Store attempted path so you can redirect after login if needed
//       sessionStorage.setItem("redirectPath", window.location.pathname);
//       router.push(`/${locale}/login`);
//     }
//   }, [isAuthenticated, locale, router]);

//   // Get token from localStorage on component mount
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedToken = localStorage.getItem("token");
//       if (storedToken) {
//         setToken(storedToken);
//       }
//     }
//   }, []);

//   const login = (newToken: string) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);

//     // Check if there's a stored path to redirect to, otherwise go to homepage
//     const redirectTo = sessionStorage.getItem("redirectPath") || `/${locale}`;
//     sessionStorage.removeItem("redirectPath"); // Clear the stored path after redirecting
//     router.push(redirectTo); // Redirect to the stored path or homepage
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     router.push(`/${locale}/login`);
//   };
//   if (!isAuthenticated) {
//     // You can show a loading spinner or null while redirecting
//     return null;
//   }

//   const value = {
//     token,
//     isAuthenticated: !!token,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
// function useContext(AuthContext: Context<AuthContextType>): { isAuthenticated: any; } {
//   throw new Error("Function not implemented.");
// }

"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
  locale: string;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children, locale }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const redirectTo =
      sessionStorage.getItem("redirectPath") || `/${locale}/login`;
    sessionStorage.removeItem("redirectPath");
    router.push(redirectTo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push(`/${locale}/login`);
  };

  // Show CSS spinner while loading, centered in viewport
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
