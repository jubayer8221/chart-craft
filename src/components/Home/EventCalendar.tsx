// // "use client";
// // import React, { useState } from "react";
// // import Calendar from "react-calendar";
// // import "react-calendar/dist/Calendar.css";
// // import { TfiLayoutMenuSeparated } from "react-icons/tfi";

// // type ValuePiece = Date | null;
// // type Value = ValuePiece | [ValuePiece, ValuePiece];

// // // TEMPORARY
// // const events = [
// //   {
// //     id: 1,
// //     title: "Lorem ipsum dolor",
// //     time: "12:00 PM - 2:00 PM",
// //     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
// //   },
// //   {
// //     id: 2,
// //     title: "Lorem ipsum dolor",
// //     time: "12:00 PM - 2:00 PM",
// //     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
// //   },
// //   {
// //     id: 3,
// //     title: "Lorem ipsum dolor",
// //     time: "12:00 PM - 2:00 PM",
// //     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
// //   },
// // ];

// // const EventCalendar = () => {
// //   const [value, onChange] = useState<Value>(new Date());
// //   return (
// //     <div className="bg-white dark:bg-[#312c4a] p-4 rounded-md">
// //       <Calendar onChange={onChange} value={value} />
// //       <div className="flex items-center justify-between">
// //         <h1 className="text-xl font-semibold my-4">Events</h1>
// //         <TfiLayoutMenuSeparated width={20} height={20} />
// //         {/* <Image src="/moreDark.png" alt="" width={20} height={20} /> */}
// //       </div>
// //       <div className="flex flex-col gap-4">
// //         {events.map((event) => (
// //           <div
// //             className="p-5 rounded-md border-2 border-gray-100 dark:border-[#685e74] border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
// //             key={event.id}
// //           >
// //             <div className="flex items-center justify-between">
// //               <h1 className="font-semibold text-gray-600 dark:text-white ">
// //                 {event.title}
// //               </h1>
// //               <span className="text-gray-300 text-xs">{event.time}</span>
// //             </div>
// //             <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default EventCalendar;

// "use client";
// import React, { useState, useEffect } from "react";
// // import Calendar, { LooseValue } from "react-calendar";
// import Calendar from "react-calendar";

// // Define Value type locally since it's not exported by react-calendar
// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];
// import "react-calendar/dist/Calendar.css";
// import { TfiLayoutMenuSeparated } from "react-icons/tfi";
// import { usePathname } from "next/navigation";
// import { locales, Locale, isValidLocale } from "@/i18n/routing";

// interface EventItem {
//   id: number;
//   title: string;
//   time: string;
//   description: string;
// }

// interface EventPage {
//   eventsTitle: string;
//   eventList: EventItem[];
// }

// interface LocaleMessages {
//   eventPage?: EventPage;
// }

// const EventCalendar: React.FC = () => {
//   const pathname = usePathname() || "/";
//   const currentLocaleCode = (pathname.split("/")[1] ?? "en") as Locale;
//   const currentLocale = isValidLocale(currentLocaleCode)
//     ? currentLocaleCode
//     : locales[0];

//   const [t, setT] = useState<LocaleMessages>({});
//   const [calendarValue, setCalendarValue] = useState<Value>(new Date());

//   useEffect(() => {
//     (async () => {
//       try {
//         const msgsModule = await import(
//           `@/i18n/messages/${currentLocale}.json`
//         );
//         const msgs = msgsModule.default ?? msgsModule;
//         setT(msgs);
//       } catch (error) {
//         console.error("Failed to load locale messages:", error);
//         setT({});
//       }
//     })();
//   }, [currentLocale]);

//   const { eventsTitle = "", eventList = [] } = t.eventPage || {};

//   if (!eventsTitle) {
//     return <div>Loading...</div>;
//   }

//   const onCalendarChange = (value: Value) => {
//     setCalendarValue(value);
//   };

//   return (
//     <div className="bg-white dark:bg-[#312c4a] p-4 rounded-md">
//       <Calendar onChange={onCalendarChange} value={calendarValue} />
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold my-4">{eventsTitle}</h1>
//         <TfiLayoutMenuSeparated width={20} height={20} />
//       </div>
//       <div className="flex flex-col gap-4">
//         {eventList.map((event) => (
//           <div
//             key={event.id}
//             className="p-5 rounded-md border-2 border-gray-100 dark:border-[#685e74] border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
//           >
//             <div className="flex items-center justify-between">
//               <h1 className="font-semibold text-gray-600 dark:text-white ">
//                 {event.title}
//               </h1>
//               <span className="text-gray-300 text-xs">{event.time}</span>
//             </div>
//             <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EventCalendar;

"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

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
  const [calendarValue, setCalendarValue] = useState<Value>(new Date());

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

  const onCalendarChange = (value: Value) => {
    setCalendarValue(value);
  };

  return (
    <div className="bg-white dark:bg-[#312c4a] p-4 rounded-md">
      <Calendar onChange={onCalendarChange} value={calendarValue} />
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
