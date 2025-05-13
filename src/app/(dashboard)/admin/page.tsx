"use client";
// Use dynamic imports with `ssr: false` for components that depend on browser APIs
import dynamic from "next/dynamic";

const Announcements = dynamic(() => import("@/components/Home/Announcements"), { ssr: false });
const BookChart = dynamic(() => import("@/components/Home/BookChart"), { ssr: false });
const ClothingsChart = dynamic(() => import("@/components/Home/ClothingsChart"), { ssr: false });
const ElectronicsCountChart = dynamic(() => import("@/components/Home/ElectronicsCountChart"), { ssr: false });
const EventCalendar = dynamic(() => import("@/components/Home/EventCalendar"), { ssr: false });
const FurnituresChart = dynamic(() => import("@/components/Home/FurnituresChart"), { ssr: false });
const GroceriesChart = dynamic(() => import("@/components/Home/GroceriesChart"), { ssr: false });
const TopSelling = dynamic(() => import("@/components/Home/TopSelling"), { ssr: false });
const Toyschart = dynamic(() => import("@/components/Home/Toyschart"), { ssr: false });
const UserCard = dynamic(() => import("@/components/Home/UserCard"), { ssr: false });


const adminPage = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        {/* left side  */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8 ">
          <div className="flex justify-between gap-4 flex-wrap">
            <UserCard type="Products" />
            <UserCard type="Product types" />
            <UserCard type="Staff" />
            <UserCard type="NJ" />
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
    </>
  );
};
export default adminPage;
