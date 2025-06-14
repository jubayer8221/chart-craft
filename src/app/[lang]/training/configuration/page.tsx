import Events from "@/components/Home/EventCalendar";
import React from "react";

const ConfigurationPage = () => {
  return (
    <div>
      <span className="font-bold text-2xl py-4 my-4">Events</span>

      {/* <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div> */}
      <div className=" w-full h-full rounded-lg">
        <Events></Events>
      </div>
    </div>
  );
};

export default ConfigurationPage;
