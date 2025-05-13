"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Navbar/Header";
import LeftSide from "@/components/Navbar/LeftSide";
import MarginWidthWrapper from "@/components/Navbar/marginWithWrapper";
import PageWrapper from "@/components/Navbar/PageWrapper";
import HeaderMobile from "@/components/Navbar/HeaderMobile";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import ThemeProvider from "./theme-provider";
import { AuthProvider } from "@/components/context/AuthContext";
import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import publicRoutes from "@/constants/routes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#ffffffcf]`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider store={store}>
              <PrivateRoute>
                {isPublicRoute ? (
                  <PageWrapper>{children}</PageWrapper>
                ) : (
                  <div className="flex">
                    <div className="print:hidden">
                      <LeftSide />
                    </div>
                    <main className="flex-1">
                      <MarginWidthWrapper>
                        <div className="print:hidden sticky top-0 z-50 bg-white">
                          <Header />
                        </div>
                        <div className="print:hidden">
                          <HeaderMobile />
                        </div>
                        <PageWrapper>{children}</PageWrapper>
                      </MarginWidthWrapper>
                    </main>
                  </div>
                )}
              </PrivateRoute>
            </Provider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
