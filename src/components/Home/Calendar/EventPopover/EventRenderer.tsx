import { useEventStore, CalendarEventType } from "@/lib/storeC";
import dayjs from "dayjs";
import React from "react";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "Month" | "Week" | "Day";
  events: CalendarEventType[];
};

export function EventRenderer({ date, view, events }: EventRendererProps) {
  const { openEventSummary } = useEventStore();

  const filteredEvents = events.filter((event: CalendarEventType) => {
    if (view === "Month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "Week" || view === "Day") {
      return (
        event.date.format("DD-MM-YY hh:mm A") ===
        date.format("DD-MM-YY hh:mm A")
      );
    }
// console.log("event: eeee", event)
    return false;
  });

  // console.log("eventsfileter: ", filteredEvents);

  return (
    <>
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          onClick={(e) => {
            e.stopPropagation();
            openEventSummary(event);
          }}
          className="line-clamp-1 w-[90%] cursor-pointer rounded-sm bg-green-700 p-1 text-sm text-white"
        >
          {view === "Month" ? (
            <div>
            {event.title}{" "}
            {event.startTime}
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <div className="text-[10px]">{event.startTime}</div>
                <div className="text-[12px] font-bold">{event.title}</div>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
}
