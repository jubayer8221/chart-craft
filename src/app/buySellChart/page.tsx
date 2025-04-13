import React from "react";
import BuySellChart from "@/components/buySellChart/BuySellChart";

const page = () => {
  return (
    <div>
      <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl bg-[#0A3A66] text-white font-bold p-2 text-center">
        Buy & Sell Report
      </h1>
      <BuySellChart></BuySellChart>
    </div>
  );
};

export default page;
