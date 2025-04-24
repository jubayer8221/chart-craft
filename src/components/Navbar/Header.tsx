"use client";
import React from "react";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
// import { FiMoon, FiSearch, FiSun } from "react-icons/fi";
import { GrNotification } from "react-icons/gr";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { FiSearch } from "react-icons/fi";
// import { useTheme } from "next-themes";

const Header = () => {
  const scrolled = useScroll(5);
  // const { setTheme, resolvedTheme } = useTheme();

  // const isDark = resolvedTheme === "dark";

  // const handleThemeToggle = () => {
  //   setTheme(isDark ? "light" : "dark");
  // };

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#191919] border-b border-gray-200 dark:border-zinc-700 transition-all",
        scrolled && "bg-white/75 dark:bg-zinc-900/75 backdrop-blur-lg"
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <Image
              src="/logo.jpg"
              alt="Chart Crafter Logo"
              width={80}
              height={50}
            />
          </Link>

          <div className="hidden md:block">
            <div className="w-[300px] h-8 border border-gray-300 dark:border-zinc-600 rounded-lg flex items-center px-2 bg-white dark:bg-zinc-800">
              <FiSearch className="text-gray-400 text-[20px] mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="w-full outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex flex-row items-center space-x-4">
            {/* Dark mode toggle */}
            {/* <div
              onClick={handleThemeToggle}
              className="flex items-center space-x-2 border border-zinc-100 dark:border-zinc-700 rounded-full p-1 px-2 cursor-pointer"
            >
              {isDark ? (
                <>
                  <FiSun className="text-yellow-400" />
                  <span className="text-sm text-zinc-300">Light Mode</span>
                </>
              ) : (
                <>
                  <FiMoon className="text-zinc-700" />
                  <span className="text-sm text-zinc-700">Dark Mode</span>
                </>
              )}
            </div> */}

            <ThemeToggle />

            <span className="h-8 w-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer">
              <GrNotification width={24} height={24} />
            </span>

            <div className="h-8 w-8 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-zinc-800 dark:text-zinc-200">PF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
