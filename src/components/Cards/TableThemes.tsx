"use client";

import Image from "next/image";
// import React from "react";
// import React, { useRef } from "react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

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

  return (
    <div>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-500 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t["theme.tableThemes"] || "Table Themes"}
          </h2>
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
