// "use client";
import React from "react";
import UserCard from "./UserCard";
import ElectronicsCountChart from "./ElectronicsCountChart";
import ClothingsChart from "./ClothingsChart";
import FurnituresChart from "./FurnituresChart";
import Toyschart from "./Toyschart";
import BookChart from "./BookChart";
import GroceriesChart from "./GroceriesChart";
import EventCalendar from "./EventCalendar";
import Announcements from "./Announcements";
// import TopSelling from "./TopSelling";

const MainPage = () => {
  return (
    <>
      <div className="flex flex-col md:flex-col lg:flex-row gap-4">
        {/* left side  */}
        <div className="w-full  lg:w-2/3 flex flex-col gap-4">
          <div className="flex justify-between gap-4 flex-wrap">
            <UserCard />
          </div>
          <div className="flex flex-col gap-4">
            {/* top  */}
            <div className="flex gap-4 flex-col lg:flex-row">
              {/* COUNT CHART */}
              <div className="w-full lg:w-1/2 h-[350px]">
                <ElectronicsCountChart />
              </div>
              {/* ATTENDANCE CHART */}
              <div className="w-full lg:w-1/2 h-[350px]">
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
            <div className="w-full lg:w-1/2 h-[350px]">
              <BookChart />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-1/2 h-[350px]">
              <GroceriesChart />
            </div>
          </div>
        </div>
        {/* right side  */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <EventCalendar />
          <Announcements />
        </div>
      </div>
      <div>{/* <TopSelling /> */}</div>
    </>
  );
};
export default MainPage;
