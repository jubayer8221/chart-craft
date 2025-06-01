// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { LOCALES, Locale } from "../../../../../config";
// import { IoLanguage } from "react-icons/io5";

// interface LanguageSwitcherProps {
//   currentLocale: Locale;
// }

// const localeLabels: Record<Locale, string> = {
//   en: "English",
//   bn: "বাংলা",
//   es: "Español",
//   ar: "العربية",
// };

// export default function LanguageSwitcher({
//   currentLocale,
// }: LanguageSwitcherProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [selectedLocale, setSelectedLocale] = useState<Locale>(currentLocale);
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setSelectedLocale(currentLocale);
//   }, [currentLocale]);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (locale: Locale) => {
//     setSelectedLocale(locale);
//     setOpen(false);

//     const segments = pathname.split("/").filter(Boolean);
//     const newPath =
//       segments.length === 0
//         ? `/${locale}`
//         : `/${locale}/${segments.slice(1).join("/")}`;

//     router.push(newPath);
//   };

//   return (
//     <div
//       className="w-full inline-block text-left py-1 bg-white relative rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-200"
//       ref={dropdownRef}
//     >
//       <button
//         onClick={() => setOpen(!open)}
//         aria-haspopup="true"
//         aria-expanded={open}
//         aria-label="Select language"
//         className="p-2 flex relative items-center gap-3 w-full"
//       >
//         <IoLanguage size={18} />
//         <span>{localeLabels[selectedLocale] || "Select Language"}</span>
//       </button>

//       {open && (
//         <div className="absolute right-auto mt-3 min-w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50">
//           <ul className="py-1">
//             {LOCALES.map((locale) => (
//               <li key={locale}>
//                 <button
//                   onClick={() => handleSelect(locale)}
//                   className={`block w-full text-left px-4 py-2 text-sm border-none ${
//                     locale === selectedLocale
//                       ? "bg-blue-500 text-white"
//                       : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   }`}
//                 >
//                   {localeLabels[locale]}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useRef } from "react";
// import LanguageSwitcher from "@/components/LanguageSwitcher";
import LanguageSwitcher from "@/components/Language/LanguageSwitcher";
import { Locale } from "../../../../../config";
import { useParams } from "next/navigation";

const localeLabels: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
  es: "Español",
  ar: "العربية",
};

export default function Page() {
  const params = useParams();
  const langParam = params.lang;

  const currentLocale: Locale =
    typeof langParam === "string" &&
    ["en", "bn", "es", "ar"].includes(langParam)
      ? (langParam as Locale)
      : "en";

  const switcherRef = useRef<HTMLDivElement>(null);

  const handleLabelClick = () => {
    if (!switcherRef.current) return;
    // Find the toggle button inside LanguageSwitcher by selector
    const toggleBtn = switcherRef.current.querySelector(
      "button[aria-haspopup='true']"
    );
    if (toggleBtn) {
      (toggleBtn as HTMLButtonElement).click();
    }
  };

  return (
    <div className="flex gap-3 items-center w-full shadow-lg rounded-lg hover:bg-gray-200 p-2">
      {/* Attach ref to LanguageSwitcher container */}
      <div ref={switcherRef}>
        <LanguageSwitcher currentLocale={currentLocale} />
      </div>

      {/* External label that triggers toggle button click */}
      <button
        onClick={handleLabelClick}
        className="cursor-pointer"
        aria-label="Toggle language dropdown"
      >
        {localeLabels[currentLocale]}
      </button>
    </div>
  );
}
