// import { getHours } from "@/lib/getTime";
import { getHours, isCurrentDay } from "@/lib/getTime";
import { useDateStore, useEventStore } from "@/lib/storeC";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const CalendarDayView = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  const { userSelectedDate, setDate} = useDateStore();
  const {openPopover} = useEventStore()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isToday =
    userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  return (
    <>
      <div className="flex border">
        <div className="w-16 border-r border-gray-300 bg-gray-100 dark:bg-">
          <div className="h-12 flex items-center justify-center font-medium text-gray-500 text-sm">
            GMT +2
          </div>
        </div>
        <div
          className={`flex-1 flex items-center pl-2 ${
            isToday ? "bg-green-50 text-green-700" : "bg-white"
          }`}
        >
          <div className="flex flex-col items-center">
            <h4 className="text-sm font-medium">
              {userSelectedDate.format("ddd")}
            </h4>
            <h4 className="text-sm">{userSelectedDate.format("DD")}</h4>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-[550px]">
        <div className="flex border border-t-0">
          <div className="w-16 border-r bg-gray-100">
            {getHours.map((hour, index) => (
              <div
                key={index}
                className="h-16 text-xs flex flex-col items-center justify-center border-b last:border-b-0"
              >
                {hour.format("hh:mm A")}
              </div>
            ))}
          </div>

          {/* Day/Box column  */}
          <div className="flex-1 relative">
            {getHours.map((hour, i) => (
              <div
                key={i}
                className="flex flex-col h-16 cursor-pointer border-t first:border-t-0 hover:bg-gray-100" onClick={()=>{setDate(userSelectedDate.hour(hour.hour())); openPopover();}}
              ></div>
            ))}

            {isCurrentDay(userSelectedDate) && (
              <div className="absolute h-0.5 w-full bg-green-500 " style={{top: `${(currentTime.hour() / 24) * 100}%`}}>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarDayView;
