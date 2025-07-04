"use client";

import React, { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoCloseSharp } from "react-icons/io5";
import { CalendarEventType, useEventStore } from "@/lib/storeC";
// import Link from 'next/link'
import { RiEdit2Line } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";

interface EventSummaryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventType;
}

export function EventSummaryPopover({
  isOpen,
  onClose,
  event,
}: EventSummaryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { events, setEvents, closeEventSummary } = useEventStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<CalendarEventType>({
    id: event.id,
    title: event.title,
    date: event.date,
    description: event.description,
    guests: event.guests,
    startTime: event.startTime,
    endTime: event.endTime,
    endDate: event.endDate,
  });

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // console.log("event====", event)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDelet = () => {
    const confirmDelete = window.confirm(
      `Do you want to delete this event: ${event.title}`
    );
    if (confirmDelete) {
      const updatedEvents = events.filter((ev) => ev.id !== event.id);
      setEvents(updatedEvents);
      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
      closeEventSummary();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Event Summary</h2>
            <button
              onClick={handleEditClick}
              className="w-6 h-6 bg-gray-200 rounded-full p-1 flex items-center justify-center cursor-pointer"
            >
              <RiEdit2Line />
            </button>
            <button
              onClick={handleDelet}
              className="w-6 h-6 bg-gray-200 rounded-full p-1 flex items-center justify-center cursor-pointer"
            >
              <RiDeleteBin6Line />
            </button>
          </div>
          <button onClick={onClose}>
            <IoCloseSharp className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <p>
            <strong>Title:</strong> {event.title}
          </p>
          {/* Format the date before displaying it */}
          <p>
            <strong>Start Date and time:</strong>{" "}
            {dayjs(event.date).format("dddd, MMMM D, YYYY h:mm A")}
          </p>
          <p>
            <strong>End Date and time:</strong> {event.endDate} -{" "}
            {event.endTime}
          </p>
          {/* Add more event details here */}
          <p>
            <strong>Guests:</strong> {event.guests}
          </p>
          <p>
            <strong>Description:</strong> {event.description}
          </p>
        </div>

        {isEditModalOpen && (
          <div className="absolute  bg-black/50 p-4 top-0 inset-0 z-20">
            <h1 className="text-white">Edit Event</h1>
            <form action="">
              <input type="text" value={editFormData.title} placeholder="" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
