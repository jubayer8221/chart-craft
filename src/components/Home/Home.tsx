import BuySellChart from "@/components/buySellChart/BuySellChart";
import React from "react";

const MainPage = () => {
  return (
    <>
      <span className="font-bold text-4xl">Home</span>

      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      {/* <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div> */}
      {/* 
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div> */}
      <div className="border-dashed border border-zinc-500 w-full h-full rounded-lg">
        <BuySellChart></BuySellChart>
      </div>
    </>
  );
};

export default MainPage;
