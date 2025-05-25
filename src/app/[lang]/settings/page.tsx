"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
// import { FaUser, FaLock, FaCog } from "react-icons/fa";
import { FaUser, FaLock } from "react-icons/fa";
import { usePathname } from "next/navigation";
import LanguageDropdown from "@/app/[lang]/settings/language/page";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

export default function Page() {
  const pathname = usePathname() || "/";

  const currentLocaleCode = (pathname.split("/")[1] ?? "en") as Locale;
  const currentLocale = isValidLocale(currentLocaleCode)
    ? currentLocaleCode
    : locales[0];

  const [t, setT] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
          .default;
        setT(msgs);
      } catch {
        setT({});
      }
    })();
  }, [currentLocale]);

  // Function to prepend locale to path
  // const getLocalizedPath = (path?: string) => {
  //   if (!path) return "#";
  //   return `/${currentLocale}${path.startsWith("/") ? "" : "/"}${path}`;
  // };

  return (
    <div className="w-full max-h-screen bg-white dark:bg-gray-800 justify-start min-w-[300px] min-h-[537px]">
      {/* Page Title */}
      <div className="w-full p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-6 text-left">
          {t.settings || "Settings"}
        </h1>
        <div className="grid grid-cols-1 lg:grid-rows-3 gap-4 w-full">
          {/* Accounts */}
          <Link href="/settings/account">
            <div className="shadow-lg bg-gray-100 rounded-lg p-3 text-center hover:bg-gray-200 cursor-pointer items-center justify-center">
              <h2 className="flex text-gray-800 items-center justify-start gap-4">
                <FaUser />
                {/* //Accounts */}
                {t.account || "Accounts"}
              </h2>
            </div>
          </Link>
          {/* Privacy */}
          <Link href="/settings/privacy">
            <div className="shadow-lg bg-gray-100 rounded-lg p-3 text-center hover:bg-gray-200 cursor-pointer">
              <h2 className=" text-gray-800 flex items-center justify-start gap-4">
                <FaLock></FaLock>
                {/* Privacy */}
                {/* {t?.setting?.privacy || "Privacy"} */}
                {t.privacy || "Privacy"}
              </h2>
            </div>
          </Link>
          {/* More Language Settings  */}
          {/* <Link href="/settings/language"> */}
          <div className=" cursor-pointer w-full">
            <LanguageDropdown />
          </div>

          {/* <div className="shadow-lg bg-gray-100 rounded-lg p-3 text-center items-center hover:bg-gray-200 cursor-pointer">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-start gap-4">
                <IoLanguage /> Language
              </h2>
            </div>

            <div className="relative inline-block text-left w-full">
              <div className="shadow-lg bg-gray-100 rounded-lg p-3 text-center flex items-center cursor-pointer"
              onClick={toggleDropdown}>
                <h2><IoLanguage />{selectedLanguage}</h2>
                        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
              </div>

              {isOpen && (
                <div>
                  {languages.map(lang)=>{
                    <div key={lang.code}
                      className="coursor-pointer"
                      onClick={()=> selectLanguage(lang)}
                    >
                    {lang.label}
                    </div>
                  }}
                </div>
              )}

            </div> */}
          {/* </Link> */}
          {/* More Settings  */}
          {/* <Link href="/settings/moreSettings">
            <div className="shadow-lg bg-gray-100 rounded-lg p-3 text-center items-center hover:bg-gray-200 cursor-pointer">
              <h2 className=" text-gray-800 flex items-center justify-start gap-4"> */}
          {/* <FaCog /> More Settings */}
          {/* <FaCog /> {t.moreSettings || "More Settings"} */}
          {/* Dynamic More Settings text */}
          {/* </h2>
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
