"use client";

import Image from "next/image";
// import React from "react";
// import React, { useRef } from "react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

// const tableThemes = [
//   {
//     title: "Basic Table",
//     // description:
//     //   "Display data in a simple and structured format without complex features.",
//   },
//   {
//     title: "Sortable Table",
//     // description:
//     //   "Allows users to sort columns by ascending or descending order.",
//   },
//   {
//     title: "Filterable Table",
//     // description:
//     //   "Users can filter data based on specific criteria or keywords.",
//   },
//   {
//     title: "Paginated Table",
//     // description:
//     //   "Break large data sets into smaller pages for easier navigation.",
//   },
//   {
//     title: "Editable Table",
//     // description: "Users can directly edit table cells for quick updates.",
//   },
// ];

const TableThemes: React.FC = () => {
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

  //   Function to scroll left or right
  //   const scrollRef = useRef<HTMLDivElement>(null);
  // const handleScroll = (direction: "left" | "right") => {
  //   if (scrollRef.current) {
  //     const scrollAmount = 300; // How much to scroll
  //     if (direction === "left") {
  //       scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  //     } else {
  //       scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  //     }
  //   }
  // };

  return (
    <div>
      <div className="">
        {/* Scroll Buttons
        <div className="flex justify-end space-x-2 mb-2">
          <button
            onClick={() => handleScroll("left")}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ◀
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ▶
          </button>
        </div> */}
      </div>

      <div className="max-w-md mx-auto p-2 bg-white dark:bg-gray-500 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t["theme.tableThemes"] || "Table Themes"}
          </h2>
          {/* <h1 className="text-2xl font-bold mb-2">{t["themes"] || "Themes"}</h1> */}
          {/* 
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Convert
          </button> */}
        </div>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
          <Image
            src="/image/table_theme_logo.png"
            alt="File conversion illustration"
            width={270}
            height={40}
            className="object-contain"
          />
        </div>

        <p className="text-sm text-gray-600 text-center dark:text-white">
          {t["theme?.TableThemesDescription"] ||
            "To see table theme, click the button above."}
        </p>
      </div>
    </div>
  );
};

export default TableThemes;
