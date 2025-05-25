"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useState, useEffect } from "react";

// Define event interface for TypeScript
interface CalendarEvent {
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
}

// Define form state interface
interface EventFormState {
  title: string;
  startDate: string;
  startTime: string;
  endTime: string;
}

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState<Date>(new Date(2025, 3, 27));
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    return savedEvents
      ? JSON.parse(savedEvents, (key, value) => {
          if (key === "start" || key === "end") return new Date(value);
          return value;
        })
      : calendarEvents;
  });
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState<EventFormState>({
    title: "",
    startDate: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
    const day = newDate.getDate();
    if (day !== 6) {
      setView(Views.DAY);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Add new event
  const addNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, startDate, startTime, endTime } = newEvent;

    if (!title || !startDate || !startTime || !endTime) {
      setError("Please fill in all fields");
      return;
    }

    const [year, month, day] = startDate.split("-").map(Number);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = new Date(year, month - 1, day, startHour, startMinute);
    const end = new Date(year, month - 1, day, endHour, endMinute);

    if (start >= end) {
      setError("End time must be after start time");
      return;
    }

    const event: CalendarEvent = {
      title,
      allDay: false,
      start,
      end,
    };

    setEvents([...events, event]);
    setNewEvent({ title: "", startDate: "", startTime: "", endTime: "" });
    setShowForm(false);
    setError(null);
  };

  // Friday hidden dayPropGetter
  const dayPropGetter = (date: Date) => {
    const day = date.getDay();
    if (day === 6) {
      return {
        className: "rbc-day-hidden",
        style: { display: "none" },
      };
    }
    return {};
  };

  const filteredEvents = events.filter((event: CalendarEvent) => {
    const eventDay = new Date(event.start).getDay();
    return eventDay !== 5;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 rounded bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 hover:bg-purple-200"
      >
        {showForm ? "Cancel" : "Add New Event"}
      </button>
      {showForm && (
        <form onSubmit={addNewEvent} className="mb-4 flex flex-col space-y-3">
          <div>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Event Title"
              className="w-full rounded border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="date"
              name="startDate"
              value={newEvent.startDate}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="time"
              name="startTime"
              value={newEvent.startTime}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
            />
            <input
              type="time"
              name="endTime"
              value={newEvent.endTime}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            Save Event
          </button>
        </form>
      )}
      <Calendar
        localizer={localizer}
        events={filteredEvents}
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
    </div>
  );
};

export default BigCalendar;