"use client";

import Link from "next/link";
import { FaUser, FaLock, FaCog } from "react-icons/fa";

export default function Page() {
  return (
    <div className="w-full h-full bg-white flex justify-start min-w-[300px] min-h-[537px]">
      {/* Page Title */}
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-left">
          Settings
        </h1>
        <div className="grid grid-cols-1 lg:grid-rows-3 gap-4 w-full">
          {/* Accounts */}
          <Link href="/settings/account">
            <div className="shadow-lg bg-gray-100 rounded-lg p-3 text-center hover:bg-gray-200 cursor-pointer items-center justify-center">
              <h2 className="text-lg flex font-semibold text-gray-800 items-center justify-start gap-4">
                <FaUser /> Accounts
              </h2>
            </div>
          </Link>
          {/* Privacy */}
          <Link href="/settings/privacy">
            <div className="shadow-lg bg-gray-100 rounded-lg p-3 text-center hover:bg-gray-200 cursor-pointer">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-start gap-4">
                <FaLock></FaLock> Privacy
              </h2>
            </div>
          </Link>
          {/* More Settings  */}
          <div className="shadow-lg bg-gray-100 rounded-lg p-3 text-center items-center hover:bg-gray-200 cursor-pointer">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-start gap-4">
              <FaCog></FaCog> More Settings
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
