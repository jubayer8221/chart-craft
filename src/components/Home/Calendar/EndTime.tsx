'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface EndTimeProps{
    startTime: string;
}

export default function EndTime({startTime}: EndTimeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState(startTime)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
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
    const [startHour, startMinute] = startTime.split(":").map(Number);
    for (let hour = startHour; hour < 24; hour++) {
      for (let minute = startMinute; minute < 60; minute += 30) {
        intervals.push(
          `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        )
      }
    }
    return intervals
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setIsOpen(false)
  
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
