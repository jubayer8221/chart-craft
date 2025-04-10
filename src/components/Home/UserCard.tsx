import React from "react";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";

const UserCard = ({ type }: { type: string }) => {
  return (
    <div className="rounded-xl odd:bg-[#CFCEFF] even:bg-[#FAE27C] p-4 flex-1 min-w-[130px]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {new Date().toLocaleString("default", { month: "long" })}{" "}
          {new Date().getFullYear()}/
          {(new Date().getFullYear() + 1).toString().slice(-2)}
        </span>
        <span>
          <TfiLayoutMenuSeparated width={24} height={24} />
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">1,224</h1>
      <h1 className="capitalize text-sm font-medium text-zinc-600">{type}</h1>
    </div>
  );
};

export default UserCard;
