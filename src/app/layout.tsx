"use client";
import React, { use } from "react";
import "./globals.css";

interface LocaleLayoutProps {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}

export default function LocaleLayout({ params, children }: LocaleLayoutProps) {
  const { lang } = use(params); // unwrap Promise

  const rawLang = lang || "en";
  const locale = rawLang.toLowerCase();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
