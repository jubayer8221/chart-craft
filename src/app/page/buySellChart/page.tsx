"use client";

import dynamic from "next/dynamic";
import React from "react";

const BuySellChart = dynamic(
  () => import("@/components/buySellChart/BuySellChart"),
  {
    ssr: false,
  }
);

const Page = () => {
  return (
    <div>
      <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl bg-[#0A3A66] text-white font-bold p-2 text-center">
        Buy & Sell Report
      </h1>
      <BuySellChart />
    </div>
  );
};

export default Page;
