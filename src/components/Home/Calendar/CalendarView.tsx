"use client";
import { getMonth } from "@/lib/getTime";
import React, { Fragment } from "react";
import CalendarViewBox from "./CalendarViewBox";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

const CalendarView = () => {
  const currentMonth = getMonth();

  // const {twoDMonthArray} = useSelector((state:RootState) => state.date);
  // console.table(getMonth());
  
  return (
    <div className="w-full overflow-x-auto scrollbar-hiden">
      <div className="grid grid-rows-5 grid-cols-7 gap-0 min-w-[1200px]">
        {currentMonth.map((row, i) => (
          <Fragment key={i}>
            {row.map((date, inx) => (
              <CalendarViewBox key={inx} day={date} indexRow={i} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
