// src/app/[lang]/LeftSide.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RiArrowDropDownLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";
// import { FaUsersCog } from "react-icons/fa";
// import { FiUsers } from "react-icons/fi";
// import { TiThListOutline } from "react-icons/ti";
// import { LuSettings } from "react-icons/lu";
// import { TbReportSearch } from "react-icons/tb";
// import { SideNavSection, SideNavItem, SideNavSubItem } from "@/types/types";

// Import the new SIDENAV_ITEMS
import { SIDENAV_ITEMS } from "@/constants";
import { SideNavItem } from "@/types/types";

const LeftSide = () => {
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
  const getLocalizedPath = (path?: string) => {
    if (!path) return "#";
    return `/${currentLocale}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="md:w-60 bg-white dark:bg-[#000022] h-screen fixed border-r dark:border-gray-700 border-zinc-200 hidden md:flex flex-col justify-between">
      <div className="flex flex-col space-y-6 w-full justify-around">
        <Link
          href={`/${currentLocale}/`}
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 dark:bg-[#000022] dark:border-gray-700 h-[47px] w-full"
        >
          <Image src="/logo.png" alt="Logo" width={80} height={40} priority />
        </Link>

        <div className="flex flex-col space-y-2 md:px-6 overflow-y-auto max-h-[calc(100vh-160px)]">
          {SIDENAV_ITEMS.map((section, idx) => (
            <div key={idx} className="mt-4">
              <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 px-2">
                {(section.titleKey && t[section.titleKey]) ||
                  section.title ||
                  section.titleKey ||
                  ""}
              </h2>
              {section.items?.map((item, itemIdx) => (
                <MenuItem
                  key={itemIdx}
                  i={item}
                  t={t}
                  pathname={pathname}
                  getLocalizedPath={getLocalizedPath}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type MenuItemProps = {
  i: SideNavItem;
  t: Record<string, string>;
  pathname: string;
  getLocalizedPath: (path?: string) => string;
};

const MenuItem = ({ i, t, pathname, getLocalizedPath }: MenuItemProps) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  // Visibility check
  if (i.visible && !i.visible.includes("admin")) return null;

  const isActive =
    pathname === getLocalizedPath(i.path) ||
    (i.subMenuItems?.some((sub) => pathname === getLocalizedPath(sub.path)) ??
      false);

  const toggleSubMenu = () => setSubMenuOpen(!subMenuOpen);

  return (
    <div className="mt-2 text-sm">
      <div className="flex flex-col gap-2">
        {i.path ? (
          <Link
            href={getLocalizedPath(i.path)}
            className={`flex flex-row items-center p-2 rounded-lg w-full justify-between hover:bg-zinc-100 dark:hover:bg-gray-900 ${
              isActive ? "bg-zinc-100 dark:bg-gray-900" : ""
            }`}
            onClick={i.submenu ? toggleSubMenu : undefined}
            aria-expanded={i.submenu ? subMenuOpen : undefined}
            aria-controls={i.submenu ? `submenu-${i.titleKey}` : undefined}
          >
            <div className="flex flex-row space-x-4 items-center">
              {i.icon}
              <span className="font-semibold">
                {i.titleKey
                  ? t[i.titleKey] || i.title || i.titleKey
                  : i.title || ""}
              </span>
            </div>
            {i.submenu && (
              <RiArrowDropDownLine
                className={`w-6 h-6 transition-transform ${
                  subMenuOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </Link>
        ) : (
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg w-full justify-between hover:bg-zinc-100 dark:hover:bg-gray-900 ${
              isActive ? "bg-zinc-100 dark:bg-gray-900" : ""
            }`}
            aria-expanded={subMenuOpen}
            aria-controls={`submenu-${i.titleKey}`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {i.icon}
              <span className="font-semibold">
                {i.titleKey
                  ? t[i.titleKey] || i.title || i.titleKey
                  : i.title || ""}
              </span>
            </div>
            {i.submenu && (
              <RiArrowDropDownLine
                className={`w-6 h-6 transition-transform ${
                  subMenuOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
        )}

        {i.submenu && subMenuOpen && (
          <div
            id={`submenu-${i.titleKey}`}
            className="my-2 ml-6 flex flex-col space-y-4"
          >
            {i.subMenuItems
              ?.filter(
                (item) => !item.visible || item.visible.includes("admin")
              )
              .map((subItem, idx) => (
                <Link
                  key={idx}
                  href={getLocalizedPath(subItem.path)}
                  className={`flex flex-row items-center p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-gray-900 w-full space-x-4 ${
                    pathname === getLocalizedPath(subItem.path)
                      ? "bg-zinc-100 dark:bg-gray-900 font-bold"
                      : ""
                  }`}
                >
                  {subItem.icon}
                  <span>
                    {t[subItem.titleKey] || subItem.title || subItem.titleKey}
                  </span>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSide;
