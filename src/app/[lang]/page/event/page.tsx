import Events from "@/components/Home/EventCalendar";
import React from "react";

const EventPage = () => {
  return (
    <div>
      <span className="font-bold text-2xl py-4 my-4">Events</span>
      <div className=" w-full h-full rounded-lg">
        <Events></Events>
      </div>
    </div>
  );
};

export default EventPage;
