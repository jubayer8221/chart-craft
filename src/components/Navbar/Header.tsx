"use client";
import React from "react";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { GrNotification } from "react-icons/gr";
import Image from "next/image";

const Header = () => {
  const scrolled = useScroll(5);

  return (
    <div
      className={cn(
        "bg-white border-b border-gray-200 transition-all",
        scrolled && "bg-white/75 backdrop-blur-lg"
      )}
      // For fallback, uncomment below and add <div className="h-[47px]" /> above
      // className={cn(
      //   "fixed top-0 z-30 w-full bg-white border-b border-gray-200 transition-all",
      //   scrolled && "bg-white/75 backdrop-blur-lg"
      // )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          {/* Logo (Mobile Only) */}
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

          {/* Search Bar */}
          <div className="hidden md:block">
            <div className="w-[300px] h-8 border border-gray-300 rounded-lg flex items-center px-2">
              <FiSearch className="text-gray-400 text-[20px] mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="w-full outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="hidden md:block">
          <div className="flex flex-row items-center space-x-4">
            {/* Light/Dark Toggle */}
            <div className="inline-flex items-center gap-2 border border-zinc-100 rounded-full p-1">
              <label
                htmlFor="switch-component-on"
                className="text-zinc-600 text-sm cursor-pointer"
              >
                Light
              </label>

              <div className="relative inline-block w-10 h-5">
                <input
                  id="switch-component-on"
                  type="checkbox"
                  className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-zinc-800 cursor-pointer transition-colors duration-300"
                />
                <label
                  htmlFor="switch-component-on"
                  className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
                ></label>
              </div>

              <label
                htmlFor="switch-component-on"
                className="text-zinc-600 text-sm cursor-pointer"
              >
                Dark
              </label>
            </div>

            {/* Notification Icon */}
            <span className="h-8 w-8 rounded-full hover:bg-zinc-200 flex items-center justify-center cursor-pointer">
              <GrNotification width={24} height={24} />
            </span>

            {/* Profile Initials */}
            <div className="h-8 w-8 bg-zinc-300 rounded-full flex items-center justify-center cursor-pointer">
              <span>PF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;