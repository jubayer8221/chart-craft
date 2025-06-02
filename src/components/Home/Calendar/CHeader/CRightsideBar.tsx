"use client";
// import dayjs from "dayjs";
import React, { useState } from "react";
import { LuUsers } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";

const CRightsideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleMyCalendar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* create button  */}
      <div>
        <button className="dark:border px-4 py-2 text-md font-bold rounded-sm cursor-pointer bg-gray-600 text-white dark:text-white  dark:border-[#897c8f] dark:bg-[#463f59]">
          CREATE
        </button>
      </div>
      {/* calender picker  */}
      <div className="my-6 p-2">
        <div>
          <h4></h4>
        </div>
      </div>
      {/* search bar  */}
      <div className="relative w-full md:w-auto flex items-center gap-2 text-xs rounded-sm ring-[1.5px] ring-gray-300 dark:ring-[#897c8f] px-2">
        <LuUsers size={14} />
        <input
          type="text"
          placeholder="Search by name..."
          className="w-[200px] py-2 bg-transparent outline-none"
        />
      </div>
      {/* my calender */}
      <div>
        <div className="relative">
          <button
            className="p-2 text-sm font-bold rounded-sm cursor-pointer bg-gray-300 dark:bg-[#463f59] flex items-center justify-between w-full"
            onClick={handleToggleMyCalendar}
          >
            <span>My Calendar</span>
            <MdKeyboardArrowDown size={16} className={`${isOpen ? "" : "rotate-180"}`} />
          </button>
          {isOpen && (
            <div className="top-12 px-2  w-full rounded-sm overflow-hidden">
              <div className="flex items-center gap-2 accent-[#463f59]">
                <input type="checkbox" name="" id="work" className="cursor-pointer" />
                <label htmlFor="work" className="cursor-pointer">Work</label>
              </div>
              <div className="flex items-center gap-2 accent-[#463f59]">
                <input type="checkbox" name="" id="personal" className="cursor-pointer"/>
                <label htmlFor="personal" className="cursor-pointer">Personal</label>
              </div>
              <div className="flex items-center gap-2 accent-[#463f59]">
                <input type="checkbox" name="" id="fitness" className="cursor-pointer" />
                <label htmlFor="fitness" className="cursor-pointer">Fitness</label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRightsideBar;
