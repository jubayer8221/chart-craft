"use client";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface CaHeaderProps{
  selectedView: string
  setSelectedView: (view: string) => void
}

const CaHeader = ({selectedView, setSelectedView}: CaHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isSelected, setIsSelected] = useState("Month");
  const handleToggleDown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectedMenu = (item: string) =>{
    // setIsSelected(item);
    setSelectedView(item)
    setIsOpen(false);
  }

  return (
    <div className="flex items-center justify-between mt-2">
      {/* left  */}
      <div className="flex items-center gap-5">
        <button className="border px-3 py-1 text-sm font-bold rounded-sm cursor-pointer dark:border-[#897c8f] dark:bg-[#463f59]">
          Today
        </button>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-black hover:bg-gray-500 cursor-pointer"><IoIosArrowBack size={15} /></div>
          <p className="text-sm">May 2025</p>
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-black hover:bg-gray-500 cursor-pointer"><IoIosArrowForward size={15} /> </div>
        </div>
      </div>
      {/* right  */}
      <div>
        <div className="relative">
          <button className="border px-2 py-1 text-sm font-bold rounded-sm cursor-pointer dark:border-[#897c8f] dark:bg-[#463f59] min-w-14" onClick={handleToggleDown}>
            {selectedView}
          </button>
          {isOpen && (
            <div className="absolute top-8 bg-white dark:bg-[#463f59] border border-gray-300 dark:border-[#897c8f] w-full rounded-sm overflow-hidden z-50" >
                <button onClick={()=> handleSelectedMenu("Month")} className="w-full text-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 px-2 py-1 text-start">Month</button>
                <button onClick={()=> handleSelectedMenu("Week")}className=" text-start w-full text-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 px-2 py-1">Week</button>
                <button onClick={()=> handleSelectedMenu("Day")} className=" w-full text-start text-sm cursor-pointer hover:bg-gray-300   dark:hover:bg-gray-500 px-2 py-1">Day</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaHeader;
