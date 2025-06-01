// "use client";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import Script from "next/script";
// import { IoLanguage } from "react-icons/io5";

// declare global {
//   interface Window {
//     google: {
//       translate: {
//         TranslateElement: new (
//           options: { pageLanguage: string },
//           elementId: string
//         ) => void;
//       };
//     };
//     googleTranslateElementInit?: () => void;
//   }
// }

// export default function TranslateWithGoogle() {
//   const pathname = usePathname();
//   const [showDropdown, setShowDropdown] = useState(false);

//   useEffect(() => {
//     function initializeGoogleTranslate() {
//       if (
//         typeof window !== "undefined" &&
//         window.google &&
//         window.google.translate
//       ) {
//         new window.google.translate.TranslateElement(
//           { pageLanguage: "en" },
//           "google_translate_element"
//         );
//       }
//     }

//     initializeGoogleTranslate();

//     const timeout = setTimeout(() => {
//       initializeGoogleTranslate();
//     }, 1000);

//     return () => clearTimeout(timeout);
//   }, [pathname]);

//   useEffect(() => {
//     if (showDropdown) {
//       const dropdown = document.querySelector(".goog-te-combo") as HTMLElement;
//       if (dropdown) dropdown.style.display = "inline-block";
//     }
//   }, [showDropdown]);

//   return (
//     <div>
//       <div
//         className="inline-block text-gray-800 select-none"
//         id="google_translate_wrapper"
//         style={{ padding: 0, margin: 0 }}
//       >
//         <button
//           className="flex items-center gap-2 text-gray-800 hover:text-gray-600"
//           onClick={() => {
//             setShowDropdown(true);
//           }}
//         >
//           <IoLanguage className="text-xl" />
//         </button>

//         <div id="google_translate_element" />
//       </div>

//       <style>{`
//         /* Hide all default Google Translate branding, logos, and links */
//         .goog-te-gadget img,
//         .goog-logo-link,
//         .goog-te-gadget a,
//         .goog-te-gadget span {
//           display: none !important;
//         }

//         body > .skiptranslate {
//           display: none !important;
//         }

//         body {
//           top: 0px !important;
//         }

//         #goog-gt-tt,
//         .goog-te-balloon-frame,
//         .goog-te-menu-value,
//         .goog-text-highlight,
//         .goog-te-menu-frame {
//           display: none !important;
//         }

//         /* Always hide the dropdown unless showDropdown is true */
//         .goog-te-combo {
//           display: none;
//           border-radius: 0.5rem !important;
//           border: 1px solid #d1d5db !important;
//           padding: 0.5rem 1rem !important;
//           font-size: 1rem !important;
//           color: #1f2937 !important;
//           background-color: #f3f4f6 !important;
//           box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
//           transition: all 0.3s ease !important;
//           outline: none !important;
//           cursor: pointer !important;
//           margin-top: 0.5rem !important;
//         }

//         /* Reveal it manually via JS when showDropdown becomes true */
//       `}</style>

//       <Script id="google-translate-init" strategy="afterInteractive">
//         {`
//           window.googleTranslateElementInit = function () {
//             new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
//           }
//         `}
//       </Script>

//       <Script
//         src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//         strategy="afterInteractive"
//       />
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import Script from "next/script";
// import { IoLanguage } from "react-icons/io5";

// declare global {
//   interface Window {
//     google?: {
//       translate?: {
//         TranslateElement: new (
//           options: { pageLanguage: string; autoDisplay?: boolean },
//           elementId: string
//         ) => void;
//       };
//     };
//     googleTranslateElementInit?: () => void;
//   }
// }

// const LANGUAGES = [
//   { code: "en", label: "English" },
//   { code: "bn", label: "বাংলা" },
//   { code: "es", label: "Español" },
//   { code: "ar", label: "العربية" },
// ];

// export default function GoogleTranslateDropdown() {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSelect = (langCode: string) => {
//     const interval = setInterval(() => {
//       const selectEl = document.querySelector(
//         ".goog-te-combo"
//       ) as HTMLSelectElement;
//       if (selectEl) {
//         selectEl.value = langCode;
//         selectEl.dispatchEvent(new Event("change"));
//         clearInterval(interval);
//         setOpen(false);
//       }
//     }, 200);
//   };

//   return (
//     <div className="relative inline-block" ref={dropdownRef}>
//       <button
//         onClick={() => setOpen(!open)}
//         className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//         aria-label="Translate"
//       >
//         <IoLanguage size={20} />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-44 rounded-md bg-white dark:bg-gray-800 shadow-lg z-50">
//           <ul className="py-1">
//             {LANGUAGES.map(({ code, label }) => (
//               <li key={code}>
//                 <button
//                   onClick={() => handleSelect(code)}
//                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   {label}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div id="google_translate_element" style={{ display: "none" }} />

//       <Script id="google-translate-callback" strategy="afterInteractive">
//         {`
//           function googleTranslateElementInit() {
//             new google.translate.TranslateElement(
//               { pageLanguage: 'en', autoDisplay: false },
//               'google_translate_element'
//             );
//           }
//           window.googleTranslateElementInit = googleTranslateElementInit;
//         `}
//       </Script>

//       <Script
//         src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//         strategy="afterInteractive"
//       />
//     </div>
//   );
// }
