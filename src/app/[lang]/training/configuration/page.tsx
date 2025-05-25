import Events from "@/components/Home/EventCalendar";
import React from "react";

const ConfigurationPage = () => {
  return (
    <>
      <span className="font-bold text-4xl">Configuration</span>

      {/* <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div> */}
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg">
        <Events></Events>
      </div>
    </>
  );
};

export default ConfigurationPage;
