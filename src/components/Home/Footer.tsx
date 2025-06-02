import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className=" border border-gray-200 dark:border-zinc-700 rounded-lg py-4">
        <div className="max-w-fulls mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Chart Crafter. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/terms" className="text-gray-400 hover:text-blue-900">
              Terms of Service
            </Link>
            <Link
              href="/settings/privacy"
              className="text-gray-400 hover:text-blue-900"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
