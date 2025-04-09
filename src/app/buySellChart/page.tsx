import React from "react";
import BuySellChart from "@/components/buySellChart/BuySellChart";

const page = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold pt-5 mb-2 text-center">
        Buy & Sell Report
      </h1>
      <BuySellChart></BuySellChart>
    </div>
  );
};

export default page;
