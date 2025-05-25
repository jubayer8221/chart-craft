"use client";

import React, { ReactNode, use } from "react";
import { Locale, LOCALES } from "../../../config";
// import LanguageSwitcher from "../../components/LanguageSwitcher";
import Header from "@/components/Navbar/Header";
import LeftSide from "@/components/Navbar/LeftSide";
import MarginWidthWrapper from "@/components/Navbar/marginWithWrapper";
import PageWrapper from "@/components/Navbar/PageWrapper";
import HeaderMobile from "@/components/Navbar/HeaderMobile";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import ThemeProvider from "../theme-provider";
import { AuthProvider } from "@/components/context/AuthContext";
// import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import publicRoutes from "@/constants/routes";
import { usePathname } from "next/navigation";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = use(params); // unwrap Promise

  const rawLang = lang || "en";
  const locale: Locale = LOCALES.includes(rawLang as Locale)
    ? (rawLang as Locale)
    : "en";

  const pathname = usePathname() || "/";
  const pathSegments = pathname.split("/").filter(Boolean); // ['en', 'login']
  // Remove locale prefix:
  const pathWithoutLocale = pathSegments.slice(1).join("/") || "";
  const normalizedPath = pathWithoutLocale ? `/${pathWithoutLocale}` : "/";
  const isPublicRoute = publicRoutes.includes(normalizedPath);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body className="bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#ffffffcf] antialiased max-w-screen">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider store={store}>
              {/* <PrivateRoute> */}
              {isPublicRoute ? (
                <PageWrapper>
                  <header style={{ padding: 10, textAlign: "right" }}>
                    {/* <LanguageSwitcher currentLocale={locale} /> */}
                  </header>
                  {children}
                </PageWrapper>
              ) : (
                <div className="flex min-h-screen">
                  <div className="print:hidden min-h-screen">
                    <LeftSide />
                  </div>
                  <main className="flex-1 max-w-screen">
                    <MarginWidthWrapper params={{ lang: locale }}>
                      <div className="print:hidden sticky top-0 z-50 justify-between items-center">
                        <Header params={{ lang: locale }}>
                          {/* You can add children here if needed */}
                          {/* Passing an empty fragment as children to satisfy the required prop */}
                          <></>
                        </Header>
                        {/* <LanguageSwitcher currentLocale={locale} /> */}
                      </div>
                      <div className="print:hidden">
                        <HeaderMobile />
                      </div>
                      <PageWrapper>{children}</PageWrapper>
                    </MarginWidthWrapper>
                  </main>
                </div>
              )}
              {/* </PrivateRoute> */}
            </Provider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
