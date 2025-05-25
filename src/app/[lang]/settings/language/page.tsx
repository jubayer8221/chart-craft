// "use client";

// import React, { useState, useEffect } from "react";
// import { IoLanguage } from "react-icons/io5";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// interface Language {
//   code: string;
//   label: string;
// }

// const languages: Language[] = [
//   { code: "en", label: "English" },
//   { code: "bn", label: "বাংলা" },
//   { code: "es", label: "Spanish" },
// ];

// const LanguageDropdown: React.FC = () => {
//   const router = useRouter();
//   const pathname = usePathname() || "/";
//   const searchParams = useSearchParams();

//   // Extract current locale from URL path (default to 'en')
//   const currentLocaleCode = pathname.split("/")[1] || "en";

//   // Find label of current locale for display
//   const currentLangLabel =
//     languages.find((lang) => lang.code === currentLocaleCode)?.label ||
//     "English";

//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState(currentLangLabel);

//   // Close dropdown & sync selected language on route change
//   useEffect(() => {
//     setIsOpen(false);
//     const label =
//       languages.find((lang) => lang.code === currentLocaleCode)?.label ||
//       "English";
//     setSelectedLanguage(label);
//   }, [currentLocaleCode]);

//   const toggleDropdown = () => setIsOpen(!isOpen);

//   const selectLanguage = (lang: Language) => {
//     setIsOpen(false);

//     const segments = pathname.split("/").filter(Boolean); // filter removes empty strings

//     if (languages.some((l) => l.code === lang.code)) {
//       if (segments.length === 0) {
//         // Root path, add locale prefix
//         router.push(`/${lang.code}`);
//         return;
//       }

//       if (languages.some((l) => l.code === segments[0])) {
//         // Replace existing locale segment
//         segments[0] = lang.code;
//       } else {
//         // Prepend locale segment if missing
//         segments.unshift(lang.code);
//       }
//     }

//     const newPathname = "/" + segments.join("/");
//     const query = searchParams ? `?${searchParams.toString()}` : "";
//     router.push(newPathname + query);
//   };

//   return (
//     <div className="relative inline-block text-left w-full">
//       <div
//         className="shadow-lg bg-gray-100 w-full rounded-lg p-3 text-center flex items-center justify-between cursor-pointer hover:bg-gray-200"
//         onClick={toggleDropdown}
//       >
//         <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <IoLanguage />
//           {selectedLanguage}
//         </h2>
//         <svg
//           className={`w-5 h-5 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </div>

//       {isOpen && (
//         <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 max-h-60 overflow-auto">
//           {languages.map((lang) => (
//             <div
//               key={lang.code}
//               className="cursor-pointer px-4 py-2 hover:bg-gray-100"
//               onClick={() => selectLanguage(lang)}
//             >
//               {lang.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LanguageDropdown;

// "use client";

// import React, { useState, useEffect } from "react";
// import { IoLanguage } from "react-icons/io5";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { LOCALES, Locale } from "../../../../../config";

// // interface Language {
// //   code: string;
// //   label: string;
// // }

// // const languages: Language[] = [
// //   { code: "en", label: "English" },
// //   { code: "bn", label: "বাংলা" },
// //   { code: "es", label: "Spanish" },
// // ];

// interface LanguageSwitcherProps {
//   currentLocale: Locale;
// }

// const localeLabels: Record<Locale, string> = {
//   en: "English",
//   bn: "বাংলা",
//   es: "Español",
//   ar: "العربية",
// };

// export default function LanguageDropdown({
//   currentLocale,
// }: LanguageSwitcherProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on outside click
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
//     setOpen(false);
//     const segments = pathname.split("/").filter(Boolean);
//     if (segments.length === 0) {
//       router.push(`/${locale}`);
//       return;
//     }
//     segments[0] = locale;
//     router.push("/" + segments.join("/"));
//   };

// }
//  return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       {/* Trigger icon button */}
//       <button
//         onClick={() => setOpen(!open)}
//         aria-haspopup="true"
//         aria-expanded={open}
//         aria-label="Select language"
//         className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
//       >
//         {/* <FiGlobe size={24} /> */}
//         <IoLanguage size={18} />
//       </button>

//       {/* Dropdown menu */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50">
//           <ul className="py-1">
//             {LOCALES.map((locale) => (
//               <li key={locale}>
//                 <button
//                   onClick={() => handleSelect(locale)}
//                   className={`block w-full text-left px-4 py-2 text-sm border-none ${
//                     locale === currentLocale
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

// // export default LanguageDropdown;

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LOCALES, Locale } from "../../../../../config";
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
  const [selectedLocale, setSelectedLocale] = useState<Locale>(currentLocale);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(
      "currentLocale changed:",
      currentLocale,
      "selectedLocale:",
      selectedLocale
    );
    setSelectedLocale(currentLocale);
  }, [currentLocale, selectedLocale]);

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
    console.log(
      "Selecting locale:",
      locale,
      "Current selectedLocale:",
      selectedLocale
    );
    setSelectedLocale(locale);
    setOpen(false);

    const segments = pathname.split("/").filter(Boolean);
    const newPath =
      segments.length === 0
        ? `/${locale}`
        : `/${locale}/${segments.slice(1).join("/")}`;
    console.log("Navigating to:", newPath);
    setTimeout(() => {
      router.push(newPath);
    }, 100);
  };
  return (
    // <div className="relative w-full rounded-lg shadow-lg">
    <div
      className=" w-full inline-block text-left py-1 bg-white relative rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-200"
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Select language"
        className="p-2 flex relative items-center gap-3 w-full"
      >
        <IoLanguage size={18} />
        <span>{localeLabels[selectedLocale] || "Select Language"}</span>
      </button>

      {open && (
        <div className="absolute right-auto mt-3 min-w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50">
          <ul className="py-1">
            {LOCALES.map((locale) => (
              <li key={locale}>
                <button
                  onClick={() => handleSelect(locale)}
                  className={`block w-full text-left px-4 py-2 text-sm border-none ${
                    locale === selectedLocale
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
    // </div>
  );
}
