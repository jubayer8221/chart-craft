import { ReactNode } from "react";

export default function MarginWidthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col md:ml-60 sm:border-r dark:border-gray-700 sm:border-zinc-700 dark:bg-gray-800 min-h-screen">
      {children}
    </div>
  );
}
