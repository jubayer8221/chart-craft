"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
// import { FaUser, FaLock, FaCog } from "react-icons/fa";
import { FaUser, FaLock } from "react-icons/fa";
import { usePathname } from "next/navigation";
import LanguageDropdown from "@/app/[lang]/settings/language/page";
import { locales, Locale, isValidLocale } from "@/i18n/routing";
import ThemeToggle from "@/components/Navbar/ThemeToggle";
// import Script from "next/script";
import useGoogleTranslate from "@/hooks/useGoogleTranslate"; // Adjust path accordingly

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

  useGoogleTranslate();

  return (
    <div className="w-full max-h-screen bg-white dark:bg-[#312c4a] justify-start min-w-[300px] min-h-[537px]">
      {/* Page Title */}
      <div className="w-full p-4 ">
        <h1 className="text-xl font-bold text-gray-700 dark:text-white mb-6 text-left">
          {t.settings || "Settings"}
        </h1>
        <div className="grid grid-cols-1 lg:grid-rows-3 gap-4 w-full ">
          {/* Accounts */}
          <Link href="/settings/account">
            <div className="shadow-lg bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg p-3 text-center hover:bg-gray-200 cursor-pointer items-center justify-center">
              <h1 className="flex text-gray-700 dark:text-white items-center justify-start gap-4">
                <FaUser />
                {t.account || "Accounts"}
              </h1>
            </div>
          </Link>
          {/* Privacy */}
          <Link href="/settings/privacy">
            <div className="shadow-lg bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg p-3 text-center hover:bg-gray-200 cursor-pointer">
              <h1 className=" text-gray-800 dark:text-white flex items-center justify-start gap-4">
                <FaLock></FaLock>
                {t.privacy || "Privacy"}
              </h1>
            </div>
          </Link>
          {/* More Language Settings  */}
          {/* <Link href="/settings/language"> */}
          <div className=" cursor-pointer w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg">
            <LanguageDropdown />
          </div>
          <div className="shadow-lg bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg p-3 text-center hover:bg-gray-200 cursor-pointer">
            <h2 className="  flex items-center justify-start rounded-lg">
              {/* <FaLock></FaLock> */}
              <ThemeToggle></ThemeToggle>
              {/* Privacy */}
              {/* {t.privacy || "Privacy"} */}
            </h2>
          </div>
          <div>
            <div className="shadow-lg bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg text-center items-center hover:bg-gray-200 cursor-pointer">
              <h2 className="text-sm text-gray-800 dark:text-white flex items-center justify-start gap-4 px-2 pt-2">
                {/* Google Translate widget container */}
                <div
                  className="inline-block visible text-gray-800 select-none items-center"
                  id="google_translate_wrapper"
                  style={{ padding: 0, margin: 0 }} // explicitly no padding/margin
                >
                  <div
                    id="google_translate_element"
                    className="relative p-0 m-0"
                  />
                </div>

                {/* CSS to hide Google branding, banners, tooltips and style dropdown */}

                <style>{`
                /* Hide Google Translate images (logo) */
                .goog-te-gadget img {
                display: none !important;
                }
  
                 /* Hide floating translate banner */
                 body > .skiptranslate {
                   display: none !important;
                 }
                                
                 /* Reset body top offset */
                 body {
                   top: 0px !important;
                    margin: 0 !important;
                 }
                                
                 /* Hide tooltip, balloon, menu etc */
                 #goog-gt-tt,
                 .goog-te-balloon-frame,
                 .goog-te-menu-value,
                 .goog-text-highlight,
                 .goog-te-menu-frame {
                   display: none !important;
                 }
                   .goog-logo-link,
                    .goog-te-gadget a,
                    .goog-te-gadget span {
                     display: none !important;
                     color: transparent !important;
                      pointer-events: none !important;
                      user-select: none !important;
                      height: 0 !important;
                      overflow: hidden !important;
                      width: 0 !important;
                      line-height: 0 !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      border: none !important;
                    }                                
                 /* Style dropdown */
                 .goog-te-combo {
                   border-radius: 0.5rem !important;
                   border: 1px solid #d1d5db !important;
                   border: none !important;
                   padding: 0.5rem 0.5rem !important;
                   font-size: 1rem !important;
                   color: #1f2937 !important;
                   background-color: #f3f4f6 !important;
                   box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
                   transition: all 0.3s ease !important;
                   outline: none !important;
                   cursor: pointer !important;
                 }
                                
                 .goog-te-combo:hover,
                 .goog-te-combo:focus {
                   border-color: #6366f1 !important;
                   box-shadow: 0 0 8px #6366f1 !important;
                 }
                                
                 /* Hide Powered by Translate text and link */
                 .goog-te-gadget {
                   color: transparent !important;
                   display: hidden !important;
                 }
                  `}</style>

                {/* Load Google Translate script */}
              </h2>
            </div>
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
