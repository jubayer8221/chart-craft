"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LOCALES, Locale } from "../../../config";
// import { FiGlobe } from "react-icons/fi";
import { IoLanguage } from "react-icons/io5";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

const localeLabels: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
  es: "Español",
  ar: "العربية",
};

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (locale: Locale) => {
    setOpen(false);

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${locale}`);
      return;
    }
    segments[0] = locale;
    router.push("/" + segments.join("/"));
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger icon button */}
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Select language"
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
      >
        {/* <FiGlobe size={24} /> */}
        <IoLanguage size={18} />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50">
          <ul className="py-1">
            {LOCALES.map((locale) => (
              <li key={locale}>
                <button
                  onClick={() => handleSelect(locale)}
                  className={`block w-full text-left px-4 py-2 text-sm border-none ${
                    locale === currentLocale
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {localeLabels[locale]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
