import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuAlarmClock } from "react-icons/lu";
import {
  HiOutlineMenuAlt2,
  HiOutlineMenuAlt4,
  HiOutlineUsers,
} from "react-icons/hi";
import AddTime from "./AddTime";
import EndTime from "../EndTime";

// import AddTime from './AddTime';

interface EventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}



const EventPopover = ({ isOpen, onClose, date }: EventPopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [startTime, setStartTime] = useState("00:00");
  // const [endTime, setEndTime] = useState("12:30pm");

  const today = dayjs().format("YYYY-MM-DD");
  console.log("start time+====", startTime);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

// update endDate if startDate chnages and endDateafter cnages 
  useEffect(()=>{
    if(dayjs(startDate).isAfter(dayjs(endDate))){
      setEndDate(startDate);
    }
  },[startDate, endDate])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white shadow-lg"
        onClick={handlePopoverClick}
      >
        <div className="mb-2 flex items-center justify-between rounded-md bg-slate-100 p-1">
          <HiOutlineMenuAlt4 />
          <button onClick={handleClose}>
            <IoClose className="h-4 w-4" />
          </button>
        </div>
        <form
          className="space-y-4 px-2 w-full"
          onSubmit={(e) => e.preventDefault()}
          action=""
        >
          <div>
            <input
              type="text"
              placeholder="Add title"
              className="my-4 w-full rounded-none border-0 border-b text-2xl focus-visible:border-b-2 focus-visible:border-b-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex flex-col gap-2 m-0">
            <div className="flex flex-col space-y-3 text-sm">
              <div>
                <h3 className="text-[16px] font-semibold mb-3">Start date & time</h3>
                <div className="flex items-center gap-2">
                  <LuAlarmClock className="size-5 text-gray-600" />
                  <input
                    type="date"
                    value={dayjs(startDate).format("YYYY-MM-DD")}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={today}
                    className="rounded-lg border-0 bg-slate-100 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 p-2"
                  />
                  <AddTime onTimeSelect={setStartTime} />
                </div>
              </div>
              <div className="">
                <h3 className="text-[16px] font-semibold mb-3">End Date & time</h3>
                <div className="flex items-center gap-2">
                  <LuAlarmClock className="size-5 text-gray-600" />
                  <input
                    type="date"
                    value={dayjs(endDate).format("YYYY-MM-DD")}
                    min={dayjs(startDate).format("YYYY-MM-DD")}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border-0 bg-slate-100 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 p-2"
                  />
                  <EndTime startTime={startTime} />
                </div>
              </div>
              <input type="hidden" name="startDate" value={startDate} />
              <input type="hidden" name="endDate" value={endDate} />
              {/* 
              <input type="hidden" name="startTime" value={startTime} />
              <input type="hidden" name="endTime" value={endTime} /> */}
            </div>

            <div className="flex items-center gap-2">
              <HiOutlineUsers className="size-5 text-slate-600" />
              <input
                type="text"
                name="guests"
                placeholder="Add guests"
                className="w-full rounded-lg border-0 bg-slate-100 p-2 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <HiOutlineMenuAlt2 className="size-5 text-slate-600" />
              <input
                type="text"
                name="description"
                placeholder="Add description"
                className="w-full rounded-lg border-0 bg-slate-100 p-2 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex justify-end space-x-2 my-2">
              <button
                type="submit"
                className="bg-slate-100 px-3 py-2 rounded-md cursor-pointer text-sm font-semibold hover:bg-green-300"
              >
                SAVE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventPopover;
