"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function useGoogleTranslate() {
  const pathname = usePathname();

  useEffect(() => {
    const initTranslate = () => {
      if (typeof window !== "undefined" && window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
      }
    };

    const existingScript = document.querySelector("#google-translate-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      window.googleTranslateElementInit = initTranslate;
      document.body.appendChild(script);
    } else {
      initTranslate(); // Already loaded
    }

    // Delay helps when navigating too fast
    const timeout = setTimeout(() => initTranslate(), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);
}
