
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

const MainClander = () => {

  const selectedView = useSelector((state: RootState)=>state.view.selectedView)
  const dispatch = useDispatch();
  const handleViewChange = (view: string) =>{
    dispatch(setSelectedView(view))
  }

  // console.log("selectedview.......",selectedView);

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
    </div>
  )
}

export default MainClander
