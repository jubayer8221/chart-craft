"use client";

import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GrNotification } from "react-icons/gr";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { ReactNode } from "react";
import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { AuthContext } from "@/components/context/AuthContext";
import LanguageSwitcher from "@/components/Language/LanguageSwitcher";
import { Locale, LOCALES } from "../../../config";
// import TranslateWithGoogle from "../Language/TranslateWithGoogle";
// import LocaleLayoutProps from "../../app/layout";

interface HeadersProps {
  children: ReactNode;
  params: { lang: string }; // no Promise here
}

export default function Header({ params }: HeadersProps) {
  // export function Header({parms} : HeadersProps) = () => {
  const scrolled = useScroll(5);
  const { logout, token } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropDownNotification, setDropdownNotification] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>("/image/mainuser.png");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Map token to user ID (simplified for demo; in reality, decode token or use API)
  const userId = token === "fake-jwt-token" ? 1 : 2;

  // Fetch user photo from localStorage
  const updateUserPhoto = useCallback(() => {
    const stored = localStorage.getItem("userData");
    const customarsList = stored ? JSON.parse(stored) : [];
    const user = customarsList.find((c: { id: number }) => c.id === userId);
    setUserPhoto(user?.photo || "/image/mainuser.png");
  }, [userId]);

  // Initial fetch and listen for storage updates
  useEffect(() => {
    updateUserPhoto();
    const handleStorageUpdate = () => updateUserPhoto();
    window.addEventListener("storageUpdated", handleStorageUpdate);
    return () => {
      window.removeEventListener("storageUpdated", handleStorageUpdate);
    };
  }, [updateUserPhoto]);

  // Handle clicks outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setDropdownNotification(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const { lang } = params;

  const rawLang = lang || "en";
  const locale: Locale = LOCALES.includes(rawLang as Locale)
    ? (rawLang as Locale)
    : "en";

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#312c4a] border-b border-gray-200 dark:border-zinc-700 transition-all",
        scrolled && "bg-white/75 dark:bg-[#312c4a] backdrop-blur-lg"
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center lg:hidden xl:hidden"
          >
            <Image
              src="/image/logo.png"
              alt="Chart Crafter Logo"
              width={70}
              height={40}
            />
          </Link>

          <div className="hidden md:block">
            <div className="w-[300px] h-8 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center px-2 bg-white dark:bg-[#312c4a]">
              <FiSearch className="text-gray-400 text-[20px] mr-2" />
              <input
                type="text"
                placeholder="Search"
                className="w-full outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block md:mr-10 lg:mr-0 xl:mr-0">
          <div className="flex flex-row items-center space-x-4">
            <ThemeToggle />

            <div className="hidden md:block lg:flex">
              {/* <TranslateWithGoogle/> */}
              <LanguageSwitcher currentLocale={locale} />
            </div>
            <span
              className="h-8 w-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
              onClick={() => setDropdownNotification(!dropDownNotification)}
            >
              <GrNotification width={24} height={24} />
              {dropDownNotification && (
                <div className="fixed right-4 top-14 w-80 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl z-50">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700/50 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Mark all as read
                    </button>
                  </div>

                  {/* Notification items container */}
                  <div className="overflow-y-auto">
                    {/* Individual notification items */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                            <svg
                              className="h-5 w-5 text-blue-600 dark:text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              New notification
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              This is your notification #{item} with more
                              details
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              2 hours ago
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700/50 text-center">
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </span>

            <div
              className="h-8 w-8 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center justify-center cursor-pointer"
              ref={dropdownRef}
            >
              <div className="relative">
                <span
                  className="text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <Image
                    src={userPhoto}
                    width={35}
                    height={35}
                    alt="user"
                    className="rounded-full"
                  />
                </span>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-[#312c4a] border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg">
                    <ul className="py-2">
                      <Link href="/settings/account">
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer">
                          Profile
                        </li>
                      </Link>
                      <Link href="/settings">
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer">
                          Settings
                        </li>
                      </Link>
                      <li
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 "
                        onClick={() => setIsOpen(true)}
                      >
                        <button onClick={() => setIsOpen(true)}>
                          <span className="flex items-center gap-3 cursor-pointer">
                            <p>Logout</p>
                            <FiLogOut size={20} />
                          </span>
                        </button>
                      </li>
                      <li>
                        {isOpen && (
                          <div className="fixed overflow-hidden cursor-default inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/60">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100">
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                Confirm Logout
                              </h2>
                              <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Are you sure you want to log out?
                              </p>
                              <div className="flex justify-center gap-4">
                                <button
                                  onClick={() => setIsOpen(false)}
                                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                                  aria-label="Cancel logout"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleLogout}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer  hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                                  aria-label="Confirm logout"
                                >
                                  Logout
                                  <FiLogOut size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default Header;
