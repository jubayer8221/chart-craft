"use client";
import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

interface EventItem {
  id: number;
  title: string;
  time: string;
  description: string;
}

interface EventPage {
  eventsTitle: string;
  eventList: EventItem[];
}

interface LocaleMessages {
  eventPage?: EventPage;
}

const EventCalendar: React.FC = () => {
  const pathname = usePathname() || "/";
  const currentLocaleCode = (pathname.split("/")[1] ?? "en") as Locale;
  const currentLocale = isValidLocale(currentLocaleCode)
    ? currentLocaleCode
    : locales[0];

  const [t, setT] = useState<LocaleMessages>({});
  // const [calendarValue, setCalendarValue] = useState<Value>(new Date());

  useEffect(() => {
    (async () => {
      try {
        const msgsModule = await import(
          `@/i18n/messages/${currentLocale}.json`
        );
        const msgs = msgsModule.default ?? msgsModule;
        setT(msgs);
      } catch (error) {
        console.error("Failed to load locale messages:", error);
        setT({});
      }
    })();
  }, [currentLocale]);

  if (!t.eventPage) {
    return <div>Loading...</div>;
  }

  const { eventsTitle = "Events", eventList = [] } = t.eventPage;

  // const onCalendarChange = (value: Value) => {
  //   setCalendarValue(value);
  // };

  return (
    <div className="bg-white dark:bg-[#312c4a] p-4 rounded-md">
      {/* <Calendar onChange={onCalendarChange} value={calendarValue} /> */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">{eventsTitle}</h1>
        <TfiLayoutMenuSeparated size={20} />
      </div>

      {eventList.length === 0 ? (
        <p className="text-gray-500">No events available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {eventList.map((event) => (
            <div
              key={event.id}
              className="p-5 rounded-md border-2 border-gray-100 dark:border-[#685e74] border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600 dark:text-white ">
                  {event.title}
                </h1>
                <span className="text-gray-300 text-xs">{event.time}</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
