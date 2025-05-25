import { getHours, getWeekDays } from "@/lib/getTime";
import { useDateStore, useEventStore } from "@/lib/storeC";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { EventRenderer } from "./EventPopover/EventRenderer";

const CalendarWeekView = () => {
  // const userSelectedDate = dayjs();
  const [currentTime, setCurrentTime] = useState(dayjs());
  const {userSelectedDate, setDate} = useDateStore()
  const {openPopover, events} = useEventStore();

  const days = getWeekDays(userSelectedDate);
  const hours = getHours; // Assuming getHours is an array of dayjs objects

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  console.log("hours....", hours);

  return (
    <>
    {/* top table  */}
      <div className="flex items-center justify-between border border-gray-300">
        <div className="w-16 border-r border-gray-300 bg-gray-100">
          <div className="h-12 flex items-center justify-center font-medium text-gray-500 text-sm">
            GMT +2
          </div>
        </div>
        {days.map(({ currentDate, today }, inx) => (
          <div
            key={inx}
            className={`flex-1 flex items-center justify-center h-12 border-r last:border-r-0 border-gray-300 text-sm ${
              today ? "text-green-700 bg-green-50" : "bg-white"
            }`}
          >
            <div className="flex flex-col items-center">
              <div>{currentDate.format("ddd")}</div>
              <div>{currentDate.format("DD")}</div>
            </div>
          </div>
        ))}
      </div>

        {/* bottom table  */}
      <div className="overflow-y-auto h-[550px] scrollbar-hiden">
        <div className="flex border border-gray-300 border-t-0 last:border-r-0 -mt-[64px]">
          <div className="w-16 border-r border-gray-300 bg-gray-100 last:border-r-0">
            {hours.map((hour, index) => (
              <div
                key={index}
                className="h-16 flex items-center justify-center text-xs border-b border-gray-300 last:border-b-0 text-gray-600"
              >
                {hour.format("hh:mm A")}
              </div>
            ))}
          </div>
            
          {/* Week days corresponding boxes */}
          {days.map(({ isCurrentDay, today }, index) => {
            const dayDate = userSelectedDate.startOf("week").add(index, "day");
            return (
              <div
                key={index}
                className="relative flex-1 flex flex-col border-r border-gray-300 last:border-ra-0"
              >
                {hours.map((hour, i) => (
                  <div
                    key={i}
                    className={`relative h-16 flex items-center justify-center border-b border-gray-300 last:border-b-0 cursor-pointer hover:bg-gray-100`} onClick={()=>{setDate(dayDate.hour(hour.hour())); openPopover()}}
                  >
                    {/* Content for each cell can be added here */}

                    <EventRenderer events={events} date={dayDate.hour(hour.hour())} view="Week"  />
                  </div>
                ))}

                {/* current time indicator */}
                 {isCurrentDay(dayDate)&& today && (
                  <div className="absolute h-0.5 w-full bg-green-500" style={{top: `${(currentTime.hour() / 24) * 100}%`}}>

                  </div>
                 )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CalendarWeekView;
