
'use client'

import React from 'react'
import CaHeader from './CHeader/CaHeader'
import CalendarView from './CalendarView'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useDispatch } from 'react-redux'
import { setSelectedView } from '@/redux/slices/viewStore'
import CalendarWeekView from './CalendarWeekView'
import CalendarDayView from './CalendarDayView'
import EventPopover from './EventPopover/EventPopover'
import { useDateStore, useEventStore } from '@/lib/storeC'
import { EventSummaryPopover } from './EventPopover/EventSummary'

const MainClander = () => {

  const selectedView = useSelector((state: RootState)=>state.view.selectedView)
  const dispatch = useDispatch();
  const handleViewChange = (view: string) =>{
    dispatch(setSelectedView(view))
  }

  const {userSelectedDate} = useDateStore()

  // console.log("selectedview.......",selectedView);


  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    // setEvents,
  } = useEventStore()

  return (
    <div className=''>
      {/* Header  */}
    <CaHeader selectedView={selectedView} setSelectedView={handleViewChange} />

    <div className='w-full flex-1 mt-3'>
      {/* <CalendarView /> */}
      {selectedView === "Month" && <CalendarView />}
      {selectedView === "Week" && <CalendarWeekView />}
      {selectedView === "Day" && <CalendarDayView />}
    </div>
    {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}

      {isEventSummaryOpen && selectedEvent && (
        <EventSummaryPopover
          isOpen={isEventSummaryOpen}
          onClose={closeEventSummary}
          event={selectedEvent}
        />
      )}
    </div>
  )
}

export default MainClander
