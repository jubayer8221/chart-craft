'use client'

import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
// import { CalendarEventType, useEventStore } from '@/lib/storeC'

interface EditEventPopoverProps {
    onClose: ()=> void;
//   event: CalendarEventType;
  onSubmit: (updatedEvent: CalendarEventType) => void
}

// Placeholder for AddTime component (replace with actual implementation if available)
const AddTime: React.FC<{ selectedTime: string; onChange: (time: string) => void }> = ({
  selectedTime,
  onChange,
}) => {
  return (
    <input
      type="time"
      value={selectedTime}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded"
    />
  )
}

const EditEventPopover = ({onClose, onSubmit }: EditEventPopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null)
//   const { updateEvent } = useEventStore()
//   const [] = useState(false)

  // Initialize form state with event data
  const [form, setForm] = useState({
    title: event.title || '',
    startDate: dayjs(event.date).format('YYYY-MM-DD') || '',
    endDate: event.endDate || dayjs(event.date).format('YYYY-MM-DD'),
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    guests: event.guests || '',
    description: event.description || '',
  })

  // Handle outside clicks to close popover
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
//         onClose()
//       }
//     }

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [isOpen, onClose])

  // Update form when event prop changes
  useEffect(() => {
    setForm({
      title: event.title || '',
      startDate: dayjs(event.date).format('YYYY-MM-DD') || '',
      endDate: event.endDate || dayjs(event.date).format('YYYY-MM-DD'),
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      guests: event.guests || '',
      description: event.description || '',
    })
  }, [event])

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle time changes
  const handleTimeChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedEvent: CalendarEventType = {
      ...event,
      title: form.title,
      date: dayjs(form.startDate),
      endDate: form.endDate,
      startTime: form.startTime,
      endTime: form.endTime,
      guests: form.guests,
      description: form.description,
    }
    updateEvent(updatedEvent) // Update store
    onSubmit(updatedEvent) // Notify parent (EventSummaryPopover)
    onClose() // Close popover
  }

//   if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      className="flex flex-col h-full p-4 bg-white overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Edit Event</h2>
        <button onClick={onClose} aria-label="Close">
          <IoCloseSharp className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Event Title"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <AddTime
            selectedTime={form.startTime}
            onChange={(time) => handleTimeChange('startTime', time)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <AddTime
            selectedTime={form.endTime}
            onChange={(time) => handleTimeChange('endTime', time)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Guests</label>
          <input
            type="text"
            name="guests"
            value={form.guests}
            onChange={handleInputChange}
            placeholder="Enter guests (e.g., email1, email2)"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Event description"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditEventPopover