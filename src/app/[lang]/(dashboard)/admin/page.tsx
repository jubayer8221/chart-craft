"use client";
// Use dynamic imports with `ssr: false` for components that depend on browser APIs

import Announcements from "@/components/Home/Announcements";
import BookChart from "@/components/Home/BookChart";
import ClothingsChart from "@/components/Home/ClothingsChart";
import ElectronicsCountChart from "@/components/Home/ElectronicsCountChart";
import EventCalendar from "@/components/Home/EventCalendar";
import FurnituresChart from "@/components/Home/FurnituresChart";
import GroceriesChart from "@/components/Home/GroceriesChart";
import TopSelling from "@/components/Home/TopSelling";
import Toyschart from "@/components/Home/Toyschart";
import UserCard from "@/components/Home/UserCard";
import { TableGrid } from "@/components/TableCompo/TableGrid";
import React from "react";
// import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";

const adminPage = () => {
  return (
    <>
      {/* <PrivateRoute> */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* left side  */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8 ">
          <div className="justify-between gap-4 flex-wrap">
            <UserCard />
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
          </div>

          {/* middlle  */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/2 h-[350px]">
              <FurnituresChart />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-1/2 h-[350px]">
              <Toyschart />
            </div>
          </div>

          {/* botom  */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-2/3 h-[350px]">
              <BookChart />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-1/3 h-[350px]">
              <GroceriesChart />
            </div>
          </div>
        </div>
        {/* right side  */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar />
          <Announcements />
        </div>
      </div>
      <div>
        <TopSelling />
      </div>
      <div className="w-full">
        <TableGrid></TableGrid>
      </div>
      {/* </PrivateRoute> */}
    </>
  );
};
export default adminPage;
