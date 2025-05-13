"use client";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
// import { FiMoon, FiSearch, FiSun } from "react-icons/fi";
import { GrNotification } from "react-icons/gr";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { FiSearch } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";

import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/components/context/AuthContext";

// import { useTheme } from "next-themes";

const Header = () => {
  const scrolled = useScroll(5);
  // const { setTheme, resolvedTheme } = useTheme();

  // const isDark = resolvedTheme === "dark";

  // const handleThemeToggle = () => {
  //   setTheme(isDark ? "light" : "dark");
  // };

  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false); // Close dropdown on outside click
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#000022] border-b border-gray-200 dark:border-zinc-700 transition-all",
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
              src="/logo.png"
              alt="Chart Crafter Logo"
              width={70}
              height={40}
            />
          </Link>

          <div className="hidden md:block">
            <div className="w-[300px] h-8 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center px-2 bg-white dark:bg-[#0f0f22]">
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
                    src="/image/mainuser.png"
                    width={40}
                    height={40}
                    alt="user"
                    className="rounded-full"
                  />
                </span>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg">
                    <ul className="py-2">
                      <Link href="/page/userProfile">
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer">
                          Profile
                        </li>
                      </Link>
                      <Link href="/settings">
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer">
                          Settings
                        </li>
                      </Link>
                      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer">
                        <button onClick={() => setIsOpen(true)}>
                          <span>Logout</span>
                        </button>
                        {isOpen && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-75 transition-opacity duration-300">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100">
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                                Confirm Logout
                              </h2>
                              <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Are you sure you want to log out?
                              </p>
                              <div className="flex justify-end gap-4">
                                <button
                                  onClick={() => setIsOpen(false)}
                                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                                  aria-label="Cancel logout"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleLogout}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                                  aria-label="Confirm logout"
                                >
                                  <FiLogOut size={20} />
                                  Logout
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        <FiLogOut />
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
};

export default Header;

// "use client";
// import useScroll from "@/hooks/use-scroll";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { GrNotification } from "react-icons/gr";
// import Image from "next/image";
// import ThemeToggle from "./ThemeToggle";
// import { FiSearch, FiLogOut } from "react-icons/fi";
// import React, { useState, useRef, useEffect } from "react";

// // UNCOMMENT this if you're using NextAuth.js
// // import { signOut } from "next-auth/react";

// const Header = () => {
//   const scrolled = useScroll(5);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false); // fix: should close dropdown, not open it
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Logout Handler
//   const handleLogout = () => {
//     //  Option 1: For NextAuth.js users
//     // signOut({ callbackUrl: "/login" });

//     // Option 2: For manual token-based auth (e.g., JWT)
//     localStorage.removeItem("token"); // or
//     sessionStorage.removeItem("authToken"); // Replace "userToken" with the actual key you want to remove
//     window.location.href = "/login";
//     console.log("token");
//   };

//   return (
//     <div
//       className={cn(
//         "bg-white dark:bg-[#000022] border-b border-gray-200 dark:border-zinc-700 transition-all",
//         scrolled && "bg-white/75 dark:bg-zinc-900/75 backdrop-blur-lg"
//       )}
//     >
//       <div className="flex h-[47px] items-center justify-between px-4">
//         <div className="flex items-center space-x-4">
//           <Link
//             href="/"
//             className="flex flex-row space-x-3 items-center justify-center md:hidden"
//           >
//             <Image
//               src="/logo.png"
//               alt="Chart Crafter Logo"
//               width={70}
//               height={40}
//             />
//           </Link>

//           <div className="hidden md:block">
//             <div className="w-[300px] h-8 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center px-2 bg-white dark:bg-[#0f0f22]">
//               <FiSearch className="text-gray-400 text-[20px] mr-2" />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="hidden md:block">
//           <div className="flex flex-row items-center space-x-4">
//             <ThemeToggle />

//             <span className="h-8 w-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer">
//               <GrNotification width={24} height={24} />
//             </span>

//             <div
//               className="h-8 w-8 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center justify-center cursor-pointer"
//               ref={dropdownRef}
//             >
//               <div className="relative">
//                 <span
//                   className="text-zinc-800 dark:text-zinc-200 cursor-pointer"
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                 >
//                   <Image
//                     src="/image/mainuser.png"
//                     width={40}
//                     height={40}
//                     alt="user"
//                     className="rounded-full"
//                   />
//                 </span>
//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50">
//                     <ul className="py-2">
//                       <Link href="">
//                         <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer">
//                           Profile
//                         </li>
//                       </Link>
//                       <Link href="/settings">
//                         <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer">
//                           Settings
//                         </li>
//                       </Link>
//                       <li
//                         onClick={handleLogout}
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
//                       >
//                         <span>Logout</span>
//                         <FiLogOut />
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;
