'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface EndTimeProps {
  startTime: string;
  onSelected?: (time: string) => void;
}

export default function EndTime({ startTime, onSelected }: EndTimeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState("00:00")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedTime(startTime)
  }, [startTime])

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
    // Parse startTime (e.g., "01:00 PM")
    const [time, period] = startTime.split(' ')
    const [startHourStr, startMinuteStr] = time.split(':').map(Number)
    let startHour = startHourStr
    if (period === 'PM' && startHour !== 12) startHour += 12
    if (period === 'AM' && startHour === 12) startHour = 0
    const startMinute = startMinuteStr

    // Generate intervals starting from startTime
    for (let hour = startHour; hour < 24; hour++) {
      // Start minutes from startMinute for the first hour, otherwise 0
      const minuteStart = hour === startHour ? startMinute : 0
      for (let minute = minuteStart; minute < 60; minute += 60) {
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
    if (onSelected) {
      onSelected(time)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-28 flex items-center justify-between bg-slate-100 p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTime}
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