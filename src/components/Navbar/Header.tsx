"use client";
import React from "react";

import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { GrNotification } from "react-icons/gr";
// import { CiLight } from "react-icons/ci";
// import { MdOutlineDarkMode } from "react-icons/md";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment;

  // const [activeDropdown, setActivaeDropdown] = useState<string | null>(null);
  // const toggleDropdown = (dropdown: string) => {
  //   setActivaeDropdown((prev) => (prev === dropdown ? null : dropdown));
  // };

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          "border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
          "border-b border-gray-200 bg-white": selectedLayout,
        }
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-7 w-7 bg-zinc-300 rounded-lg"></span>
            <span className="font-bold text-xl flex">Logo</span>
          </Link>
          {/* search bar  */}
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

        <div className="hidden md:block">
          <div className="flex flex-row items-center space-x-4">
            {/* color change */}
            {/* <div className="relative">
              <button className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-zinc-200">
                <CiLight
                  width={24}
                  height={24}
                  className="font-bold cursor-pointer"
                  onClick={() => toggleDropdown("LD")}
                />
              </button>
              {activeDropdown === "LD" && (
                <div className=" flex flex-col space-y-2 rounded-sm text-sm p-2 absolute top-8 bg-white">
                  <span className="flex flex-row items-center space-x-1 cursor-pointer hover:bg-zinc-100 p-1 rounded-sm">
                    <CiLight
                      width={24}
                      height={24}
                      className="font-extrabold"
                    />
                    <span>Light</span>
                  </span>
                  <span className="flex flex-row items-center space-x-1 cursor-pointer hover:bg-zinc-100 p-1 rounded-sm">
                    <MdOutlineDarkMode width={24} height={24} />
                    <span>Dark</span>
                  </span>
                </div>
              )}
            </div> */}

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

            {/* notification  */}
            <span className="h-8 w-8 rounded-full hover:bg-zinc-200 flex items-center justify-center cursor-pointer">
              <GrNotification width={24} height={24} />
            </span>

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
