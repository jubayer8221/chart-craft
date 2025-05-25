"use client";

import React, { useState, useEffect } from "react";
import { IoLanguage } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Language {
  code: string;
  label: string;
}

const languages: Language[] = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
  { code: "es", label: "Spanish" },
];

const LanguageDropdown: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  // Extract current locale from URL path (default to 'en')
  const currentLocaleCode = pathname.split("/")[1] || "en";

  // Find label of current locale for display
  const currentLangLabel =
    languages.find((lang) => lang.code === currentLocaleCode)?.label ||
    "English";

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLangLabel);

  // Close dropdown & sync selected language on route change
  useEffect(() => {
    setIsOpen(false);
    const label =
      languages.find((lang) => lang.code === currentLocaleCode)?.label ||
      "English";
    setSelectedLanguage(label);
  }, [currentLocaleCode]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLanguage = (lang: Language) => {
    setIsOpen(false);

    const segments = pathname.split("/").filter(Boolean); // filter removes empty strings

    if (languages.some((l) => l.code === lang.code)) {
      if (segments.length === 0) {
        // Root path, add locale prefix
        router.push(`/${lang.code}`);
        return;
      }

      if (languages.some((l) => l.code === segments[0])) {
        // Replace existing locale segment
        segments[0] = lang.code;
      } else {
        // Prepend locale segment if missing
        segments.unshift(lang.code);
      }
    }

    const newPathname = "/" + segments.join("/");
    const query = searchParams ? `?${searchParams.toString()}` : "";
    router.push(newPathname + query);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <div
        className="shadow-lg bg-gray-100 w-full rounded-lg p-3 text-center flex items-center justify-between cursor-pointer hover:bg-gray-200"
        onClick={toggleDropdown}
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <IoLanguage />
          {selectedLanguage}
        </h2>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 max-h-60 overflow-auto">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => selectLanguage(lang)}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
