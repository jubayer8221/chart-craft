"use client";

import Link from "next/link";

export default function Page() {
  // Handle input changes and update form data

  return (
    <div className=" bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Settings
        </h1>

        {/* Settings Form */}
        <ul>
          <Link href="/settings/account">
            <li>Accounts</li>
          </Link>
          <Link href="/settings/privacy">
            <li>Privacy</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
