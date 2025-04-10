"use client";
import React from "react";
import UserCard from "./UserCard";
import ElectronicsCountChart from "./ElectronicsCountChart";
import ClothingsChart from "./ClothingsChart";
import Link from "next/link";

const MainPage = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {/* left side  */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8 ">
          <div className="flex justify-between gap-4 flex-wrap">
            <UserCard type="Products" />
            <UserCard type="Product types" />
            <UserCard type="Staff" />
            <Link href="/buySellChart">
              <UserCard type="Buy and Sell" />
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            {/* top  */}
            <div className="flex gap-4 flex-col lg:flex-row">
              {/* COUNT CHART */}
              <div className="w-full lg:w-1/3 h-[350px]">
                <ElectronicsCountChart />
              </div>
              {/* ATTENDANCE CHART */}
              <div className="w-full lg:w-2/3 h-[350px]">
                <ClothingsChart />
              </div>
            </div>
            {/* middlle  */}
            <div className="flex gap-4 flex-col lg:flex-row">
              {/* COUNT CHART */}
              <div className="w-full lg:w-1/2 h-[350px]">
                <ElectronicsCountChart />
              </div>
              {/* ATTENDANCE CHART */}
              <div className="w-full lg:w-1/2 h-[350px]">
                <ElectronicsCountChart />
              </div>
            </div>
            {/* botom  */}
            <div className="flex gap-4 flex-col lg:flex-row">
              {/* COUNT CHART */}
              <div className="w-full lg:w-2/3 h-[350px]">
                <ElectronicsCountChart />
              </div>
              {/* ATTENDANCE CHART */}
              <div className="w-full lg:w-1/3 h-[350px]">
                <ElectronicsCountChart />
              </div>
            </div>
          </div>
        </div>
        {/* right side  */}
        <div className="w-full lg:w-1/3">right</div>
      </div>
    </>
  );
};
export default MainPage;
