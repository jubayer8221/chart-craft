import React from "react";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";

const UserCard = ({ type }: { type: string }) => {
  return (
    <div className="rounded-xl odd:bg-[#0A3A66] dark:odd:bg-[#312c4a] even:bg-[#00A9B4] dark:even:bg-[#685e74] text-white p-4 flex-1 min-w-[130px]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] bg-white dark:bg-[#685e74] px-2 py-1 rounded-full text-green-600 dark:text-white">
          2024/25
        </span>
        <span>
          <TfiLayoutMenuSeparated width={24} height={24} />
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">1,224</h1>
      <h1 className="capitalize text-sm font-medium text-zinc-">{type}</h1>
    </div>
  );
};

export default UserCard;
