"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

interface UserCardProps {
  type: string;
  count: number;
  year: string;
  id: number;
}

const UserCard: React.FC<UserCardProps> = ({ type, count, year }) => {
  return (
    <div className="rounded-xl flex-wrap odd:bg-[#0A3A66] dark:odd:bg-[#312c4a] even:bg-[#00A9B4] dark:even:bg-[#685e74] text-white p-4 flex-1 min-w-full">
      <div className=" items-center justify-between">
        <span className="text-[10px] bg-white dark:bg-[#685e74] px-2 py-1 rounded-full text-green-600 dark:text-white">
          {year}
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">{count.toLocaleString()}</h1>
      <h1 className="capitalize text-sm font-medium">{type}</h1>
    </div>
  );
};

const UserCardsList: React.FC = () => {
  const pathname = usePathname() || "/";
  const currentLocaleCode = (pathname.split("/")[1] ?? "en") as Locale;
  const currentLocale = isValidLocale(currentLocaleCode)
    ? currentLocaleCode
    : locales[0];

  const [userCard, setUserCard] = useState<{ userCard: UserCardProps[] }>({
    userCard: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
          .default;
        setUserCard(msgs);
      } catch (error) {
        console.error("Failed to load user card data:", error);
        setUserCard({ userCard: [] });
      }
    })();
  }, [currentLocale]);

  if (!userCard.userCard.length) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-4 xl:gap-4 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {userCard.userCard.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          type={user.type}
          count={user.count}
          year={user.year}
        />
      ))}
    </div>
  );
};

export default UserCardsList;
