"use client";
import { getWeeks } from "@/lib/getTime";
import { useDateStore } from "@/lib/storeC";
import { setSelectedView } from "@/redux/slices/viewStore";
import dayjs from "dayjs";
import React, { Fragment, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { LuUsers } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";

const CRightsideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setMonth, selectedMonthIndex, twoDMonthArray, setDate } = useDateStore();
  const handleToggleMyCalendar = () => {
    setIsOpen(!isOpen);
  };

  const weekOfMonth = getWeeks(selectedMonthIndex);

  console.log("week of Month===", weekOfMonth);
  const dispatch = useDispatch();
  const handleDateclick = (date: dayjs.Dayjs) =>{
    setDate(date)
    dispatch(setSelectedView("Day"))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* create button  */}
      <div>
        <button className="dark:border px-4 py-2 text-md font-bold rounded-sm cursor-pointer bg-gray-600 text-white dark:text-white  dark:border-[#897c8f] dark:bg-[#463f59]">
          CREATE
        </button>
      </div>
      {/* calender picker  */}
      <div className="">
        <div className="flex items-center justify-between">
          <div
            onClick={() => setMonth(selectedMonthIndex - 1)}
            className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-black hover:bg-gray-500 hover:text-white cursor-pointer"
          >
            <IoIosArrowBack size={15} />
          </div>
          <h4>
            {dayjs(new Date(dayjs().year(), selectedMonthIndex)).format(
              "MMMM YYYY"
            )}
          </h4>

          <div
            onClick={() => setMonth(selectedMonthIndex + 1)}
            className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-black hover:bg-gray-500 hover:text-white cursor-pointer"
          >
            <IoIosArrowForward size={15} />{" "}
          </div>
        </div>
        {/* header Row: Days of the week  */}
        <div className="mt-2 grid grid-cols-[auto_1fr]">
          <div className="w-full"></div>
          <div className="grid grid-cols-7 text-xs font-bold">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <span key={i} className="py-1 text-center">
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* main content: weeks and days  */}
        {/* <div className="mt-2 grid grid-cols-[auto_1fr] text-xs">
          
          <div className="grid w-6 grid-rows-5 gap-1 gap-y-3 rounded-sm bg-gray-100 p-1">
            {weekOfMonth.map((week, i)=>(
              <span key={i}>{week}</span>
            ))}
          </div>
        </div> */}

        {/* dates grid  */}
        <div className="grid grid-rows-5 grid-cols-7 gap-1 gap-y-3 text-xs mt-2">
          {twoDMonthArray.map((row, i) => (
            <Fragment key={i}>
              {row.map((date, inx) => (
                <button
                  key={inx}
                  onClick={()=>handleDateclick(date)}
                  className={`${
                    date.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
                      ? "w-5 h-5 bg-[#463f59] text-white dark:text-black rounded-full flex items-center justify-center p-1 cursor-pointer"
                      : "cursor-pointer hover:bg-gray-100 rounded-md "
                  }`}
                >
                  <span className="text-center">{date.format("D")}</span>
                </button>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      {/* search bar  */}
      {/* <div className="relative w-full md:w-auto flex items-center gap-2 text-xs rounded-sm ring-[1.5px] ring-gray-300 dark:ring-[#897c8f] px-2">
        <LuUsers size={14} />
        <input
          type="text"
          placeholder="Search by name..."
          className="w-[200px] py-2 bg-transparent outline-none"
        />
      </div> */}
      {/* my calender */}
      <div>
        <div className="relative">
          <button
            className="p-2 text-sm font-bold rounded-sm cursor-pointer bg-gray-300 dark:bg-[#463f59] flex items-center justify-between w-full"
            onClick={handleToggleMyCalendar}
          >
            <span>My Calendar</span>
            <MdKeyboardArrowDown
              size={16}
              className={`${isOpen ? "" : "rotate-180"}`}
            />
          </button>
          {isOpen && (
            <div className="top-12 px-2  w-full rounded-sm overflow-hidden">
              <div className="flex items-center gap-2 accent-[#463f59]">
                <input
                  type="checkbox"
                  name=""
                  id="work"
                  className="cursor-pointer"
                />
                <label htmlFor="work" className="cursor-pointer">
                  Work
                </label>
              </div>
              <div className="flex items-center gap-2 accent-[#463f59]">
                <input
                  type="checkbox"
                  name=""
                  id="personal"
                  className="cursor-pointer"
                />
                <label htmlFor="personal" className="cursor-pointer">
                  Personal
                </label>
              </div>
              <div className="flex items-center gap-2 accent-[#463f59]">
                <input
                  type="checkbox"
                  name=""
                  id="fitness"
                  className="cursor-pointer"
                />
                <label htmlFor="fitness" className="cursor-pointer">
                  Fitness
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRightsideBar;
