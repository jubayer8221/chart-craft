'use client'

import React, { useRef, useEffect } from 'react'
import dayjs from 'dayjs'
import { IoCloseSharp } from "react-icons/io5"
import { CalendarEventType } from '@/lib/storeC'

interface EventSummaryPopoverProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEventType
}

export function EventSummaryPopover({ isOpen, onClose, event }: EventSummaryPopoverProps) {

    
    
  const popoverRef = useRef<HTMLDivElement>(null)
  // console.log("event====", event)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Event Summary</h2>
          <button onClick={onClose}>
            <IoCloseSharp className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <p><strong>Title:</strong> {event.title}</p>
          {/* Format the date before displaying it */}
          <p><strong>Start Date and time:</strong> {dayjs(event.date).format("dddd, MMMM D, YYYY h:mm A")}</p>
          <p><strong>End Date and time:</strong> {event.endDate} - {event.endTime}</p>
          {/* Add more event details here */}
          <p><strong>Guests:</strong> {event.guests}</p>
          <p><strong>Description:</strong> {event.description}</p>
        </div>
      </div>
    </div>
  )
}
