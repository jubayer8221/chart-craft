'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useEventStore } from '@/lib/storeC'

interface AddTimeProps {
  onTimeSelect?: (time: string) => void
}

export default function AddTime({ onTimeSelect }: AddTimeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedTime, setSelectedTime } = useEventStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const generateTimeIntervals = () => {
    const intervals = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const period = hour < 12 ? 'AM' : 'PM'
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        intervals.push(
          `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`
        )
      }
    }
    return intervals
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setIsOpen(false)
    if (onTimeSelect) {
      onTimeSelect(time)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-28 flex items-center justify-between bg-slate-100 p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTime || '00:00'}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-28 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md z-20">
          <div className="p-1">
            {generateTimeIntervals().map((time) => (
              <button
                key={time}
                className={`block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 focus:outline-none transition-colors duration-150 ${
                  selectedTime === time ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}