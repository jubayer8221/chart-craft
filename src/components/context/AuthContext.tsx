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

"use client";

import { createContext, useState, useEffect } from "react";
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
  const router = useRouter();

  // Get token from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Check if there's a stored path to redirect to, otherwise go to homepage
    const redirectTo = sessionStorage.getItem("redirectPath") || `/${locale}`;
    sessionStorage.removeItem("redirectPath"); // Clear the stored path after redirecting
    router.push(redirectTo); // Redirect to the stored path or homepage
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push(`/${locale}/login`);
  };

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
