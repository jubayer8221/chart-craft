"use client";

import CRightsideBar from "./Calendar/CHeader/CRightsideBar";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

interface AnnouncementItem {
  title: string;
  date: string;
  description: string;
  bgClass: string;
}

const Announcements: React.FC = () => {
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

  const {
    announcementsTitle = "",
    viewAll = "",
    announcementList = [],
  } = typeof t.announcementPage === "object" && t.announcementPage !== null
    ? t.announcementPage
    : {};

  if (!announcementsTitle) {
    return <div className="items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-[#312c4a] p-4 rounded-md overflow-y-auto h-[305px] scrollbar-hiden">
      <div className="mb-12">
        <CRightsideBar />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{announcementsTitle}</h1>
          <span className="text-xs text-gray-400 hover:text-white cursor-pointer">
            {viewAll}
          </span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {announcementList.map((item: AnnouncementItem, index: number) => (
            <div key={index} className={`${item.bgClass} rounded-md p-4`}>
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{item.title}</h2>
                <span className="text-xs text-gray-400 dark:text-white bg-white dark:bg-[#685e74] rounded-md px-1 py-1">
                  {item.date}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
