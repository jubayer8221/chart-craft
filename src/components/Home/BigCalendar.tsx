"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WEEK); 
  const [date, setDate] = useState<Date>(new Date(2025, 3, 27)); 

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
    setView(Views.DAY);
  };

  // friyday hidden dayPropGetter 
  const dayPropGetter = (date: Date) => {
    const day = date.getDay(); 
    if (day === 5) { 
      return {
        style: {
          display: "none", 
        },
      };
    }
    return {};
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["week", "day"]} 
      view={view}
      date={date}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      onNavigate={handleNavigate}
      min={new Date(2025, 3, 27, 8, 0, 0)} 
      max={new Date(2025, 3, 27, 17, 0, 0)} 
      defaultDate={new Date(2025, 3, 27)} 
      dayPropGetter={dayPropGetter} 
    />
  );
};
export default BigCalendar;