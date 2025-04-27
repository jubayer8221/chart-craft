"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [date, setDate] = useState<Date>(new Date(2025, 7, 12)); // August 12, 2025

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  // Handle day click to switch to day view and navigate to the clicked date
  const handleNavigate = (newDate: Date) => {
    setDate(newDate); // Update the date to the clicked date
    setView(Views.DAY); // Switch to day view
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      date={date} // Controlled date prop
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      onNavigate={handleNavigate} // Handle day clicks
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 17, 0, 0)}
      defaultDate={new Date(2025, 7, 12)} // August 12, 2025
    />
  );
};

export default BigCalendar;