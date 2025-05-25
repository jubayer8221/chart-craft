
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
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }
  });

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
          {event.title}
        </div>
      ))}
    </>
  );
}
